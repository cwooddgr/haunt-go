package game

import (
	"strings"

	"github.com/cwooddgr/haunt-go/internal/js"
)

// IO is the physical terminal: the SSH front end or a test transcript.
type IO interface {
	Println(s string)
	Print(s string)
	// ReadLine returns the raw typed line; ok=false means no more input.
	ReadLine() (raw string, ok bool)
}

// Term is the `term` object the game sees, with the browser Terminal's
// semantics: readLine discards the runtime's half-built line (the OPS5
// "*" prompt) and returns the trimmed command.
type Term struct {
	io         IO
	runtime    *Runtime
	beforeRead func() // runGame's autosave hook
}

func NewTerm(io IO) *Term { return &Term{io: io} }

func (t *Term) Println(s string) { t.io.Println(s) }
func (t *Term) Blank()           { t.io.Println("") }

// errInputExhausted mirrors the test harness's Error("input exhausted").
func errInputExhausted() *js.Thrown {
	return js.Throw(js.NewObject("message", "input exhausted"))
}

// OnTurn, if set, sees working memory each time the game waits for input
// (fuzzing tools use it to notice new rooms and inventories).
var OnTurn func(rt *Runtime)

func (t *Term) ReadLine() string {
	if t.beforeRead != nil {
		t.beforeRead()
	}
	if OnTurn != nil && t.runtime != nil {
		OnTurn(t.runtime)
	}
	if t.runtime != nil {
		t.runtime.LineBuffer = ""
	}
	raw, ok := t.io.ReadLine()
	if !ok {
		panic(errInputExhausted())
	}
	return js.TrimJS(raw)
}

var wsRun = js.NewRegex(`\s+`, "")

func (t *Term) ReadToken() string {
	line := t.ReadLine()
	parts := js.Call(line, "split", wsRun).(*js.Array)
	if len(parts.E) == 0 {
		return ""
	}
	tok, _ := parts.E[0].(string)
	return tok
}

func (t *Term) GetProp(k string) js.Value {
	if k == "_runtime" && t.runtime != nil {
		return t.runtime
	}
	return nil
}

func (t *Term) SetProp(string, js.Value) {}

func joinParts(args []js.Value) string {
	var b strings.Builder
	for _, p := range args {
		if !js.IsNullish(p) {
			b.WriteString(js.ToString(p))
		}
	}
	return b.String()
}

func (t *Term) CallMethod(name string, args []js.Value) (js.Value, bool) {
	switch name {
	case "println":
		t.Println(joinParts(args))
		return nil, true
	case "blank":
		t.Blank()
		return nil, true
	case "print":
		t.io.Print(js.ToString(js.Arg(args, 0)))
		return nil, true
	case "readLine":
		return t.ReadLine(), true
	case "readToken":
		return t.ReadToken(), true
	}
	return nil, false
}
