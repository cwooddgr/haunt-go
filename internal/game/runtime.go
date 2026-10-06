package game

import (
	"strings"

	"github.com/cwooddgr/haunt-go/internal/engine"
	"github.com/cwooddgr/haunt-go/internal/js"
)

// Runtime is the `rt` object generated rule actions call into: a port of
// js/runtime.js. Unknown properties (e.g. rt._ghostIdx) live in Extra.
type Runtime struct {
	WM         *engine.WM
	Term       *Term
	LineBuffer string
	Extra      *js.Object
}

func NewRuntime(wm *engine.WM, term *Term) *Runtime {
	rt := &Runtime{WM: wm, Term: term, Extra: js.NewObject()}
	term.runtime = rt
	return rt
}

// Write maps one OPS5 (write ...) action: parts join into a buffered line
// that flushes on each "\n" part.
func (rt *Runtime) Write(parts []js.Value) {
	for _, p := range parts {
		if js.IsNullish(p) {
			continue
		}
		s, ok := p.(string)
		if !ok {
			s = js.ToString(p)
		}
		if s == "\n" {
			if rt.LineBuffer != "" {
				rt.Term.Println(rt.LineBuffer)
				rt.LineBuffer = ""
			} else {
				rt.Term.Blank()
			}
			continue
		}
		if rt.LineBuffer != "" && !strings.HasSuffix(rt.LineBuffer, " ") && !strings.HasPrefix(s, " ") {
			rt.LineBuffer += " "
		}
		rt.LineBuffer += s
	}
}

func (rt *Runtime) Flush() {
	if rt.LineBuffer != "" {
		rt.Term.Println(rt.LineBuffer)
		rt.LineBuffer = ""
	}
}

func orZero(v js.Value) float64 {
	n := js.ToNumber(v)
	if !js.Truthy(n) {
		return 0
	}
	return n
}

func (rt *Runtime) Compute(a, op, b js.Value) js.Value {
	x, y := orZero(a), orZero(b)
	switch js.ToString(op) {
	case "+":
		return x + y
	case "-":
		return x - y
	case "*":
		return x * y
	case "/":
		if y == 0 {
			return float64(0)
		}
		return x / y
	}
	return float64(0)
}

// Substr is OPS5 substr (1-indexed, position 1 is the class name).
func (rt *Runtime) Substr(wme, from, to js.Value) js.Value {
	var toks []js.Value
	if w, ok := wme.(*engine.WME); ok && w.Tokens != nil {
		toks = w.Tokens.E
	} else if !js.IsNullish(wme) {
		if a, ok := js.Get(wme, "tokens").(*js.Array); ok {
			toks = a.E
		}
	}
	slice := func(a, b int) js.Value {
		if a > len(toks) {
			a = len(toks)
		}
		if b > len(toks) {
			b = len(toks)
		}
		if a >= b {
			return js.NewArray()
		}
		return &js.Array{E: append([]js.Value(nil), toks[a:b]...)}
	}
	start := int(js.ToNumber(from)) - 2
	if start < 0 {
		start = 0
	}
	if s, ok := to.(string); (ok && s == "inf") || js.IsNullish(to) {
		return slice(start, len(toks))
	}
	end := int(js.ToNumber(to)) - 1
	if end < 0 {
		end = 0
	}
	return slice(start, end)
}

func wmeArg(v js.Value) *engine.WME {
	w, _ := v.(*engine.WME)
	return w
}

func (rt *Runtime) GetProp(k string) js.Value {
	switch k {
	case "wm":
		return rt.WM
	case "term":
		return rt.Term
	case "lineBuffer":
		return rt.LineBuffer
	}
	return rt.Extra.GetProp(k)
}

func (rt *Runtime) SetProp(k string, v js.Value) {
	switch k {
	case "lineBuffer":
		rt.LineBuffer = js.ToString(v)
		return
	}
	rt.Extra.SetProp(k, v)
}

func (rt *Runtime) CallMethod(name string, args []js.Value) (js.Value, bool) {
	switch name {
	case "write":
		rt.Write(args)
		return nil, true
	case "flush":
		rt.Flush()
		return nil, true
	case "compute":
		return rt.Compute(js.Arg(args, 0), js.Arg(args, 1), js.Arg(args, 2)), true
	case "substr":
		return rt.Substr(js.Arg(args, 0), js.Arg(args, 1), js.Arg(args, 2)), true
	case "make":
		return rt.WM.Make(js.ToString(js.Arg(args, 0)), js.Arg(args, 1)), true
	case "modify":
		rt.WM.Modify(wmeArg(js.Arg(args, 0)), js.Arg(args, 1))
		return nil, true
	case "remove":
		rt.WM.Remove(wmeArg(js.Arg(args, 0)))
		return nil, true
	}
	return nil, false
}
