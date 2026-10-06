package js

import (
	"math"
	"strings"
)

// Globals the translated code references by name.

func String(args ...Value) Value {
	if len(args) == 0 {
		return ""
	}
	return ToString(args[0])
}

func Number(args ...Value) Value {
	if len(args) == 0 {
		return float64(0)
	}
	return ToNumber(args[0])
}

func Boolean(args ...Value) Value { return Truthy(Arg(args, 0)) }

func IsNaN(args ...Value) Value { return math.IsNaN(ToNumber(Arg(args, 0))) }

// ParseInt implements parseInt(s, radix) for radix 10 (or omitted).
func ParseInt(args ...Value) Value {
	s := TrimJS(ToString(Arg(args, 0)))
	radix := 10
	if r := Arg(args, 1); r != nil {
		radix = int(ToNumber(r))
		if radix == 0 {
			radix = 10
		}
	}
	neg := false
	if s != "" && (s[0] == '+' || s[0] == '-') {
		neg = s[0] == '-'
		s = s[1:]
	}
	if (radix == 16 || Arg(args, 1) == nil) && len(s) > 1 && s[0] == '0' && (s[1] == 'x' || s[1] == 'X') {
		radix = 16
		s = s[2:]
	}
	var n float64
	digits := 0
	for _, c := range strings.ToLower(s) {
		var d int
		switch {
		case c >= '0' && c <= '9':
			d = int(c - '0')
		case c >= 'a' && c <= 'z':
			d = int(c-'a') + 10
		default:
			d = 99
		}
		if d >= radix {
			break
		}
		n = n*float64(radix) + float64(d)
		digits++
	}
	if digits == 0 {
		return math.NaN()
	}
	if neg {
		n = -n
	}
	return n
}

func MathFloor(args ...Value) Value { return math.Floor(ToNumber(Arg(args, 0))) }
func MathCeil(args ...Value) Value  { return math.Ceil(ToNumber(Arg(args, 0))) }
func MathAbs(args ...Value) Value   { return math.Abs(ToNumber(Arg(args, 0))) }
func MathRound(args ...Value) Value { return math.Floor(ToNumber(Arg(args, 0)) + 0.5) }

func MathMin(args ...Value) Value {
	r := math.Inf(1)
	for _, a := range args {
		f := ToNumber(a)
		if math.IsNaN(f) {
			return f
		}
		if f < r {
			r = f
		}
	}
	return r
}

func MathMax(args ...Value) Value {
	r := math.Inf(-1)
	for _, a := range args {
		f := ToNumber(a)
		if math.IsNaN(f) {
			return f
		}
		if f > r {
			r = f
		}
	}
	return r
}

func ObjectKeys(args ...Value) Value {
	ks := OwnKeys(Arg(args, 0))
	out := make([]Value, len(ks))
	for i, k := range ks {
		out[i] = k
	}
	return &Array{E: out}
}

func ObjectValues(args ...Value) Value {
	o := Arg(args, 0)
	ks := OwnKeys(o)
	out := make([]Value, len(ks))
	for i, k := range ks {
		out[i] = Get(o, k)
	}
	return &Array{E: out}
}

func ObjectEntries(args ...Value) Value {
	o := Arg(args, 0)
	ks := OwnKeys(o)
	out := make([]Value, len(ks))
	for i, k := range ks {
		out[i] = NewArray(k, Get(o, k))
	}
	return &Array{E: out}
}

func ObjectAssign(args ...Value) Value {
	dst := Arg(args, 0)
	for _, src := range args[1:] {
		for _, k := range OwnKeys(src) {
			Put(dst, k, Get(src, k))
		}
	}
	return dst
}

func ArrayFrom(args ...Value) Value {
	src := Arg(args, 0)
	var e []Value
	if o, ok := src.(PropObj); ok && !isIterable(src) {
		n := int(ToNumber(o.GetProp("length")))
		e = make([]Value, n)
	} else {
		e = Iter(src)
	}
	if f, ok := Arg(args, 1).(Func); ok {
		for i := range e {
			e[i] = f(e[i], float64(i))
		}
	}
	if e == nil {
		e = []Value{}
	}
	return &Array{E: e}
}

func isIterable(v Value) bool {
	switch v.(type) {
	case *Array, *Set, *Map, string, Iterable:
		return true
	}
	return false
}

func ArrayIsArray(args ...Value) Value { _, ok := Arg(args, 0).(*Array); return ok }

// NewSetFrom implements `new Set(iterable)`.
func NewSetFrom(args ...Value) Value {
	s := NewSet()
	if it := Arg(args, 0); it != nil {
		for _, v := range Iter(it) {
			s.Add(v)
		}
	}
	return s
}

// NewMapFrom implements `new Map(iterable)`.
func NewMapFrom(args ...Value) Value {
	m := NewMap()
	if it := Arg(args, 0); it != nil {
		for _, kv := range Iter(it) {
			m.Set(Get(kv, float64(0)), Get(kv, float64(1)))
		}
	}
	return m
}
