package js

import (
	"fmt"
	"os"
)

// Spread concatenates argument/element segments ([a], Iter(xs), [b], ...).
func Spread(parts ...[]Value) []Value {
	var out []Value
	for _, p := range parts {
		out = append(out, p...)
	}
	if out == nil {
		out = []Value{}
	}
	return out
}

// RestArgs implements a ...rest parameter.
func RestArgs(args []Value, from int) *Array {
	if from >= len(args) {
		return NewArray()
	}
	return &Array{E: append([]Value(nil), args[from:]...)}
}

// Thrown carries a JS `throw` value through a Go panic.
type Thrown struct{ V Value }

func (t *Thrown) Error() string { return ToString(Get(t.V, "message")) }

func Throw(v Value) *Thrown { return &Thrown{V: v} }

// Caught converts a recovered panic into the JS catch-clause value.
func Caught(r any) Value {
	switch x := r.(type) {
	case *Thrown:
		return x.V
	case *TypeError:
		return NewObject("message", x.Msg, "name", "TypeError")
	case error:
		return NewObject("message", x.Error())
	}
	return NewObject("message", fmt.Sprint(r))
}

// ConsoleLog writes to stderr (console.log/error in the JS).
func ConsoleLog(args ...Value) Value {
	for i, a := range args {
		if i > 0 {
			fmt.Fprint(os.Stderr, " ")
		}
		fmt.Fprint(os.Stderr, ToString(a))
	}
	fmt.Fprintln(os.Stderr)
	return nil
}
