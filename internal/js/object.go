package js

import (
	"math"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

// Object is a plain JS object with insertion-ordered string keys.
type Object struct {
	keys []string
	m    map[string]Value
}

// NewObject builds an object from alternating key, value pairs.
func NewObject(kv ...Value) *Object {
	o := &Object{m: make(map[string]Value, len(kv)/2)}
	for i := 0; i+1 < len(kv); i += 2 {
		o.SetProp(kv[i].(string), kv[i+1])
	}
	return o
}

func (o *Object) GetProp(k string) Value { return o.m[k] }

func (o *Object) Has(k string) bool { _, ok := o.m[k]; return ok }

func (o *Object) SetProp(k string, v Value) {
	if _, ok := o.m[k]; !ok {
		o.keys = append(o.keys, k)
	}
	o.m[k] = v
}

func (o *Object) Delete(k string) {
	if _, ok := o.m[k]; !ok {
		return
	}
	delete(o.m, k)
	for i, x := range o.keys {
		if x == k {
			o.keys = append(o.keys[:i:i], o.keys[i+1:]...)
			break
		}
	}
}

func (o *Object) Keys() []string { return append([]string(nil), o.keys...) }

// Set is a JS Set.
type Set struct {
	order []Value
	idx   map[Value]int
}

func NewSet(items ...Value) *Set {
	s := &Set{idx: map[Value]int{}}
	for _, it := range items {
		s.Add(it)
	}
	return s
}

func setKey(v Value) Value {
	if i, ok := v.(int); ok {
		return float64(i)
	}
	return v
}

func (s *Set) Add(v Value) {
	k := setKey(v)
	if _, ok := s.idx[k]; ok {
		return
	}
	s.idx[k] = len(s.order)
	s.order = append(s.order, k)
}

func (s *Set) Has(v Value) bool { _, ok := s.idx[setKey(v)]; return ok }

func (s *Set) Delete(v Value) bool {
	k := setKey(v)
	i, ok := s.idx[k]
	if !ok {
		return false
	}
	delete(s.idx, k)
	s.order = append(s.order[:i:i], s.order[i+1:]...)
	for j := i; j < len(s.order); j++ {
		s.idx[s.order[j]] = j
	}
	return true
}

func (s *Set) Clear() { s.order = nil; s.idx = map[Value]int{} }

func (s *Set) Len() int { return len(s.order) }

// Map is a JS Map with insertion order.
type Map struct {
	keys []Value
	m    map[Value]Value
}

func NewMap() *Map { return &Map{m: map[Value]Value{}} }

func (mp *Map) Get(k Value) Value { return mp.m[setKey(k)] }

func (mp *Map) Set(k, v Value) {
	k = setKey(k)
	if _, ok := mp.m[k]; !ok {
		mp.keys = append(mp.keys, k)
	}
	mp.m[k] = v
}

func (mp *Map) Has(k Value) bool { _, ok := mp.m[setKey(k)]; return ok }

func (mp *Map) Delete(k Value) bool {
	k = setKey(k)
	if _, ok := mp.m[k]; !ok {
		return false
	}
	delete(mp.m, k)
	for i, x := range mp.keys {
		if x == k {
			mp.keys = append(mp.keys[:i:i], mp.keys[i+1:]...)
			break
		}
	}
	return true
}

// Regex wraps a translated JS regular expression literal.
type Regex struct {
	Src   string
	Flags string
	re    *regexp.Regexp
}

func NewRegex(src, flags string) *Regex {
	p := src
	if strings.Contains(flags, "i") {
		p = "(?i)" + p
	}
	return &Regex{Src: src, Flags: flags, re: regexp.MustCompile(p)}
}

// ---------------------------------------------------------------------------
// Property access

func propKey(k Value) string {
	if s, ok := k.(string); ok {
		return s
	}
	return ToString(k)
}

func arrayIndex(k Value) (int, bool) {
	switch x := k.(type) {
	case float64:
		if x >= 0 && x == math.Trunc(x) {
			return int(x), true
		}
	case int:
		return x, x >= 0
	case string:
		n, err := strconv.Atoi(x)
		if err == nil && n >= 0 && strconv.Itoa(n) == x {
			return n, true
		}
	}
	return 0, false
}

func describe(v Value) string {
	if v == nil {
		return "undefined"
	}
	return "null"
}

// Get implements o[k] / o.k.
func Get(o Value, k Value) Value {
	switch x := o.(type) {
	case nil, nullT:
		throwType("Cannot read properties of %s (reading '%s')", describe(o), propKey(k))
	case *Array:
		if i, ok := arrayIndex(k); ok {
			if i < len(x.E) {
				return x.E[i]
			}
			return nil
		}
		if propKey(k) == "length" {
			return float64(len(x.E))
		}
		return nil
	case string:
		if i, ok := arrayIndex(k); ok {
			if i < len(x) {
				return x[i : i+1]
			}
			return nil
		}
		if propKey(k) == "length" {
			return float64(len(x))
		}
		return nil
	case *Set:
		if propKey(k) == "size" {
			return float64(x.Len())
		}
		return nil
	case *Map:
		if propKey(k) == "size" {
			return float64(len(x.keys))
		}
		return nil
	case PropObj:
		return x.GetProp(propKey(k))
	}
	return nil
}

// GetOpt implements o?.k.
func GetOpt(o Value, k Value) Value {
	if IsNullish(o) {
		return nil
	}
	return Get(o, k)
}

// Put implements o[k] = v and returns v.
func Put(o Value, k Value, v Value) Value {
	switch x := o.(type) {
	case nil, nullT:
		throwType("Cannot set properties of %s (setting '%s')", describe(o), propKey(k))
	case *Array:
		if i, ok := arrayIndex(k); ok {
			for len(x.E) <= i {
				x.E = append(x.E, nil)
			}
			x.E[i] = v
			return v
		}
		if propKey(k) == "length" {
			n := int(ToNumber(v))
			if n < len(x.E) {
				x.E = x.E[:n]
			}
			for len(x.E) < n {
				x.E = append(x.E, nil)
			}
		}
		return v
	case PropObj:
		x.SetProp(propKey(k), v)
	}
	return v
}

// Has implements `k in o`.
func Has(o Value, k Value) bool {
	switch x := o.(type) {
	case *Object:
		return x.Has(propKey(k))
	case *Array:
		i, ok := arrayIndex(k)
		return ok && i < len(x.E) || propKey(k) == "length"
	case interface{ HasProp(string) bool }:
		return x.HasProp(propKey(k))
	}
	return false
}

// Delete implements `delete o[k]`.
func Delete(o Value, k Value) bool {
	switch x := o.(type) {
	case *Object:
		x.Delete(propKey(k))
	case interface{ DeleteProp(string) }:
		x.DeleteProp(propKey(k))
	}
	return true
}

// ---------------------------------------------------------------------------
// Calls

// CallF calls a function value.
func CallF(f Value, args ...Value) Value {
	fn, ok := f.(Func)
	if !ok {
		throwType("%s is not a function", ToString(f))
	}
	return fn(args...)
}

// CallOpt implements o?.m(...).
func CallOpt(o Value, name string, args ...Value) Value {
	if IsNullish(o) {
		return nil
	}
	return Call(o, name, args...)
}

// Call implements o.name(args...).
func Call(o Value, name string, args ...Value) Value {
	switch x := o.(type) {
	case nil, nullT:
		throwType("Cannot read properties of %s (reading '%s')", describe(o), name)
	case string:
		return stringMethod(x, name, args)
	case *Array:
		return arrayMethod(x, name, args)
	case *Set:
		return setMethod(x, name, args)
	case *Map:
		return mapMethod(x, name, args)
	case *Regex:
		switch name {
		case "test":
			return x.re.MatchString(ToString(Arg(args, 0)))
		}
	case float64:
		switch name {
		case "toString":
			return NumberToString(x)
		case "toFixed":
			d := int(ToNumber(Arg(args, 0)))
			return strconv.FormatFloat(x, 'f', d, 64)
		}
	}
	if m, ok := o.(Methoder); ok {
		if r, ok := m.CallMethod(name, args); ok {
			return r
		}
	}
	if p, ok := o.(PropObj); ok {
		if f, ok := p.GetProp(name).(Func); ok {
			return f(args...)
		}
	}
	if f, ok := o.(Func); ok && name == "call" {
		return f(args[1:]...)
	}
	throwType("%s.%s is not a function", Typeof(o), name)
	return nil
}

func fnArg(args []Value, i int) Func {
	f, ok := Arg(args, i).(Func)
	if !ok {
		throwType("%s is not a function", ToString(Arg(args, i)))
	}
	return f
}

func relIndex(v Value, n int, def int) int {
	if v == nil {
		return def
	}
	f := ToNumber(v)
	if math.IsNaN(f) {
		return 0
	}
	i := int(math.Trunc(f))
	if i < 0 {
		i += n
		if i < 0 {
			i = 0
		}
	}
	if i > n {
		i = n
	}
	return i
}

func stringMethod(s, name string, args []Value) Value {
	switch name {
	case "toLowerCase":
		return strings.ToLower(s)
	case "toUpperCase":
		return strings.ToUpper(s)
	case "trim":
		return TrimJS(s)
	case "includes":
		return strings.Contains(s, ToString(Arg(args, 0)))
	case "startsWith":
		return strings.HasPrefix(s, ToString(Arg(args, 0)))
	case "endsWith":
		return strings.HasSuffix(s, ToString(Arg(args, 0)))
	case "indexOf":
		return float64(strings.Index(s, ToString(Arg(args, 0))))
	case "charCodeAt":
		i := 0
		if len(args) > 0 {
			i = int(ToNumber(args[0]))
		}
		u := utf16Units(s)
		if i < 0 || i >= len(u) {
			return math.NaN()
		}
		return float64(u[i])
	case "charAt":
		i := int(ToNumber(Arg(args, 0)))
		if i < 0 || i >= len(s) {
			return ""
		}
		return s[i : i+1]
	case "slice":
		a := relIndex(Arg(args, 0), len(s), 0)
		b := relIndex(Arg(args, 1), len(s), len(s))
		if a >= b {
			return ""
		}
		return s[a:b]
	case "substring":
		clamp := func(v Value, def int) int {
			if v == nil {
				return def
			}
			f := ToNumber(v)
			if math.IsNaN(f) || f < 0 {
				return 0
			}
			if f > float64(len(s)) {
				return len(s)
			}
			return int(f)
		}
		a, b := clamp(Arg(args, 0), 0), clamp(Arg(args, 1), len(s))
		if a > b {
			a, b = b, a
		}
		return s[a:b]
	case "repeat":
		return strings.Repeat(s, int(ToNumber(Arg(args, 0))))
	case "padEnd", "padStart":
		n := int(ToNumber(Arg(args, 0)))
		pad := " "
		if len(args) > 1 {
			pad = ToString(args[1])
		}
		if len(s) >= n || pad == "" {
			return s
		}
		fill := strings.Repeat(pad, (n-len(s))/len(pad)+1)[:n-len(s)]
		if name == "padEnd" {
			return s + fill
		}
		return fill + s
	case "split":
		sep := Arg(args, 0)
		var parts []string
		switch x := sep.(type) {
		case nil:
			return NewArray(s)
		case *Regex:
			parts = jsRegexSplit(x.re, s)
		default:
			sp := ToString(x)
			if sp == "" {
				for i := 0; i < len(s); i++ {
					parts = append(parts, s[i:i+1])
				}
			} else {
				parts = strings.Split(s, sp)
			}
		}
		out := make([]Value, len(parts))
		for i, p := range parts {
			out[i] = p
		}
		return &Array{E: out}
	case "replace", "replaceAll":
		pat := Arg(args, 0)
		rep := ToString(Arg(args, 1))
		if re, ok := pat.(*Regex); ok {
			if name == "replaceAll" || strings.Contains(re.Flags, "g") {
				return re.re.ReplaceAllLiteralString(s, rep)
			}
			loc := re.re.FindStringIndex(s)
			if loc == nil {
				return s
			}
			return s[:loc[0]] + rep + s[loc[1]:]
		}
		if name == "replaceAll" {
			return strings.ReplaceAll(s, ToString(pat), rep)
		}
		return strings.Replace(s, ToString(pat), rep, 1)
	case "toString":
		return s
	}
	throwType("s.%s is not a function", name)
	return nil
}

func utf16Units(s string) []uint16 {
	var out []uint16
	for _, r := range s {
		if r >= 0x10000 {
			r -= 0x10000
			out = append(out, uint16(0xd800+(r>>10)), uint16(0xdc00+(r&0x3ff)))
		} else {
			out = append(out, uint16(r))
		}
	}
	return out
}

// jsRegexSplit splits like String.prototype.split(regex) for the
// non-empty-match patterns the game uses (e.g. /\s+/).
func jsRegexSplit(re *regexp.Regexp, s string) []string {
	if s == "" {
		if re.MatchString("") {
			return nil
		}
		return []string{""}
	}
	return re.Split(s, -1)
}

func arrayMethod(a *Array, name string, args []Value) Value {
	switch name {
	case "push":
		a.E = append(a.E, args...)
		return float64(len(a.E))
	case "pop":
		if len(a.E) == 0 {
			return nil
		}
		v := a.E[len(a.E)-1]
		a.E = a.E[:len(a.E)-1]
		return v
	case "shift":
		if len(a.E) == 0 {
			return nil
		}
		v := a.E[0]
		a.E = append([]Value(nil), a.E[1:]...)
		return v
	case "unshift":
		a.E = append(append([]Value(nil), args...), a.E...)
		return float64(len(a.E))
	case "slice":
		i := relIndex(Arg(args, 0), len(a.E), 0)
		j := relIndex(Arg(args, 1), len(a.E), len(a.E))
		if i >= j {
			return NewArray()
		}
		return &Array{E: append([]Value(nil), a.E[i:j]...)}
	case "concat":
		out := append([]Value(nil), a.E...)
		for _, x := range args {
			if b, ok := x.(*Array); ok {
				out = append(out, b.E...)
			} else {
				out = append(out, x)
			}
		}
		return &Array{E: out}
	case "includes":
		x := Arg(args, 0)
		for _, e := range a.E {
			if sameValueZero(e, x) {
				return true
			}
		}
		return false
	case "indexOf":
		x := Arg(args, 0)
		for i, e := range a.E {
			if StrictEq(e, x) {
				return float64(i)
			}
		}
		return float64(-1)
	case "join":
		sep := ","
		if len(args) > 0 && args[0] != nil {
			sep = ToString(args[0])
		}
		parts := make([]string, len(a.E))
		for i, e := range a.E {
			if !IsNullish(e) {
				parts[i] = ToString(e)
			}
		}
		return strings.Join(parts, sep)
	case "find", "findIndex", "filter", "some", "every", "map", "forEach":
		f := fnArg(args, 0)
		var out []Value
		n := len(a.E)
		for i := 0; i < n && i < len(a.E); i++ {
			e := a.E[i]
			r := f(e, float64(i), a)
			switch name {
			case "find":
				if Truthy(r) {
					return e
				}
			case "findIndex":
				if Truthy(r) {
					return float64(i)
				}
			case "filter":
				if Truthy(r) {
					out = append(out, e)
				}
			case "some":
				if Truthy(r) {
					return true
				}
			case "every":
				if !Truthy(r) {
					return false
				}
			case "map":
				out = append(out, r)
			}
		}
		switch name {
		case "find", "forEach":
			return nil
		case "findIndex":
			return float64(-1)
		case "some":
			return false
		case "every":
			return true
		}
		if out == nil {
			out = []Value{}
		}
		return &Array{E: out}
	case "flat":
		var out []Value
		for _, e := range a.E {
			if b, ok := e.(*Array); ok {
				out = append(out, b.E...)
			} else {
				out = append(out, e)
			}
		}
		if out == nil {
			out = []Value{}
		}
		return &Array{E: out}
	case "reverse":
		for i, j := 0, len(a.E)-1; i < j; i, j = i+1, j-1 {
			a.E[i], a.E[j] = a.E[j], a.E[i]
		}
		return a
	case "sort":
		if len(args) > 0 && args[0] != nil {
			f := fnArg(args, 0)
			sort.SliceStable(a.E, func(i, j int) bool { return ToNumber(f(a.E[i], a.E[j])) < 0 })
		} else {
			sort.SliceStable(a.E, func(i, j int) bool { return ToString(a.E[i]) < ToString(a.E[j]) })
		}
		return a
	case "values":
		return &Array{E: append([]Value(nil), a.E...)}
	}
	throwType("arr.%s is not a function", name)
	return nil
}

func sameValueZero(a, b Value) bool {
	x, ok1 := norm(a).(float64)
	y, ok2 := norm(b).(float64)
	if ok1 && ok2 && math.IsNaN(x) && math.IsNaN(y) {
		return true
	}
	return StrictEq(a, b)
}

func setMethod(s *Set, name string, args []Value) Value {
	switch name {
	case "has":
		return s.Has(Arg(args, 0))
	case "add":
		s.Add(Arg(args, 0))
		return s
	case "delete":
		return s.Delete(Arg(args, 0))
	case "clear":
		s.Clear()
		return nil
	case "values", "keys":
		return &Array{E: append([]Value(nil), s.order...)}
	}
	throwType("set.%s is not a function", name)
	return nil
}

func mapMethod(mp *Map, name string, args []Value) Value {
	switch name {
	case "get":
		return mp.Get(Arg(args, 0))
	case "set":
		mp.Set(Arg(args, 0), Arg(args, 1))
		return mp
	case "has":
		return mp.Has(Arg(args, 0))
	case "delete":
		return mp.Delete(Arg(args, 0))
	case "clear":
		mp.keys = nil
		mp.m = map[Value]Value{}
		return nil
	case "keys":
		return &Array{E: append([]Value(nil), mp.keys...)}
	case "values":
		out := make([]Value, len(mp.keys))
		for i, k := range mp.keys {
			out[i] = mp.m[k]
		}
		return &Array{E: out}
	case "entries":
		return mapEntries(mp)
	}
	throwType("map.%s is not a function", name)
	return nil
}

func mapEntries(mp *Map) *Array {
	out := make([]Value, len(mp.keys))
	for i, k := range mp.keys {
		out[i] = NewArray(k, mp.m[k])
	}
	return &Array{E: out}
}

// Iterable lets host objects take part in for-of and spread.
type Iterable interface {
	IterValues() []Value
}

// Iter returns the sequence for for-of and spread (a snapshot).
func Iter(v Value) []Value {
	switch x := v.(type) {
	case *Array:
		return append([]Value(nil), x.E...)
	case *Set:
		return append([]Value(nil), x.order...)
	case *Map:
		return mapEntries(x).E
	case string:
		out := make([]Value, 0, len(x))
		for _, r := range x {
			out = append(out, string(r))
		}
		return out
	case Iterable:
		return x.IterValues()
	case nil, nullT:
		throwType("%s is not iterable", describe(v))
	}
	throwType("object is not iterable")
	return nil
}

// ObjectSpread copies own enumerable keys of src into dst ({...src}).
func ObjectSpread(dst *Object, src Value) {
	switch x := src.(type) {
	case nil, nullT:
		return
	case Keyed:
		p := src.(PropObj)
		for _, k := range x.Keys() {
			dst.SetProp(k, p.GetProp(k))
		}
	case *Array:
		for i, e := range x.E {
			dst.SetProp(strconv.Itoa(i), e)
		}
	}
}

// OwnKeys lists the enumerable own keys (Object.keys).
func OwnKeys(v Value) []string {
	switch x := v.(type) {
	case Keyed:
		return x.Keys()
	case *Array:
		out := make([]string, len(x.E))
		for i := range x.E {
			out[i] = strconv.Itoa(i)
		}
		return out
	}
	return nil
}
