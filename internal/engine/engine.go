package engine

import (
	"math"
	"sort"
	"strconv"
	"strings"

	"github.com/cwooddgr/haunt-go/internal/js"
)

type op uint8

const (
	opEqConst op = iota
	opNeqConst
	opEqVar
	opNeqVar
	opInSet
	opBindSet
	opCmp
	opAny
	opUnknown
)

// Test is one field test inside a condition.
type Test struct {
	Field    string
	Index    int
	Op       op
	Value    js.Value
	ValueVar string // cmp against a bound variable
	HasVVar  bool
	Set      []js.Value
	Var      string
	Cmp      string
	Implicit bool
}

// Cond is one condition element.
type Cond struct {
	Cls          string
	IsPositional bool
	PrefixLength int // -1 = null
	Negated      bool
	Tests        []Test
}

// Rule is a production.
type Rule struct {
	Name        string
	Priority    float64
	SourceIndex float64
	Conds       []*Cond
	Action      js.Func
	Obj         js.Value // the JS rule object, for code that pokes at rules
	spec        int
	specDone    bool

	// Match cache: the first unrefracted instantiation stays valid until a
	// class the rule reads changes, WM is cleared, or refraction changes.
	classes  []*classInfo // distinct classes across all conditions
	posCls   []*classInfo // classes of positive conditions
	condCls  []*classInfo // per condition
	cacheOK  bool
	cacheVer []uint64
	cacheEp  uint64
	cacheRef uint64
	cached   *instance
}

func (r *Rule) prepare(wm *WM) {
	if r.condCls != nil {
		return
	}
	seen := map[string]bool{}
	r.condCls = make([]*classInfo, len(r.Conds))
	for i, c := range r.Conds {
		ci := wm.ci(c.Cls)
		r.condCls[i] = ci
		if !seen[c.Cls] {
			seen[c.Cls] = true
			r.classes = append(r.classes, ci)
		}
		if !c.Negated {
			r.posCls = append(r.posCls, ci)
		}
	}
	r.cacheVer = make([]uint64, len(r.classes))
}

func (r *Rule) specificity() int {
	if !r.specDone {
		n := 0
		for _, c := range r.Conds {
			for _, t := range c.Tests {
				if !t.Implicit {
					n++
				}
			}
		}
		r.spec, r.specDone = n, true
	}
	return r.spec
}

// RuleFromObject converts a translated JS rule object into a Rule.
func RuleFromObject(o js.Value) *Rule {
	r := &Rule{
		Name:        js.ToString(js.Get(o, "name")),
		Priority:    js.ToNumber(js.Or(js.Get(o, "priority"), func() js.Value { return float64(0) })),
		SourceIndex: js.ToNumber(js.Get(o, "sourceIndex")),
		Obj:         o,
	}
	if f, ok := js.Get(o, "action").(js.Func); ok {
		r.Action = f
	}
	for _, c := range js.Iter(js.Get(o, "conditions")) {
		r.Conds = append(r.Conds, condFromObject(c))
	}
	return r
}

func condFromObject(c js.Value) *Cond {
	cond := &Cond{
		Cls:          js.ToString(js.Get(c, "cls")),
		IsPositional: js.Truthy(js.Get(c, "isPositional")),
		Negated:      js.Truthy(js.Get(c, "negated")),
		PrefixLength: -1,
	}
	if pl := js.Get(c, "prefixLength"); !js.IsNullish(pl) {
		cond.PrefixLength = int(js.ToNumber(pl))
	}
	if ts := js.Get(c, "tests"); !js.IsNullish(ts) {
		for _, t := range js.Iter(ts) {
			cond.Tests = append(cond.Tests, testFromObject(t))
		}
	}
	return cond
}

func testFromObject(t js.Value) Test {
	x := Test{
		Implicit: js.Truthy(js.Get(t, "implicit")),
	}
	if f := js.Get(t, "field"); f != nil {
		x.Field = js.ToString(f)
	}
	if i := js.Get(t, "index"); i != nil {
		x.Index = int(js.ToNumber(i))
	}
	x.Value = js.Get(t, "value")
	if v := js.Get(t, "var"); v != nil {
		x.Var = js.ToString(v)
	}
	if s := js.Get(t, "set"); s != nil {
		x.Set = js.Iter(s)
	}
	if c := js.Get(t, "cmp"); c != nil {
		x.Cmp = js.ToString(c)
	}
	switch js.ToString(js.Get(t, "op")) {
	case "eq_const":
		x.Op = opEqConst
	case "neq_const":
		x.Op = opNeqConst
	case "eq_var":
		x.Op = opEqVar
	case "neq_var":
		x.Op = opNeqVar
	case "in_set":
		x.Op = opInSet
	case "bind_set":
		x.Op = opBindSet
	case "cmp":
		x.Op = opCmp
		if o, ok := x.Value.(js.PropObj); ok && js.Has(o, "var") {
			x.HasVVar = true
			x.ValueVar = js.ToString(o.GetProp("var"))
		}
	case "any":
		x.Op = opAny
	default:
		x.Op = opUnknown
	}
	return x
}

// Engine runs the recognize-act cycle.
type Engine struct {
	Rules     []*Rule
	WM        *WM
	Refracted map[string]struct{}
	Halted    bool
	Cycle     int
	MaxCycles int
	// Call invokes a rule action; the game wires it to pass (m, wm, term, engine).
	Call func(r *Rule, m *js.Object)
	// Yield runs between cycles (the JS awaits a macrotask there).
	Yield func()
	// OnFire, if set, sees every rule that fires (coverage tooling).
	OnFire func(r *Rule)
	// refEpoch bumps whenever refraction is cleared or edited wholesale.
	refEpoch uint64
	// TurnLimit, when > 0, stops Run once a single turn (the cycles
	// between two reads of input) exceeds it. See TurnStarted.
	TurnLimit  int
	turnCycles int
	turnSeen   map[uint64]bool
}

// TurnStarted resets the per-turn loop detection; the game calls it each
// time it reads input.
func (e *Engine) TurnStarted() {
	e.turnCycles = 0
	e.turnSeen = nil
}

// loopCheckAfter is when a turn starts hashing working memory. Normal turns
// fire under 30 rules; long "then" chains run a few hundred cycles without
// ever repeating a state.
const loopCheckAfter = 50

// looping reports whether working memory's contents (ignoring ids and
// stamps) have repeated within this turn: the rules are cycling.
func (e *Engine) looping() bool {
	h := e.WM.ContentHash()
	if e.turnSeen == nil {
		e.turnSeen = map[uint64]bool{}
	}
	if e.turnSeen[h] {
		return true
	}
	e.turnSeen[h] = true
	return false
}

// ClearRefracted empties the refraction set (engine.refracted.clear()).
func (e *Engine) ClearRefracted() {
	e.Refracted = map[string]struct{}{}
	e.refEpoch++
}

func New(wm *WM) *Engine {
	return &Engine{WM: wm, Refracted: map[string]struct{}{}, MaxCycles: 200000}
}

// RuleError wraps a panic from inside a rule action (engine.run's catch).
type RuleError struct {
	Rule string
	Err  any
}

// Run fires rules until none match, halt, or MaxCycles.
func (e *Engine) Run() {
	for !e.Halted {
		e.Cycle++
		if e.Cycle-1 >= e.MaxCycles {
			break
		}
		// Laird's word-order rewrites (name8 for "on", name9 for "off")
		// feed themselves on input like "take off off". The JS spins
		// silently until MaxCycles and then ends the game; stopping when
		// the turn's state repeats prints the same thing without pinning
		// the Pi's one core for an hour. TurnLimit backstops other loops.
		if e.TurnLimit > 0 {
			e.turnCycles++
			if e.turnCycles > e.TurnLimit || (e.turnCycles > loopCheckAfter && e.looping()) {
				break
			}
		}
		inst := e.findBest()
		if inst == nil {
			break
		}
		e.Refracted[inst.refKey] = struct{}{}
		inst.rule.cacheOK = false
		if e.OnFire != nil {
			e.OnFire(inst.rule)
		}
		if e.Yield != nil {
			e.Yield()
		}
		e.fire(inst)
	}
}

func (e *Engine) fire(inst *instance) {
	defer func() {
		if r := recover(); r != nil {
			if _, ok := r.(*RuleError); ok {
				panic(r)
			}
			panic(&RuleError{Rule: inst.rule.Name, Err: r})
		}
	}()
	e.Call(inst.rule, inst.bindings())
}

type instance struct {
	rule    *Rule
	matched []*WME
	binds   *js.Object
	refKey  string
	key     *key
}

func (in *instance) bindings() *js.Object {
	out := js.NewObject()
	js.ObjectSpread(out, in.binds)
	for i, w := range in.matched {
		// JS pushes null (not undefined) for a negated condition's slot.
		var v js.Value = js.Null
		if w != nil {
			v = w
		}
		out.SetProp("$"+itoa(i+1), v)
	}
	return out
}

func itoa(i int) string {
	if i < 10 {
		return string(rune('0' + i))
	}
	return js.NumberToString(float64(i))
}

type key struct {
	priority    float64
	firstStamp  int
	rest        []int
	specificity int
	sourceIndex float64
}

func compareKey(a, b *key) int {
	if a.priority != b.priority {
		if b.priority-a.priority < 0 {
			return -1
		}
		return 1
	}
	if a.firstStamp != b.firstStamp {
		return b.firstStamp - a.firstStamp
	}
	if a.specificity != b.specificity {
		return b.specificity - a.specificity
	}
	n := len(a.rest)
	if len(b.rest) > n {
		n = len(b.rest)
	}
	for i := 0; i < n; i++ {
		x, y := 0, 0
		if i < len(a.rest) {
			x = a.rest[i]
		}
		if i < len(b.rest) {
			y = b.rest[i]
		}
		if x != y {
			return y - x
		}
	}
	d := a.sourceIndex - b.sourceIndex
	switch {
	case d < 0:
		return -1
	case d > 0:
		return 1
	}
	return 0
}

func (e *Engine) findBest() *instance {
	var best *instance
	var bestKey *key
	for _, rule := range e.Rules {
		rule.prepare(e.WM)
		if len(rule.Conds) > 0 && !rule.Conds[0].Negated && rule.condCls[0].count() == 0 {
			continue
		}
		inst := e.ruleInstance(rule)
		if inst == nil {
			continue
		}
		k := inst.key
		if best == nil || compareKey(k, bestKey) < 0 {
			best, bestKey = inst, k
		}
	}
	return best
}

// ruleInstance returns the rule's first unrefracted instantiation, from
// cache when nothing it depends on has changed.
func (e *Engine) ruleInstance(rule *Rule) *instance {
	wm := e.WM
	if rule.cacheOK && rule.cacheEp == wm.Epoch && rule.cacheRef == e.refEpoch {
		fresh := true
		for i, c := range rule.classes {
			if c.ver != rule.cacheVer[i] {
				fresh = false
				break
			}
		}
		if fresh {
			return rule.cached
		}
	}
	var inst *instance
	// A positive condition over an empty class can never match.
	empty := false
	for _, c := range rule.posCls {
		if c.count() == 0 {
			empty = true
			break
		}
	}
	if !empty {
		inst = e.firstUnrefracted(rule)
		if inst != nil {
			inst.key = instKey(rule, inst)
		}
	}
	for i, c := range rule.classes {
		rule.cacheVer[i] = c.ver
	}
	rule.cacheEp, rule.cacheRef, rule.cached, rule.cacheOK = wm.Epoch, e.refEpoch, inst, true
	return inst
}

func instKey(rule *Rule, inst *instance) *key {
	var firstMatched *WME
	for _, w := range inst.matched {
		if w != nil {
			firstMatched = w
			break
		}
	}
	isX := firstMatched != nil && firstMatched.Cls == "x"
	domStamp := 0
	if firstMatched != nil {
		domStamp = firstMatched.Stamp
	}
	domWme := firstMatched
	if !isX {
		for _, w := range inst.matched {
			if w != nil && w.Stamp > domStamp {
				domStamp = w.Stamp
				domWme = w
			}
		}
	}
	var rest []int
	for _, w := range inst.matched {
		if w != nil && w != domWme {
			rest = append(rest, w.Stamp)
		}
	}
	sort.Sort(sort.Reverse(sort.IntSlice(rest)))
	return &key{
		priority:    rule.Priority,
		firstStamp:  domStamp,
		rest:        rest,
		specificity: rule.specificity(),
		sourceIndex: rule.SourceIndex,
	}
}

// binder is the bindings object during matching (insertion-ordered).
type binder struct {
	keys []string
	vals []js.Value
}

func (b *binder) lookup(k string) (js.Value, bool) {
	for i := len(b.keys) - 1; i >= 0; i-- {
		if b.keys[i] == k {
			return b.vals[i], true
		}
	}
	return nil, false
}

func (b *binder) bind(k string, v js.Value) {
	b.keys = append(b.keys, k)
	b.vals = append(b.vals, v)
}

func (b *binder) truncate(n int) {
	b.keys = b.keys[:n]
	b.vals = b.vals[:n]
}

func (b *binder) object() *js.Object {
	o := js.NewObject()
	for i, k := range b.keys {
		o.SetProp(k, b.vals[i])
	}
	return o
}

// firstUnrefracted returns the first instantiation (in match order) whose
// refraction key has not fired, or nil.
func (e *Engine) firstUnrefracted(rule *Rule) *instance {
	matched := make([]*WME, 0, len(rule.Conds))
	b := &binder{}
	var found *instance
	var walk func(idx int) bool
	walk = func(idx int) bool {
		if idx >= len(rule.Conds) {
			rk := refKey(rule.Name, matched)
			if _, done := e.Refracted[rk]; done {
				return false
			}
			found = &instance{rule: rule, matched: append([]*WME(nil), matched...), binds: b.object(), refKey: rk}
			return true
		}
		cond := rule.Conds[idx]
		candidates := e.WM.sortedFor(rule.condCls[idx])
		if cond.Negated {
			for _, w := range candidates {
				n := len(b.keys)
				ok := testWme(cond, w, b)
				b.truncate(n)
				if ok {
					return false
				}
			}
			matched = append(matched, nil)
			r := walk(idx + 1)
			matched = matched[:len(matched)-1]
			return r
		}
		for _, w := range candidates {
			n := len(b.keys)
			if testWme(cond, w, b) {
				matched = append(matched, w)
				if walk(idx + 1) {
					return true
				}
				matched = matched[:len(matched)-1]
			}
			b.truncate(n)
		}
		return false
	}
	walk(0)
	return found
}

func testWme(cond *Cond, w *WME, b *binder) bool {
	var toks []js.Value
	if cond.IsPositional {
		if w.Tokens != nil {
			toks = w.Tokens.E
		}
		if cond.PrefixLength >= 0 && len(toks) < cond.PrefixLength {
			return false
		}
	}
	for i := range cond.Tests {
		t := &cond.Tests[i]
		var actual js.Value
		if cond.IsPositional {
			if w.Tokens != nil && t.Index < len(toks) {
				actual = toks[t.Index]
			}
		} else {
			actual = w.GetProp(t.Field)
		}
		if !runTest(t, actual, b) {
			return false
		}
	}
	return true
}

func runTest(t *Test, actual js.Value, b *binder) bool {
	switch t.Op {
	case opEqConst:
		return Eqv(actual, t.Value)
	case opNeqConst:
		return !Eqv(actual, t.Value)
	case opEqVar:
		if v, ok := b.lookup(t.Var); ok {
			return Eqv(actual, v)
		}
		b.bind(t.Var, actual)
		return true
	case opNeqVar:
		if v, ok := b.lookup(t.Var); ok {
			return !Eqv(actual, v)
		}
		return true
	case opInSet:
		for _, x := range t.Set {
			if Eqv(actual, x) {
				return true
			}
		}
		return false
	case opBindSet:
		in := false
		for _, x := range t.Set {
			if Eqv(actual, x) {
				in = true
				break
			}
		}
		if !in {
			return false
		}
		if v, ok := b.lookup(t.Var); ok {
			return Eqv(actual, v)
		}
		b.bind(t.Var, actual)
		return true
	case opCmp:
		a, ok := toNum(actual)
		var bv float64
		if t.HasVVar {
			v, bound := b.lookup(t.ValueVar)
			if !bound {
				return false
			}
			var ok2 bool
			bv, ok2 = toNum(v)
			if !ok2 {
				return false
			}
		} else {
			var ok2 bool
			bv, ok2 = toNum(t.Value)
			if !ok2 {
				return false
			}
		}
		if !ok {
			return false
		}
		switch t.Cmp {
		case "<":
			return a < bv
		case ">":
			return a > bv
		case "<=":
			return a <= bv
		case ">=":
			return a >= bv
		case "==":
			return a == bv
		}
		return false
	case opAny:
		return true
	}
	return false
}

func toNum(v js.Value) (float64, bool) {
	if isNil(v) {
		return 0, false
	}
	n := js.ToNumber(v)
	if math.IsNaN(n) || math.IsInf(n, 0) {
		return 0, false
	}
	return n, true
}

func isNil(v js.Value) bool {
	if js.IsNullish(v) {
		return true
	}
	s, ok := v.(string)
	return ok && s == "nil"
}

// Eqv is OPS5 equality: nil/undefined/"nil" are equal; otherwise compare
// String(a).toLowerCase() === String(b).toLowerCase().
func Eqv(a, b js.Value) bool {
	an, bn := isNil(a), isNil(b)
	if an && bn {
		return true
	}
	if an || bn {
		return false
	}
	return foldEq(eqvString(a), eqvString(b))
}

// eqvString is String(v) with a fast path for small integers.
func eqvString(v js.Value) string {
	switch x := v.(type) {
	case string:
		return x
	case float64:
		if x >= 0 && x < 1e15 && x == math.Trunc(x) {
			return strconv.FormatInt(int64(x), 10)
		}
	}
	return js.ToString(v)
}

// foldEq is a.toLowerCase() === b.toLowerCase(), skipping the allocation
// when both strings are ASCII.
func foldEq(a, b string) bool {
	if a == b {
		return true
	}
	if len(a) != len(b) {
		if isASCII(a) && isASCII(b) {
			return false
		}
		return strings.ToLower(a) == strings.ToLower(b)
	}
	for i := 0; i < len(a); i++ {
		x, y := a[i], b[i]
		if x >= 0x80 || y >= 0x80 {
			return strings.ToLower(a) == strings.ToLower(b)
		}
		if x == y {
			continue
		}
		if 'A' <= x && x <= 'Z' {
			x += 'a' - 'A'
		}
		if 'A' <= y && y <= 'Z' {
			y += 'a' - 'A'
		}
		if x != y {
			return false
		}
	}
	return true
}

func isASCII(s string) bool {
	for i := 0; i < len(s); i++ {
		if s[i] >= 0x80 {
			return false
		}
	}
	return true
}

// ---- JS-visible surface (engine.*) ----

func (e *Engine) GetProp(k string) js.Value {
	switch k {
	case "halted":
		return e.Halted
	case "cycle":
		return float64(e.Cycle)
	case "maxCycles":
		return float64(e.MaxCycles)
	case "refracted":
		return &refractedView{e}
	}
	return nil
}

func (e *Engine) SetProp(k string, v js.Value) {
	switch k {
	case "halted":
		e.Halted = js.Truthy(v)
	case "maxCycles":
		e.MaxCycles = int(js.ToNumber(v))
	}
}

func (e *Engine) CallMethod(name string, args []js.Value) (js.Value, bool) {
	switch name {
	case "halt":
		e.Halted = true
		return nil, true
	}
	return nil, false
}

type refractedView struct{ e *Engine }

func (r *refractedView) GetProp(k string) js.Value {
	if k == "size" {
		return float64(len(r.e.Refracted))
	}
	return nil
}
func (r *refractedView) SetProp(string, js.Value) {}
func (r *refractedView) CallMethod(name string, args []js.Value) (js.Value, bool) {
	switch name {
	case "clear":
		r.e.ClearRefracted()
		return nil, true
	case "has":
		_, ok := r.e.Refracted[js.ToString(js.Arg(args, 0))]
		return ok, true
	case "add":
		r.e.Refracted[js.ToString(js.Arg(args, 0))] = struct{}{}
		r.e.refEpoch++
		return r, true
	case "delete":
		k := js.ToString(js.Arg(args, 0))
		_, ok := r.e.Refracted[k]
		delete(r.e.Refracted, k)
		r.e.refEpoch++
		return ok, true
	}
	return nil, false
}

// OpName is the test's op as written in the JS ("eq_const", ...).
func (t *Test) OpName() string {
	return [...]string{"eq_const", "neq_const", "eq_var", "neq_var", "in_set", "bind_set", "cmp", "any", "unknown"}[t.Op]
}
