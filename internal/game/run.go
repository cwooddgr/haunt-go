// Package game wires Scalo's translated Haunt rules (rules_gen.go,
// patches_gen.go) to the engine: the Go side of js/game.js runGame and
// js/main.js.
package game

import (
	"strings"
	"sync"

	"github.com/cwooddgr/haunt-go/internal/engine"
	"github.com/cwooddgr/haunt-go/internal/js"
)

const (
	saveKey = "haunt:save:"
	autoKey = "haunt:autosave"
)

// Window and LocalStorage are the browser globals the patch rules check.
var (
	Window       js.Value
	LocalStorage js.Value
)

var initOnce sync.Once

// TurnLimit caps the rule cycles in one turn and turns on repeat-state
// loop detection (engine.Engine.TurnLimit). Normal turns use under 30
// (measured over 177,000 fuzzed turns).
var TurnLimit = 2_000

// OnFire, if set, is installed on every engine RunGame creates (fuzzing
// and coverage reports).
var OnFire func(r *engine.Rule)

// AllRules builds the full rule list (for vocabulary extraction).
func AllRules() []*engine.Rule {
	moduleInit()
	wm := engine.NewWM()
	rt := NewRuntime(wm, NewTerm(nil))
	eng := engine.New(wm)
	rulesV := rules_f_createRules(rt, eng)
	js.Call(rulesV, "push", js.Iter(game_f_patchRules(rt))...)
	var out []*engine.Rule
	for _, o := range js.Iter(rulesV) {
		out = append(out, engine.RuleFromObject(o))
	}
	return out
}

func moduleInit() {
	initOnce.Do(func() {
		rules_moduleInit()
		game_moduleInit()
	})
}

// Storage is where localStorage keys live (files over SSH, memory in tests).
type Storage interface {
	Get(key string) (string, bool)
	Set(key, value string)
	Remove(key string)
}

type localStorage struct{ s Storage }

func (l *localStorage) GetProp(string) js.Value  { return nil }
func (l *localStorage) SetProp(string, js.Value) {}
func (l *localStorage) CallMethod(name string, args []js.Value) (js.Value, bool) {
	k := js.ToString(js.Arg(args, 0))
	switch name {
	case "getItem":
		if v, ok := l.s.Get(k); ok {
			return v, true
		}
		return js.Null, true
	case "setItem":
		l.s.Set(k, js.ToString(js.Arg(args, 1)))
		return nil, true
	case "removeItem":
		l.s.Remove(k)
		return nil, true
	}
	return nil, false
}

func serializeWM(wm *engine.WM) js.Value {
	data := js.NewObject()
	for _, cls := range wm.Classes() {
		var wmes []js.Value
		for _, w := range wm.All(cls) {
			cp := js.NewObject()
			js.ObjectSpread(cp, w)
			wmes = append(wmes, cp)
		}
		if wmes == nil {
			wmes = []js.Value{}
		}
		data.SetProp(cls, &js.Array{E: wmes})
	}
	return js.NewObject("version", float64(1), "stamp", float64(wm.Stamp), "nextId", float64(wm.NextID), "classes", data)
}

func restoreWM(wm *engine.WM, snap js.Value) {
	wm.Clear()
	wm.Stamp = int(js.ToNumber(js.Get(snap, "stamp")))
	wm.NextID = int(js.ToNumber(js.Get(snap, "nextId")))
	classes := js.Get(snap, "classes")
	for _, k := range js.OwnKeys(classes) {
		wm.RestoreClass(k, js.Iter(js.Get(classes, k)))
	}
}

// errMessage is `e.message || e` for whatever a rule action threw.
func errMessage(x any) string {
	switch e := x.(type) {
	case *engine.RuleError:
		return errMessage(e.Err)
	case *js.Thrown:
		if m := js.Get(e.V, "message"); js.Truthy(m) {
			return js.ToString(m)
		}
		return js.ToString(e.V)
	case *js.TypeError:
		return e.Msg
	case error:
		return e.Error()
	}
	return js.ToString(x)
}

// RunGame is js/game.js runGame. snapshot is nil for a new game.
func RunGame(term *Term, store Storage, snapshot js.Value) {
	moduleInit()
	wm := engine.NewWM()
	rt := NewRuntime(wm, term)
	eng := engine.New(wm)
	rulesV := rules_f_createRules(rt, eng)
	js.Call(rulesV, "push", js.Iter(game_f_patchRules(rt))...)
	game_f_rewriteGeneratedRules(rulesV, rt)
	for _, o := range js.Iter(rulesV) {
		eng.Rules = append(eng.Rules, engine.RuleFromObject(o))
	}
	eng.MaxCycles = 1_000_000
	eng.TurnLimit = TurnLimit
	eng.OnFire = OnFire

	haunt := js.NewObject("wm", wm, "engine", eng, "rt", rt, "rules", rulesV)
	Window = js.NewObject("__haunt", haunt)
	LocalStorage = &localStorage{store}
	slotOf := func(args []js.Value) js.Value {
		return js.Or(js.Arg(args, 0), func() js.Value { return float64(1) })
	}
	haunt.SetProp("save", js.Func(func(args ...js.Value) js.Value {
		slot := slotOf(args)
		store.Set(js.ToString(js.Add(saveKey, slot)), js.JSONStringify(serializeWM(wm)))
		eng.ClearRefracted()
		return js.Add("Saved to slot ", slot)
	}))
	haunt.SetProp("restore", js.Func(func(args ...js.Value) js.Value {
		slot := slotOf(args)
		raw, ok := store.Get(js.ToString(js.Add(saveKey, slot)))
		if !ok || raw == "" {
			return js.Add("No save in slot ", slot)
		}
		restoreWM(wm, js.JSONParse(raw))
		eng.ClearRefracted()
		return js.Add("Restored from slot ", slot)
	}))
	haunt.SetProp("autosave", js.Func(func(args ...js.Value) js.Value {
		store.Set(autoKey, js.JSONStringify(serializeWM(wm)))
		return nil
	}))
	term.beforeRead = func() {
		eng.TurnStarted()
		defer func() { _ = recover() }()
		store.Set(autoKey, js.JSONStringify(serializeWM(wm)))
	}
	defer func() { term.beforeRead = nil }()

	if snapshot != nil {
		restoreWM(wm, snapshot)
		eng.ClearRefracted()
	} else {
		wm.Make("start", js.NewArray())
	}

	eng.Call = func(r *engine.Rule, m *js.Object) {
		defer func() {
			if x := recover(); x != nil {
				term.Println("[engine error in " + r.Name + ": " + errMessage(x) + "]")
				panic(x)
			}
		}()
		r.Action(m, wm, term, eng)
	}

	func() {
		defer func() {
			if x := recover(); x != nil {
				msg := errMessage(x)
				if !strings.Contains(msg, "input exhausted") {
					term.Println("")
					term.Println("[engine error in ?: " + msg + "]")
				}
			}
		}()
		eng.Run()
	}()
	rt.Flush()
	term.Blank()
	term.Println("[adventure ended]")
}

// Main is js/main.js after the boot animation: offer to resume the
// autosave (`yy` resumes with the madness timer reset), then play.
func Main(term *Term, store Storage) {
	defer func() {
		if x := recover(); x != nil {
			term.Println("")
			term.Println("FATAL: " + errMessage(x))
		}
	}()
	if autoRaw, ok := store.Get(autoKey); ok && autoRaw != "" {
		term.Println("A previous game was found.")
		term.Println("Resume? (y/n)")
		ans := strings.ToLower(term.ReadToken())
		if strings.HasPrefix(ans, "y") {
			resumed := func() (done bool) {
				defer func() {
					if x := recover(); x != nil {
						done = false
					}
				}()
				snapshot := js.JSONParse(autoRaw)
				if ans == "yy" {
					classes := js.Get(snapshot, "classes")
					if js.Truthy(classes) && js.Truthy(js.Get(classes, "time")) {
						for _, t := range js.Iter(js.Get(classes, "time")) {
							js.Put(t, "realtime", float64(2200))
						}
					}
				}
				term.Println("Resuming...")
				RunGame(term, store, snapshot)
				return true
			}()
			if resumed {
				return
			}
			term.Println("Save corrupted, starting new game.")
		} else {
			store.Remove(autoKey)
		}
	}
	RunGame(term, store, nil)
}
