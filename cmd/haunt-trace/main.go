// haunt-trace replays a script and prints each fired rule, numbered by
// turn, stopping after -max firings. For debugging loops and divergences.
//
// Usage: haunt-trace [-max N] [-from N] <script>
package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/cwooddgr/haunt-go/internal/engine"
	"github.com/cwooddgr/haunt-go/internal/game"
)

type traceIO struct {
	in   []string
	turn int
}

func (t *traceIO) Println(s string) { fmt.Println("    | " + s) }
func (t *traceIO) Print(s string)   { fmt.Print(s) }
func (t *traceIO) ReadLine() (string, bool) {
	if len(t.in) == 0 {
		return "", false
	}
	l := t.in[0]
	t.in = t.in[1:]
	t.turn++
	fmt.Printf("== turn %d: %s\n", t.turn, l)
	return l, true
}

func main() {
	max := flag.Int("max", 2000, "stop after this many firings")
	stats := flag.Bool("stats", false, "replay every script given and report the most firings in one turn")
	from := flag.Int("from", 0, "only print firings after this many")
	flag.Parse()
	if *stats {
		perTurnStats(flag.Args())
		return
	}
	b, err := os.ReadFile(flag.Arg(0))
	if err != nil {
		panic(err)
	}
	io := &traceIO{in: game.ParseScript(string(b))}
	n := 0
	game.OnFire = func(r *engine.Rule) {
		n++
		if n > *from {
			fmt.Printf("  #%d %s\n", n, r.Name)
		}
		if n >= *max {
			fmt.Println("... max firings reached")
			os.Exit(0)
		}
	}
	game.Main(game.NewTerm(io), game.MemStore{})
}

type quietIO struct{ in []string }

func (q *quietIO) Println(string) {}
func (q *quietIO) Print(string)   {}
func (q *quietIO) ReadLine() (string, bool) {
	if len(q.in) == 0 || q.in[0] == "@restart" {
		return "", false
	}
	l := q.in[0]
	q.in = q.in[1:]
	return l, true
}

// perTurnStats reports the largest number of rule firings between two
// reads of input, across all scripts (sets the per-turn loop guard).
func perTurnStats(paths []string) {
	best, bestScript, bestCmd := 0, "", ""
	hist := map[int]int{}
	for _, p := range paths {
		b, err := os.ReadFile(p)
		if err != nil {
			panic(err)
		}
		io := &quietIO{in: game.ParseScript(string(b))}
		n, last := 0, ""
		game.OnFire = func(*engine.Rule) {
			n++
			if n > 100000 {
				panic("loop")
			}
		}
		game.OnTurn = func(*game.Runtime) {
			bucket := 1
			for bucket < n {
				bucket *= 2
			}
			hist[bucket]++
			if n > best {
				best, bestScript, bestCmd = n, p, last
			}
			n = 0
			if len(io.in) > 0 {
				last = io.in[0]
			}
		}
		func() {
			defer func() { _ = recover() }()
			game.Main(game.NewTerm(io), game.MemStore{})
		}()
	}
	fmt.Printf("max firings in one turn: %d (%s, after %q)\n", best, bestScript, bestCmd)
	for b := 1; b <= 1<<20; b *= 2 {
		if hist[b] > 0 {
			fmt.Printf("  <=%-7d %d turns\n", b, hist[b])
		}
	}
}
