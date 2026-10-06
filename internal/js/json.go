package js

import (
	"math"
	"strconv"
	"strings"
	"unicode/utf8"
)

// JSONStringify matches JSON.stringify(v) for the values the game saves:
// undefined/function members are dropped, NaN/Infinity become null, keys
// keep insertion order.
func JSONStringify(v Value) string {
	var b strings.Builder
	if !jsonWrite(&b, v) {
		return "undefined"
	}
	return b.String()
}

func jsonWrite(b *strings.Builder, v Value) bool {
	switch x := v.(type) {
	case nil, Func:
		return false
	case nullT:
		b.WriteString("null")
	case bool:
		if x {
			b.WriteString("true")
		} else {
			b.WriteString("false")
		}
	case float64:
		if math.IsNaN(x) || math.IsInf(x, 0) {
			b.WriteString("null")
		} else {
			b.WriteString(NumberToString(x))
		}
	case int:
		b.WriteString(strconv.Itoa(x))
	case string:
		jsonQuote(b, x)
	case *Array:
		b.WriteByte('[')
		for i, e := range x.E {
			if i > 0 {
				b.WriteByte(',')
			}
			if !jsonWrite(b, e) {
				b.WriteString("null")
			}
		}
		b.WriteByte(']')
	case *Set, *Map:
		b.WriteString("{}")
	default:
		p, ok := v.(PropObj)
		if !ok {
			return false
		}
		b.WriteByte('{')
		first := true
		for _, k := range OwnKeys(v) {
			val := p.GetProp(k)
			if val == nil {
				continue
			}
			if _, isF := val.(Func); isF {
				continue
			}
			if !first {
				b.WriteByte(',')
			}
			first = false
			jsonQuote(b, k)
			b.WriteByte(':')
			jsonWrite(b, val)
		}
		b.WriteByte('}')
	}
	return true
}

func jsonQuote(b *strings.Builder, s string) {
	b.WriteByte('"')
	for _, r := range s {
		switch r {
		case '"':
			b.WriteString(`\"`)
		case '\\':
			b.WriteString(`\\`)
		case '\b':
			b.WriteString(`\b`)
		case '\f':
			b.WriteString(`\f`)
		case '\n':
			b.WriteString(`\n`)
		case '\r':
			b.WriteString(`\r`)
		case '\t':
			b.WriteString(`\t`)
		default:
			if r < 0x20 {
				const hex = "0123456789abcdef"
				b.WriteString(`\u00`)
				b.WriteByte(hex[r>>4])
				b.WriteByte(hex[r&15])
			} else {
				b.WriteRune(r)
			}
		}
	}
	b.WriteByte('"')
}

// JSONParse parses JSON into *Object/*Array/float64/string/bool/Null.
// It panics with a SyntaxError-style message on bad input, like JSON.parse.
func JSONParse(s string) Value {
	p := &jparser{s: s}
	p.ws()
	v := p.value()
	p.ws()
	if p.i != len(p.s) {
		p.fail()
	}
	return v
}

type jparser struct {
	s string
	i int
}

func (p *jparser) fail() {
	panic(Throw(NewObject("message", "Unexpected token in JSON at position "+strconv.Itoa(p.i), "name", "SyntaxError")))
}

func (p *jparser) ws() {
	for p.i < len(p.s) && (p.s[p.i] == ' ' || p.s[p.i] == '\t' || p.s[p.i] == '\n' || p.s[p.i] == '\r') {
		p.i++
	}
}

func (p *jparser) value() Value {
	if p.i >= len(p.s) {
		p.fail()
	}
	switch c := p.s[p.i]; {
	case c == '{':
		p.i++
		o := NewObject()
		p.ws()
		if p.i < len(p.s) && p.s[p.i] == '}' {
			p.i++
			return o
		}
		for {
			p.ws()
			if p.i >= len(p.s) || p.s[p.i] != '"' {
				p.fail()
			}
			k := p.str()
			p.ws()
			if p.i >= len(p.s) || p.s[p.i] != ':' {
				p.fail()
			}
			p.i++
			p.ws()
			o.SetProp(k, p.value())
			p.ws()
			if p.i < len(p.s) && p.s[p.i] == ',' {
				p.i++
				continue
			}
			if p.i < len(p.s) && p.s[p.i] == '}' {
				p.i++
				return o
			}
			p.fail()
		}
	case c == '[':
		p.i++
		a := NewArray()
		p.ws()
		if p.i < len(p.s) && p.s[p.i] == ']' {
			p.i++
			return a
		}
		for {
			p.ws()
			a.E = append(a.E, p.value())
			p.ws()
			if p.i < len(p.s) && p.s[p.i] == ',' {
				p.i++
				continue
			}
			if p.i < len(p.s) && p.s[p.i] == ']' {
				p.i++
				return a
			}
			p.fail()
		}
	case c == '"':
		return p.str()
	case c == 't' && strings.HasPrefix(p.s[p.i:], "true"):
		p.i += 4
		return true
	case c == 'f' && strings.HasPrefix(p.s[p.i:], "false"):
		p.i += 5
		return false
	case c == 'n' && strings.HasPrefix(p.s[p.i:], "null"):
		p.i += 4
		return Null
	case c == '-' || (c >= '0' && c <= '9'):
		j := p.i
		if p.s[j] == '-' {
			j++
		}
		for j < len(p.s) && strings.IndexByte("0123456789.eE+-", p.s[j]) >= 0 {
			j++
		}
		f, err := strconv.ParseFloat(p.s[p.i:j], 64)
		if err != nil {
			p.fail()
		}
		p.i = j
		return f
	}
	p.fail()
	return nil
}

func (p *jparser) str() string {
	p.i++ // opening quote
	var b strings.Builder
	for p.i < len(p.s) {
		c := p.s[p.i]
		if c == '"' {
			p.i++
			return b.String()
		}
		if c == '\\' {
			p.i++
			if p.i >= len(p.s) {
				p.fail()
			}
			switch p.s[p.i] {
			case '"', '\\', '/':
				b.WriteByte(p.s[p.i])
			case 'b':
				b.WriteByte('\b')
			case 'f':
				b.WriteByte('\f')
			case 'n':
				b.WriteByte('\n')
			case 'r':
				b.WriteByte('\r')
			case 't':
				b.WriteByte('\t')
			case 'u':
				if p.i+4 >= len(p.s) {
					p.fail()
				}
				n, err := strconv.ParseUint(p.s[p.i+1:p.i+5], 16, 32)
				if err != nil {
					p.fail()
				}
				r := rune(n)
				p.i += 4
				if r >= 0xd800 && r < 0xdc00 && p.i+6 < len(p.s) && p.s[p.i+1] == '\\' && p.s[p.i+2] == 'u' {
					if lo, err := strconv.ParseUint(p.s[p.i+3:p.i+7], 16, 32); err == nil && lo >= 0xdc00 && lo < 0xe000 {
						r = (r-0xd800)<<10 + (rune(lo) - 0xdc00) + 0x10000
						p.i += 6
					}
				}
				b.WriteRune(r)
			default:
				p.fail()
			}
			p.i++
			continue
		}
		_, size := utf8.DecodeRuneInString(p.s[p.i:])
		b.WriteString(p.s[p.i : p.i+size])
		p.i += size
	}
	p.fail()
	return ""
}
