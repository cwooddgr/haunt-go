// Package js implements the slice of JavaScript value semantics that the
// translated Haunt rules rely on: undefined vs null, loose and strict
// equality, truthiness, `+` that concatenates or adds, number formatting,
// and the handful of builtins (Array, Set, Map, String methods) the game
// code calls. The translator in tools/transpile emits Go that calls into
// this package, so the Go port behaves like the JS original line for line.
package js

import (
	"math"
	"strconv"
	"strings"
)

// Value is any JS value. Go nil is JS undefined.
type Value = any

type nullT struct{}

// Null is JS null (distinct from undefined, which is Go nil).
var Null Value = nullT{}

// Func is a JS function. `this` is not modelled; the game code never uses it.
type Func func(args ...Value) Value

// Array is a JS array (a reference type).
type Array struct{ E []Value }

// NewArray builds an array from its elements.
func NewArray(e ...Value) *Array { return &Array{E: e} }

// PropObj is anything with JS-visible properties.
type PropObj interface {
	GetProp(k string) Value
	SetProp(k string, v Value)
}

// Methoder is anything with JS-visible methods. ok=false means "no such
// method", which Call turns into a TypeError.
type Methoder interface {
	CallMethod(name string, args []Value) (Value, bool)
}

// Keyed objects can enumerate their own keys in insertion order
// (Object.entries, spread, JSON).
type Keyed interface {
	Keys() []string
}

// TypeError mirrors the V8 message text so engine-error output matches.
type TypeError struct{ Msg string }

func (e *TypeError) Error() string { return e.Msg }

func throwType(format string, a ...any) {
	panic(&TypeError{Msg: sprintf(format, a...)})
}

func sprintf(format string, a ...any) string {
	// Tiny %s-only formatter to keep fmt out of hot paths.
	var b strings.Builder
	ai := 0
	for i := 0; i < len(format); i++ {
		if format[i] == '%' && i+1 < len(format) && format[i+1] == 's' && ai < len(a) {
			b.WriteString(a[ai].(string))
			ai++
			i++
			continue
		}
		b.WriteByte(format[i])
	}
	return b.String()
}

// Arg returns args[i] or undefined.
func Arg(args []Value, i int) Value {
	if i < len(args) {
		return args[i]
	}
	return nil
}

// IsNullish reports null or undefined.
func IsNullish(v Value) bool {
	if v == nil {
		return true
	}
	_, ok := v.(nullT)
	return ok
}

// Truthy implements JS ToBoolean.
func Truthy(v Value) bool {
	switch x := v.(type) {
	case nil, nullT:
		return false
	case bool:
		return x
	case float64:
		return x != 0 && !math.IsNaN(x)
	case int:
		return x != 0
	case string:
		return x != ""
	}
	return true
}

// Num normalizes Go ints to float64; everything numeric in JS is float64.
func Num(n int) Value { return float64(n) }

// ToNumber implements JS ToNumber.
func ToNumber(v Value) float64 {
	switch x := v.(type) {
	case nil:
		return math.NaN()
	case nullT:
		return 0
	case bool:
		if x {
			return 1
		}
		return 0
	case float64:
		return x
	case int:
		return float64(x)
	case string:
		return StringToNumber(x)
	case *Array:
		return StringToNumber(ToString(x))
	}
	return math.NaN()
}

func isJSSpace(r rune) bool {
	switch r {
	case ' ', '\t', '\n', '\r', '\v', '\f', 0xa0, 0xfeff, 0x2028, 0x2029:
		return true
	}
	return r >= 0x2000 && r <= 0x200a || r == 0x1680 || r == 0x202f || r == 0x205f || r == 0x3000
}

// TrimJS trims JS whitespace.
func TrimJS(s string) string { return strings.TrimFunc(s, isJSSpace) }

// StringToNumber implements the StringNumericLiteral grammar.
func StringToNumber(s string) float64 {
	s = TrimJS(s)
	if s == "" {
		return 0
	}
	switch s {
	case "Infinity", "+Infinity":
		return math.Inf(1)
	case "-Infinity":
		return math.Inf(-1)
	}
	if len(s) > 2 && s[0] == '0' {
		base := 0
		switch s[1] {
		case 'x', 'X':
			base = 16
		case 'o', 'O':
			base = 8
		case 'b', 'B':
			base = 2
		}
		if base != 0 {
			n, err := strconv.ParseUint(s[2:], base, 64)
			if err != nil {
				return math.NaN()
			}
			return float64(n)
		}
	}
	// Decimal literal only: digits, one dot, optional exponent, optional sign.
	i := 0
	if s[i] == '+' || s[i] == '-' {
		i++
	}
	digits, dot := 0, false
	for ; i < len(s); i++ {
		c := s[i]
		if c >= '0' && c <= '9' {
			digits++
		} else if c == '.' && !dot {
			dot = true
		} else {
			break
		}
	}
	if digits == 0 {
		return math.NaN()
	}
	if i < len(s) && (s[i] == 'e' || s[i] == 'E') {
		i++
		if i < len(s) && (s[i] == '+' || s[i] == '-') {
			i++
		}
		ed := 0
		for ; i < len(s) && s[i] >= '0' && s[i] <= '9'; i++ {
			ed++
		}
		if ed == 0 {
			return math.NaN()
		}
	}
	if i != len(s) {
		return math.NaN()
	}
	f, err := strconv.ParseFloat(s, 64)
	if err != nil {
		// Overflow parses to ±Inf with an error; JS gives ±Infinity too.
		return f
	}
	return f
}

// NumberToString implements JS Number::toString for base 10.
func NumberToString(f float64) string {
	switch {
	case math.IsNaN(f):
		return "NaN"
	case math.IsInf(f, 1):
		return "Infinity"
	case math.IsInf(f, -1):
		return "-Infinity"
	case f == 0:
		return "0"
	}
	a := math.Abs(f)
	if a >= 1e-7 && a < 1e21 {
		if f == math.Trunc(f) {
			return strconv.FormatFloat(f, 'f', 0, 64)
		}
		return strconv.FormatFloat(f, 'f', -1, 64)
	}
	s := strconv.FormatFloat(f, 'e', -1, 64) // like 1e+21, 1.5e-07
	mant, exp, _ := strings.Cut(s, "e")
	sign := exp[0]
	exp = strings.TrimLeft(exp[1:], "0")
	if exp == "" {
		exp = "0"
	}
	return mant + "e" + string(sign) + exp
}

// ToString implements JS ToString (String(v)).
func ToString(v Value) string {
	switch x := v.(type) {
	case nil:
		return "undefined"
	case nullT:
		return "null"
	case bool:
		if x {
			return "true"
		}
		return "false"
	case float64:
		return NumberToString(x)
	case int:
		return strconv.Itoa(x)
	case string:
		return x
	case *Array:
		parts := make([]string, len(x.E))
		for i, e := range x.E {
			if !IsNullish(e) {
				parts[i] = ToString(e)
			}
		}
		return strings.Join(parts, ",")
	case Func:
		return "function"
	case *Set:
		return "[object Set]"
	case *Map:
		return "[object Map]"
	case interface{ JSString() string }:
		return x.JSString()
	}
	return "[object Object]"
}

// Typeof implements the typeof operator.
func Typeof(v Value) string {
	switch v.(type) {
	case nil:
		return "undefined"
	case bool:
		return "boolean"
	case float64, int:
		return "number"
	case string:
		return "string"
	case Func:
		return "function"
	}
	return "object"
}

func norm(v Value) Value {
	if i, ok := v.(int); ok {
		return float64(i)
	}
	return v
}

// StrictEq implements ===.
func StrictEq(a, b Value) bool {
	a, b = norm(a), norm(b)
	switch x := a.(type) {
	case nil:
		return b == nil
	case nullT:
		_, ok := b.(nullT)
		return ok
	case float64:
		y, ok := b.(float64)
		return ok && x == y
	case string:
		y, ok := b.(string)
		return ok && x == y
	case bool:
		y, ok := b.(bool)
		return ok && x == y
	case Func:
		return false // functions are never compared in the game code
	}
	return a == b // pointer identity for objects
}

// LooseEq implements ==.
func LooseEq(a, b Value) bool {
	a, b = norm(a), norm(b)
	if IsNullish(a) || IsNullish(b) {
		return IsNullish(a) && IsNullish(b)
	}
	switch x := a.(type) {
	case float64:
		switch y := b.(type) {
		case float64:
			return x == y
		case string:
			return x == StringToNumber(y)
		case bool:
			return x == ToNumber(y)
		}
	case string:
		switch y := b.(type) {
		case string:
			return x == y
		case float64:
			return StringToNumber(x) == y
		case bool:
			return StringToNumber(x) == ToNumber(y)
		}
	case bool:
		if y, ok := b.(bool); ok {
			return x == y
		}
		return LooseEq(ToNumber(x), b)
	}
	switch b.(type) {
	case float64, string, bool:
		// object vs primitive: compare via ToPrimitive (string form)
		if _, ok := a.(*Array); ok {
			return LooseEq(ToString(a), b)
		}
		return false
	}
	return a == b
}

func toPrimitive(v Value) Value {
	switch v.(type) {
	case nil, nullT, bool, float64, int, string:
		return norm(v)
	}
	return ToString(v)
}

// Add implements binary +.
func Add(a, b Value) Value {
	pa, pb := toPrimitive(a), toPrimitive(b)
	sa, aStr := pa.(string)
	sb, bStr := pb.(string)
	if aStr || bStr {
		if !aStr {
			sa = ToString(pa)
		}
		if !bStr {
			sb = ToString(pb)
		}
		return sa + sb
	}
	return ToNumber(pa) + ToNumber(pb)
}

func Sub(a, b Value) Value { return ToNumber(a) - ToNumber(b) }
func Mul(a, b Value) Value { return ToNumber(a) * ToNumber(b) }
func Div(a, b Value) Value { return ToNumber(a) / ToNumber(b) }
func Mod(a, b Value) Value { return math.Mod(ToNumber(a), ToNumber(b)) }
func Neg(a Value) Value    { return -ToNumber(a) }
func Pos(a Value) Value    { return ToNumber(a) }

func cmp(a, b Value) (int, bool) {
	pa, pb := toPrimitive(a), toPrimitive(b)
	sa, ok1 := pa.(string)
	sb, ok2 := pb.(string)
	if ok1 && ok2 {
		return strings.Compare(sa, sb), true
	}
	x, y := ToNumber(pa), ToNumber(pb)
	if math.IsNaN(x) || math.IsNaN(y) {
		return 0, false
	}
	switch {
	case x < y:
		return -1, true
	case x > y:
		return 1, true
	}
	return 0, true
}

func Lt(a, b Value) bool { c, ok := cmp(a, b); return ok && c < 0 }
func Gt(a, b Value) bool { c, ok := cmp(a, b); return ok && c > 0 }
func Le(a, b Value) bool { c, ok := cmp(a, b); return ok && c <= 0 }
func Ge(a, b Value) bool { c, ok := cmp(a, b); return ok && c >= 0 }

// Or, And, Nullish implement the value-returning logical operators.
func Or(a Value, b func() Value) Value {
	if Truthy(a) {
		return a
	}
	return b()
}

func And(a Value, b func() Value) Value {
	if !Truthy(a) {
		return a
	}
	return b()
}

func Nullish(a Value, b func() Value) Value {
	if IsNullish(a) {
		return b()
	}
	return a
}

// Cond implements a ? b : c.
func Cond(t bool, a, b func() Value) Value {
	if t {
		return a()
	}
	return b()
}
