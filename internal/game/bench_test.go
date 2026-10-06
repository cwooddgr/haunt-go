package game

import (
	"os"
	"strings"
	"testing"
)

type benchIO struct{ in []string }

func (b *benchIO) Println(string) {}
func (b *benchIO) Print(string)   {}
func (b *benchIO) ReadLine() (string, bool) {
	if len(b.in) == 0 {
		return "", false
	}
	l := b.in[0]
	b.in = b.in[1:]
	return l, true
}

type benchStore map[string]string

func (m benchStore) Get(k string) (string, bool) { v, ok := m[k]; return v, ok }
func (m benchStore) Set(k, v string)             { m[k] = v }
func (m benchStore) Remove(k string)             { delete(m, k) }

// BenchmarkScript replays HAUNT_BENCH_SCRIPT (one command per line).
func BenchmarkScript(b *testing.B) {
	p := os.Getenv("HAUNT_BENCH_SCRIPT")
	if p == "" {
		b.Skip("HAUNT_BENCH_SCRIPT not set")
	}
	raw, err := os.ReadFile(p)
	if err != nil {
		b.Fatal(err)
	}
	var cmds []string
	for _, l := range strings.Split(string(raw), "\n") {
		if l = strings.TrimSpace(l); l != "" && !strings.HasPrefix(l, "#") {
			cmds = append(cmds, l)
		}
	}
	for i := 0; i < b.N; i++ {
		Main(NewTerm(&benchIO{in: append([]string(nil), cmds...)}), benchStore{})
	}
}
