// Package engine is a line-for-line port of Scalo's js/engine.js: working
// memory sharded by class, depth-first matching, MEA-style conflict
// resolution, and refraction keyed on (id, stamp) pairs. Ordering details
// (bucket insertion order, stable sort by stamp, first-unrefracted
// instantiation per rule) are kept exactly, because the game's text order
// depends on them.
package engine

import (
	"hash/fnv"
	"sort"
	"strconv"

	"github.com/cwooddgr/haunt-go/internal/js"
)

// WME is one working-memory element. Besides _id/_stamp/_cls it holds an
// insertion-ordered set of fields; positional WMEs keep their tokens in the
// "tokens" field, as in the JS.
type WME struct {
	ID    int
	Stamp int
	Cls   string
	F     *js.Object
	// Tokens caches F["tokens"] when it is an array (hot path for matching).
	Tokens *js.Array
	// wm, when set, is told about direct property writes so match caches
	// stay honest even if game code pokes a WME without modify().
	wm *WM
}

func newWME(id, stamp int, cls string) *WME {
	return &WME{ID: id, Stamp: stamp, Cls: cls, F: js.NewObject()}
}

func (w *WME) GetProp(k string) js.Value {
	switch k {
	case "_id":
		return float64(w.ID)
	case "_stamp":
		return float64(w.Stamp)
	case "_cls":
		return w.Cls
	}
	return w.F.GetProp(k)
}

func (w *WME) SetProp(k string, v js.Value) {
	switch k {
	case "_id":
		w.ID = int(js.ToNumber(v))
		return
	case "_stamp":
		w.Stamp = int(js.ToNumber(v))
		return
	case "_cls":
		w.Cls = js.ToString(v)
		return
	}
	w.F.SetProp(k, v)
	if k == "tokens" {
		w.Tokens, _ = v.(*js.Array)
	}
	if w.wm != nil {
		w.wm.touch(w.Cls)
	}
}

func (w *WME) HasProp(k string) bool {
	switch k {
	case "_id", "_stamp", "_cls":
		return true
	}
	return w.F.Has(k)
}

func (w *WME) DeleteProp(k string) {
	w.F.Delete(k)
	if k == "tokens" {
		w.Tokens = nil
	}
	if w.wm != nil {
		w.wm.touch(w.Cls)
	}
}

func (w *WME) Keys() []string {
	return append([]string{"_id", "_stamp", "_cls"}, w.F.Keys()...)
}

// Field returns a named field (fast path for matching).
func (w *WME) Field(k string) js.Value { return w.F.GetProp(k) }

// assign is Object.assign(wme, src) / wme.tokens = src.slice().
func (w *WME) assign(src js.Value) {
	switch x := src.(type) {
	case *js.Array:
		w.SetProp("tokens", &js.Array{E: append([]js.Value(nil), x.E...)})
	case nil:
	default:
		if js.IsNullish(src) {
			return
		}
		for _, k := range js.OwnKeys(src) {
			w.SetProp(k, js.Get(src, k))
		}
	}
}

// bucket keeps one class's WMEs in insertion order (a JS Map by id).
type bucket struct {
	order []*WME
	byID  map[int]int // id -> index in order
}

func newBucket() *bucket { return &bucket{byID: map[int]int{}} }

func (b *bucket) set(w *WME) {
	if i, ok := b.byID[w.ID]; ok {
		b.order[i] = w
		return
	}
	b.byID[w.ID] = len(b.order)
	b.order = append(b.order, w)
}

func (b *bucket) delete(id int) bool {
	i, ok := b.byID[id]
	if !ok {
		return false
	}
	delete(b.byID, id)
	copy(b.order[i:], b.order[i+1:])
	b.order[len(b.order)-1] = nil
	b.order = b.order[:len(b.order)-1]
	for j := i; j < len(b.order); j++ {
		b.byID[b.order[j].ID] = j
	}
	return true
}

// classInfo is one class's state. Rules hold pointers to these so the hot
// path never hashes a class name. An info outlives Clear(); only its bucket
// goes away.
type classInfo struct {
	name      string
	b         *bucket // nil until the class is first used (JS Map entry)
	ver       uint64  // bumps on any change to the class
	sorted    []*WME  // stamp-descending candidates, valid when sortedVer == ver
	sortedVer uint64
	sortedOK  bool
}

func (ci *classInfo) count() int {
	if ci.b == nil {
		return 0
	}
	return len(ci.b.order)
}

// WM is working memory.
type WM struct {
	NextID int
	Stamp  int
	info   map[string]*classInfo
	clsOrd []string // classes in JS Map insertion order
	// Version bumps on every change; Epoch bumps on Clear.
	Version uint64
	Epoch   uint64
}

func NewWM() *WM { return &WM{NextID: 1, info: map[string]*classInfo{}} }

func (wm *WM) ci(cls string) *classInfo {
	c := wm.info[cls]
	if c == nil {
		c = &classInfo{name: cls}
		wm.info[cls] = c
	}
	return c
}

func (wm *WM) touch(cls string) {
	wm.ci(cls).ver++
	wm.Version++
}

func (wm *WM) bucket(cls string) *bucket {
	c := wm.ci(cls)
	if c.b == nil {
		c.b = newBucket()
		wm.clsOrd = append(wm.clsOrd, cls)
	}
	return c.b
}

func (wm *WM) hasBucket(cls string) bool {
	c := wm.info[cls]
	return c != nil && c.b != nil
}

// Make creates a WME from a tokens array or a fields object.
func (wm *WM) Make(cls string, fieldsOrTokens js.Value) *WME {
	wm.Stamp++
	w := newWME(wm.NextID, wm.Stamp, cls)
	wm.NextID++
	w.assign(fieldsOrTokens)
	w.wm = wm
	wm.bucket(cls).set(w)
	wm.touch(cls)
	return w
}

// Modify bumps the stamp and applies changes.
func (wm *WM) Modify(w *WME, changes js.Value) {
	if w == nil {
		return
	}
	wm.Stamp++
	w.Stamp = wm.Stamp
	w.assign(changes)
	wm.touch(w.Cls)
}

// Remove deletes w from its class bucket.
func (wm *WM) Remove(w *WME) {
	if w == nil {
		return
	}
	if c := wm.info[w.Cls]; c != nil && c.b != nil {
		c.b.delete(w.ID)
	}
	wm.touch(w.Cls)
}

// All returns a snapshot of a class in insertion order.
func (wm *WM) All(cls string) []*WME {
	c := wm.info[cls]
	if c == nil || c.b == nil {
		return nil
	}
	return append([]*WME(nil), c.b.order...)
}

// Count is len(All(cls)) without the copy.
func (wm *WM) Count(cls string) int {
	if c := wm.info[cls]; c != nil {
		return c.count()
	}
	return 0
}

func (wm *WM) First(cls string) *WME {
	if c := wm.info[cls]; c != nil && c.count() > 0 {
		return c.b.order[0]
	}
	return nil
}

// Classes lists class names in Map insertion order (including emptied ones).
func (wm *WM) Classes() []string { return append([]string(nil), wm.clsOrd...) }

// Clear empties working memory (wm.classes.clear()).
func (wm *WM) Clear() {
	for _, c := range wm.info {
		c.b = nil
		c.ver++
		c.sortedOK = false
	}
	wm.clsOrd = nil
	wm.Epoch++
	wm.Version++
}

// Insert puts an existing WME into its bucket (restore path).
func (wm *WM) Insert(w *WME) {
	w.wm = wm
	wm.bucket(w.Cls).set(w)
	wm.touch(w.Cls)
}

// sortedFor returns the class's WMEs by stamp, newest first, ties in
// insertion order (JS: wm.all(cls).sort((a, b) => b._stamp - a._stamp)).
// The slice is shared; callers must not modify it.
func (wm *WM) sortedFor(c *classInfo) []*WME {
	if c.sortedOK && c.sortedVer == c.ver {
		return c.sorted
	}
	var l []*WME
	if c.b != nil {
		l = append(make([]*WME, 0, len(c.b.order)), c.b.order...)
		sort.SliceStable(l, func(i, j int) bool { return l[i].Stamp > l[j].Stamp })
	}
	c.sorted, c.sortedVer, c.sortedOK = l, c.ver, true
	return l
}

// ---- JS-visible surface (rt.wm.*) ----

func asWME(v js.Value) *WME {
	w, _ := v.(*WME)
	return w
}

func wmeArray(ws []*WME) *js.Array {
	out := make([]js.Value, len(ws))
	for i, w := range ws {
		out[i] = w
	}
	return &js.Array{E: out}
}

func (wm *WM) GetProp(k string) js.Value {
	switch k {
	case "stamp":
		return float64(wm.Stamp)
	case "nextId":
		return float64(wm.NextID)
	case "classes":
		return &classesView{wm}
	}
	return nil
}

func (wm *WM) SetProp(k string, v js.Value) {
	switch k {
	case "stamp":
		wm.Stamp = int(js.ToNumber(v))
	case "nextId":
		wm.NextID = int(js.ToNumber(v))
	}
}

func (wm *WM) CallMethod(name string, args []js.Value) (js.Value, bool) {
	switch name {
	case "first":
		if w := wm.First(js.ToString(js.Arg(args, 0))); w != nil {
			return w, true
		}
		return js.Null, true
	case "all":
		return wmeArray(wm.All(js.ToString(js.Arg(args, 0)))), true
	case "make":
		return wm.Make(js.ToString(js.Arg(args, 0)), js.Arg(args, 1)), true
	case "modify":
		wm.Modify(asWME(js.Arg(args, 0)), js.Arg(args, 1))
		return nil, true
	case "remove":
		wm.Remove(asWME(js.Arg(args, 0)))
		return nil, true
	case "findByField":
		cls, field, val := js.ToString(js.Arg(args, 0)), js.ToString(js.Arg(args, 1)), js.Arg(args, 2)
		for _, w := range wm.All(cls) {
			if Eqv(w.GetProp(field), val) {
				return w, true
			}
		}
		return js.Null, true
	case "_bucket":
		cls := js.ToString(js.Arg(args, 0))
		wm.bucket(cls)
		return &bucketView{wm, cls}, true
	}
	return nil, false
}

// classesView is rt.wm.classes: a Map<cls, Map<id, wme>>.
type classesView struct{ wm *WM }

func (c *classesView) GetProp(k string) js.Value {
	if k == "size" {
		return float64(len(c.wm.clsOrd))
	}
	return nil
}
func (c *classesView) SetProp(string, js.Value) {}

func (c *classesView) CallMethod(name string, args []js.Value) (js.Value, bool) {
	switch name {
	case "get":
		cls := js.ToString(js.Arg(args, 0))
		if !c.wm.hasBucket(cls) {
			return nil, true
		}
		return &bucketView{c.wm, cls}, true
	case "has":
		return c.wm.hasBucket(js.ToString(js.Arg(args, 0))), true
	case "clear":
		c.wm.Clear()
		return nil, true
	case "keys":
		out := make([]js.Value, len(c.wm.clsOrd))
		for i, k := range c.wm.clsOrd {
			out[i] = k
		}
		return &js.Array{E: out}, true
	case "values":
		out := make([]js.Value, len(c.wm.clsOrd))
		for i, k := range c.wm.clsOrd {
			out[i] = &bucketView{c.wm, k}
		}
		return &js.Array{E: out}, true
	case "entries":
		return &js.Array{E: c.IterValues()}, true
	}
	return nil, false
}

func (c *classesView) IterValues() []js.Value {
	out := make([]js.Value, len(c.wm.clsOrd))
	for i, k := range c.wm.clsOrd {
		out[i] = js.NewArray(k, &bucketView{c.wm, k})
	}
	return out
}

// bucketView is one class's Map<id, wme>.
type bucketView struct {
	wm  *WM
	cls string
}

func (b *bucketView) bk() *bucket { return b.wm.bucket(b.cls) }

func (b *bucketView) GetProp(k string) js.Value {
	if k == "size" {
		return float64(len(b.bk().order))
	}
	return nil
}
func (b *bucketView) SetProp(string, js.Value) {}

func idKey(v js.Value) int { return int(js.ToNumber(v)) }

func (b *bucketView) CallMethod(name string, args []js.Value) (js.Value, bool) {
	bk := b.bk()
	switch name {
	case "values":
		return wmeArray(bk.order), true
	case "keys":
		out := make([]js.Value, len(bk.order))
		for i, w := range bk.order {
			out[i] = float64(w.ID)
		}
		return &js.Array{E: out}, true
	case "get":
		if i, ok := bk.byID[idKey(js.Arg(args, 0))]; ok {
			return bk.order[i], true
		}
		return nil, true
	case "has":
		_, ok := bk.byID[idKey(js.Arg(args, 0))]
		return ok, true
	case "set":
		w := toWME(js.Arg(args, 1), b.cls)
		w.ID = idKey(js.Arg(args, 0))
		w.wm = b.wm
		bk.set(w)
		b.wm.touch(b.cls)
		return b, true
	case "delete":
		ok := bk.delete(idKey(js.Arg(args, 0)))
		b.wm.touch(b.cls)
		return ok, true
	}
	return nil, false
}

func (b *bucketView) IterValues() []js.Value {
	out := make([]js.Value, len(b.bk().order))
	for i, w := range b.bk().order {
		out[i] = js.NewArray(float64(w.ID), w)
	}
	return out
}

// toWME converts a restored plain object into a WME (restoreWM path).
func toWME(v js.Value, cls string) *WME {
	if w, ok := v.(*WME); ok {
		return w
	}
	w := newWME(0, 0, cls)
	for _, k := range js.OwnKeys(v) {
		w.SetProp(k, js.Get(v, k))
	}
	return w
}

// RefKey builds the refraction key string for an instantiation.
func refKey(name string, matched []*WME) string {
	buf := make([]byte, 0, len(name)+len(matched)*12)
	buf = append(buf, name...)
	for _, w := range matched {
		buf = append(buf, '|')
		if w == nil {
			buf = append(buf, '-')
			continue
		}
		buf = strconv.AppendInt(buf, int64(w.ID), 10)
		buf = append(buf, '.')
		buf = strconv.AppendInt(buf, int64(w.Stamp), 10)
	}
	return string(buf)
}

// RestoreClass recreates a class bucket from snapshot objects, in order
// (restoreWM: bucket = wm._bucket(cls); bucket.set(w._id, w)).
func (wm *WM) RestoreClass(cls string, objs []js.Value) {
	b := wm.bucket(cls)
	for _, o := range objs {
		w := toWME(o, cls)
		w.wm = wm
		b.set(w)
	}
	wm.touch(cls)
}

// ContentHash hashes working memory's contents in order, leaving out ids
// and stamps, so two states that differ only in bookkeeping hash the same.
func (wm *WM) ContentHash() uint64 {
	h := fnv.New64a()
	for _, cls := range wm.clsOrd {
		h.Write([]byte(cls))
		h.Write([]byte{0})
		c := wm.info[cls]
		if c == nil || c.b == nil {
			continue
		}
		for _, w := range c.b.order {
			h.Write([]byte{1})
			for _, k := range w.F.Keys() {
				h.Write([]byte(k))
				h.Write([]byte{2})
				h.Write([]byte(js.JSONStringify(w.F.GetProp(k))))
				h.Write([]byte{3})
			}
		}
	}
	return h.Sum64()
}
