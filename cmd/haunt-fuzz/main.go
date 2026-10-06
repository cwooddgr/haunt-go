// haunt-fuzz grows a corpus of command scripts that reach as much of the
// game as possible, using the Go port as a fast stand-in for the JS. The
// corpus is then replayed through both implementations by difftest.
//
// Usage: haunt-fuzz -corpus dir -seeds dir[,dir] -dur 10m [-seed N]
//
// Loop: take a corpus script, cut it at a random point, then keep playing
// with commands chosen from what the game just printed (nouns it mentions,
// things held) plus moves and rule-derived phrases. A script is kept when
// it fires a new rule, reaches a new room, holds a new set of items in a
// room, or reaches a new score.
package main

import (
	"flag"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/cwooddgr/haunt-go/internal/engine"
	"github.com/cwooddgr/haunt-go/internal/game"
	"github.com/cwooddgr/haunt-go/internal/js"
)

type memStore map[string]string

func (m memStore) Get(k string) (string, bool) { v, ok := m[k]; return v, ok }
func (m memStore) Set(k, v string)             { m[k] = v }
func (m memStore) Remove(k string)             { delete(m, k) }

type template struct{ slots [][]string } // per position: choices (nil = any word)

var (
	templates []template
	byNoun    = map[string][]int{} // word -> templates whose 2nd slot accepts it
	words     []string
	wordSet   = map[string]bool{}
	moves     = []string{"n", "s", "e", "w", "u", "d", "in", "out", "look", "inven", "wait", "back", "left", "right", "forward", "climb", "jump", "enter", "exit"}
	wordRe    = regexp.MustCompile(`[a-z][a-z_]+`)
)

func str(v js.Value) (string, bool) {
	switch x := v.(type) {
	case string:
		return x, x != "" && x != "nil"
	case float64:
		return js.NumberToString(x), true
	}
	return "", false
}

func buildVocab() {
	add := func(s string) {
		if !wordSet[s] && !strings.ContainsAny(s, " _") {
			wordSet[s] = true
			words = append(words, s)
		}
	}
	for _, r := range game.AllRules() {
		for _, c := range r.Conds {
			for i := range c.Tests {
				t := &c.Tests[i]
				if s, ok := str(t.Value); ok {
					add(s)
				}
				for _, v := range t.Set {
					if s, ok := str(v); ok {
						add(s)
					}
				}
			}
			if c.Cls != "input" || c.Negated || !c.IsPositional {
				continue
			}
			n := c.PrefixLength
			for i := range c.Tests {
				if c.Tests[i].Index+1 > n {
					n = c.Tests[i].Index + 1
				}
			}
			if n <= 0 {
				continue
			}
			tp := template{slots: make([][]string, n)}
			for i := range c.Tests {
				t := &c.Tests[i]
				switch t.OpName() {
				case "eq_const":
					if s, ok := str(t.Value); ok {
						tp.slots[t.Index] = []string{s}
					}
				case "in_set", "bind_set":
					var ch []string
					for _, v := range t.Set {
						if s, ok := str(v); ok {
							ch = append(ch, s)
						}
					}
					tp.slots[t.Index] = ch
				}
			}
			if len(tp.slots[0]) == 1 && (tp.slots[0][0] == "stop" || tp.slots[0][0] == "quit") {
				continue // ending the game early wastes runs
			}
			idx := len(templates)
			templates = append(templates, tp)
			if n >= 2 {
				for _, w := range tp.slots[1] {
					byNoun[w] = append(byNoun[w], idx)
				}
			}
		}
	}
	// Words that only appear inside action code (gate names, trivia
	// answers, dialog replies): every short lowercase string literal in
	// the JS the port was built from.
	lit := regexp.MustCompile(`"([a-z]{2,14})"`)
	for _, f := range []string{"oracle/js/game.js", "oracle/js/rules.generated.js"} {
		if b, err := os.ReadFile(f); err == nil {
			for _, m := range lit.FindAllStringSubmatch(string(b), -1) {
				add(m[1])
			}
		}
	}
	sort.Strings(words)
}

func fill(tp template, rng *rand.Rand, noun string) string {
	parts := make([]string, len(tp.slots))
	for i, ch := range tp.slots {
		switch {
		case i == 1 && noun != "":
			parts[i] = noun
		case len(ch) > 0:
			parts[i] = ch[rng.Intn(len(ch))]
		default:
			parts[i] = words[rng.Intn(len(words))]
		}
	}
	return strings.Join(parts, " ")
}

// session is one fuzz run: replay a prefix, then improvise.
type session struct {
	rng      *rand.Rand
	prefix   []string
	extra    int
	script   []string
	lastOut  strings.Builder
	held     []string
	features map[string]bool
	timeline []turnState // state before each command (directed mode)
	fires    int         // rule firings since the last input read
}

type turnState struct {
	step int // index in script of the command about to be read
	loc  string
	held map[string]bool
}

func (s *session) Println(l string) { s.lastOut.WriteString(l); s.lastOut.WriteByte('\n') }
func (s *session) Print(t string)   { s.lastOut.WriteString(t) }

func (s *session) ReadLine() (string, bool) {
	curMu.Lock()
	defer curMu.Unlock()
	s.fires = 0
	var cmd string
	if len(s.prefix) > 0 {
		cmd = s.prefix[0]
		s.prefix = s.prefix[1:]
		if cmd == "@restart" {
			s.script = append(s.script, cmd)
			return "", false
		}
	} else if s.extra > 0 {
		s.extra--
		cmd = s.improvise()
	} else {
		return "", false
	}
	s.lastOut.Reset()
	s.script = append(s.script, cmd)
	return cmd, true
}

func (s *session) improvise() string {
	rng := s.rng
	k := rng.Intn(100)
	if k < 45 {
		// Act on something the game just mentioned or we hold.
		var nouns []string
		for _, w := range wordRe.FindAllString(strings.ToLower(s.lastOut.String()), -1) {
			if len(byNoun[w]) > 0 {
				nouns = append(nouns, w)
			}
		}
		for _, h := range s.held {
			if len(byNoun[h]) > 0 && rng.Intn(3) == 0 {
				nouns = append(nouns, h)
			}
		}
		if len(nouns) > 0 {
			n := nouns[rng.Intn(len(nouns))]
			ts := byNoun[n]
			return fill(templates[ts[rng.Intn(len(ts))]], rng, n)
		}
	}
	switch {
	case k < 75:
		m := moves[rng.Intn(len(moves))]
		if rng.Intn(15) == 0 {
			m += " then " + moves[rng.Intn(len(moves))]
		}
		return m
	case k < 78:
		w := words[rng.Intn(len(words))]
		if rng.Intn(4) == 0 {
			w += " " + words[rng.Intn(len(words))]
		}
		return w
	case k < 80:
		return []string{"save", "restore", "saves", "score", "news"}[rng.Intn(5)]
	}
	return fill(templates[rng.Intn(len(templates))], rng, "")
}

func observe(s *session) func(rt *game.Runtime) {
	return func(rt *game.Runtime) {
		wm := rt.WM
		loc := "?"
		if l := wm.First("location"); l != nil {
			loc = js.ToString(l.GetProp("name"))
			if js.ToString(l.GetProp("name")) == "lawn" {
				loc += fmt.Sprintf("/%s/%s/%s", js.ToString(l.GetProp("side")), js.ToString(l.GetProp("east")), js.ToString(l.GetProp("north")))
			}
		}
		s.held = s.held[:0]
		for _, o := range wm.All("object") {
			if js.ToString(o.GetProp("place")) == "held" {
				s.held = append(s.held, js.ToString(o.GetProp("name")))
			}
		}
		sort.Strings(s.held)
		if s.timeline != nil && wm.First("location") != nil {
			h := map[string]bool{}
			for _, x := range s.held {
				h[x] = true
			}
			s.timeline = append(s.timeline, turnState{step: len(s.script), loc: js.ToString(wm.First("location").GetProp("name")), held: h})
		}
		s.features["l:"+loc] = true
		s.features["h:"+loc+":"+strings.Join(s.held, ",")] = true
		if st := wm.First("status"); st != nil {
			s.features["s:"+js.ToString(st.GetProp("score"))] = true
		}
	}
}

var (
	curMu    sync.Mutex
	curStart time.Time
	curSess  *session
	hangDump = flag.String("hangdump", "", "if set, a run longer than 20s writes its script here and exits")
	minimize = flag.Bool("minimize", false, "write a minimal subset of -seeds covering every feature to -corpus")
	direct   = flag.Bool("direct", false, "directed mode: splice each uncovered rule's command into matching moments of seed scripts")
	shard    = flag.String("shard", "0/1", "directed mode: work on uncovered rules i of n (i/n)")
)

// ruleNeeds is what an uncovered rule asks for, as far as we can read it.
type ruleNeeds struct {
	rule *engine.Rule
	loc  string   // location name, or ""
	held []string // objects that must be held
	cmds []string // candidate commands
}

func needsOf(r *engine.Rule) *ruleNeeds {
	n := &ruleNeeds{rule: r}
	var objNames []string
	for _, c := range r.Conds {
		if c.Negated {
			continue
		}
		name, place := "", ""
		for i := range c.Tests {
			t := &c.Tests[i]
			if t.OpName() != "eq_const" {
				continue
			}
			v, ok := str(t.Value)
			if !ok {
				continue
			}
			switch {
			case c.Cls == "location" && t.Field == "name":
				n.loc = v
			case c.Cls == "object" && t.Field == "name":
				name = v
			case c.Cls == "object" && t.Field == "place":
				place = v
			}
		}
		if c.Cls == "object" && name != "" {
			objNames = append(objNames, name)
			if place == "held" {
				n.held = append(n.held, name)
			}
		}
	}
	for _, c := range r.Conds {
		if c.Cls != "input" || c.Negated || !c.IsPositional {
			continue
		}
		size := c.PrefixLength
		for i := range c.Tests {
			if c.Tests[i].Index+1 > size {
				size = c.Tests[i].Index + 1
			}
		}
		if size <= 0 {
			continue
		}
		slots := make([][]string, size)
		for i := range c.Tests {
			t := &c.Tests[i]
			switch t.OpName() {
			case "eq_const":
				if v, ok := str(t.Value); ok {
					slots[t.Index] = []string{v}
				}
			case "in_set", "bind_set":
				for _, x := range t.Set {
					if v, ok := str(x); ok {
						slots[t.Index] = append(slots[t.Index], v)
					}
				}
			}
		}
		for i := range slots {
			if len(slots[i]) == 0 {
				slots[i] = append([]string(nil), objNames...)
				if len(slots[i]) == 0 {
					slots[i] = []string{"it"}
				}
			}
		}
		// Expand the cross product, capped.
		combos := []string{""}
		for _, ch := range slots {
			var next []string
			for _, pre := range combos {
				for _, w := range ch {
					if len(next) < 24 {
						next = append(next, strings.TrimSpace(pre+" "+w))
					}
				}
			}
			combos = next
		}
		n.cmds = append(n.cmds, combos...)
	}
	return n
}

// doDirect splices uncovered rules' commands into seed scripts at moments
// matching the rule's room and held items, keeping any splice that fires it.
func doDirect(seedDirs, outDir string, rng *rand.Rand, deadline time.Time) {
	type seedRun struct {
		script   []string
		timeline []turnState
	}
	var seeds []seedRun
	covered := map[string]bool{}
	for _, d := range strings.Split(seedDirs, ",") {
		paths, _ := filepath.Glob(filepath.Join(d, "*.cmds"))
		for _, p := range paths {
			sc := readScript(p)
			s := &session{rng: rng, prefix: sc, features: map[string]bool{}, timeline: []turnState{}}
			runSession(s)
			for k := range s.features {
				if strings.HasPrefix(k, "r:") {
					covered[k[2:]] = true
				}
			}
			seeds = append(seeds, seedRun{sc, s.timeline})
		}
	}
	var si, sn int
	fmt.Sscanf(*shard, "%d/%d", &si, &sn)
	var todo []*ruleNeeds
	for ri, r := range game.AllRules() {
		if sn > 1 && ri%sn != si {
			continue
		}
		if !covered[r.Name] {
			if n := needsOf(r); len(n.cmds) > 0 {
				todo = append(todo, n)
			}
		}
	}
	fmt.Fprintf(os.Stderr, "direct: %d seeds, %d rules covered, %d uncovered rules with commands\n", len(seeds), len(covered), len(todo))
	if err := os.MkdirAll(outDir, 0o755); err != nil {
		panic(err)
	}
	gained := 0
	for pass := 0; time.Now().Before(deadline); pass++ {
		progress := false
		for _, n := range todo {
			if covered[n.rule.Name] || time.Now().After(deadline) {
				continue
			}
			// Candidate moments: matching room and held items.
			type moment struct{ seed, step int }
			var ms []moment
			for si, sr := range seeds {
				for _, ts := range sr.timeline {
					if n.loc != "" && ts.loc != n.loc {
						continue
					}
					ok := true
					for _, h := range n.held {
						if !ts.held[h] {
							ok = false
							break
						}
					}
					if ok {
						ms = append(ms, moment{si, ts.step})
					}
				}
			}
			if len(ms) == 0 {
				continue
			}
			for try := 0; try < 12; try++ {
				m := ms[rng.Intn(len(ms))]
				cmd := n.cmds[rng.Intn(len(n.cmds))]
				base := seeds[m.seed].script
				if m.step > len(base) {
					continue
				}
				sc := append(append([]string(nil), base[:m.step]...), cmd, "look")
				s := &session{rng: rng, prefix: sc, features: map[string]bool{}, timeline: []turnState{}}
				runSession(s)
				if !s.features["r:"+n.rule.Name] {
					continue
				}
				newRules := 0
				for k := range s.features {
					if strings.HasPrefix(k, "r:") && !covered[k[2:]] {
						covered[k[2:]] = true
						newRules++
					}
				}
				gained += newRules
				progress = true
				name := filepath.Join(outDir, fmt.Sprintf("d_%s.cmds", n.rule.Name))
				_ = os.WriteFile(name, []byte(strings.Join(sc, "\n")+"\n"), 0o644)
				seeds = append(seeds, seedRun{sc, s.timeline})
				break
			}
		}
		fmt.Fprintf(os.Stderr, "direct pass %d: %d rules covered (+%d)\n", pass, len(covered), gained)
		if !progress {
			break
		}
	}
}

// doMinimize replays every seed script and greedily keeps the fewest that
// together cover every feature (rules, rooms, inventories, scores).
func doMinimize(seedDirs, outDir string) {
	type entry struct {
		path   string
		script []string
		feats  map[string]bool
	}
	var all []entry
	for _, d := range strings.Split(seedDirs, ",") {
		paths, _ := filepath.Glob(filepath.Join(d, "*.cmds"))
		for _, p := range paths {
			sc := readScript(p)
			s := run(rand.New(rand.NewSource(1)), sc, 0)
			// A game that ended inside a rewrite loop: drop the command
			// that started it (the JS oracle needs ~20 minutes per loop).
			for s.fires > 50 && len(s.script) > 0 {
				sc = append([]string(nil), s.script[:len(s.script)-1]...)
				s = run(rand.New(rand.NewSource(1)), sc, 0)
			}
			all = append(all, entry{p, sc, s.features})
		}
	}
	need := map[string]bool{}
	for _, e := range all {
		for k := range e.feats {
			need[k] = true
		}
	}
	total := len(need)
	if err := os.MkdirAll(outDir, 0o755); err != nil {
		panic(err)
	}
	kept := 0
	for len(need) > 0 {
		best, bestGain, bestLen := -1, 0, 0
		for i, e := range all {
			g := 0
			for k := range e.feats {
				if need[k] {
					g++
				}
			}
			if g > bestGain || (g == bestGain && g > 0 && len(e.script) < bestLen) {
				best, bestGain, bestLen = i, g, len(e.script)
			}
		}
		if best < 0 {
			break
		}
		for k := range all[best].feats {
			delete(need, k)
		}
		kept++
		name := filepath.Join(outDir, fmt.Sprintf("m%04d.cmds", kept))
		if err := os.WriteFile(name, []byte(strings.Join(all[best].script, "\n")+"\n"), 0o644); err != nil {
			panic(err)
		}
		all[best].feats = nil
	}
	fmt.Fprintf(os.Stderr, "minimize: %d scripts in, %d kept, %d features\n", len(all), kept, total)
}

func watchdog() {
	for range time.Tick(time.Second) {
		curMu.Lock()
		s, st := curSess, curStart
		var script []string
		if s != nil && time.Since(st) > 20*time.Second {
			script = append(script, s.script...)
		}
		curMu.Unlock()
		if script != nil {
			_ = os.WriteFile(*hangDump, []byte(strings.Join(script, "\n")+"\n"), 0o644)
			fmt.Fprintf(os.Stderr, "HANG after %d commands; script in %s\n", len(script), *hangDump)
			os.Exit(3)
		}
	}
}

func run(rng *rand.Rand, prefix []string, extra int) *session {
	s := &session{rng: rng, prefix: prefix, extra: extra, features: map[string]bool{}}
	runSession(s)
	return s
}

func runSession(s *session) {
	curMu.Lock()
	curSess, curStart = s, time.Now()
	curMu.Unlock()
	game.OnFire = func(r *engine.Rule) { s.features["r:"+r.Name] = true; s.fires++ }
	game.OnTurn = observe(s)
	store := memStore{}
	for {
		game.Main(game.NewTerm(s), store)
		if len(s.script) == 0 || s.script[len(s.script)-1] != "@restart" {
			break
		}
	}
}

func readScript(path string) []string {
	b, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}
	var out []string
	for _, l := range strings.Split(string(b), "\n") {
		l = strings.TrimSpace(l)
		if l != "" && !strings.HasPrefix(l, "#") {
			out = append(out, l)
		}
	}
	return out
}

func main() {
	corpusDir := flag.String("corpus", "difftest/fuzz", "output corpus dir")
	seedsDirs := flag.String("seeds", "difftest/corpus", "comma-separated seed dirs")
	dur := flag.Duration("dur", 5*time.Minute, "how long to fuzz")
	seed := flag.Int64("seed", 1, "rng seed")
	maxLen := flag.Int("maxlen", 600, "max commands per script")
	flag.Parse()

	if *hangDump != "" {
		go watchdog()
	}
	buildVocab()
	if *minimize {
		doMinimize(*seedsDirs, *corpusDir)
		return
	}
	if *direct {
		doDirect(*seedsDirs, *corpusDir, rand.New(rand.NewSource(*seed)), time.Now().Add(*dur))
		return
	}
	totalRules := len(game.AllRules())
	rng := rand.New(rand.NewSource(*seed))
	seen := map[string]bool{}
	var corpus [][]string
	saved := 0
	count := func() (r int) {
		for k := range seen {
			if strings.HasPrefix(k, "r:") {
				r++
			}
		}
		return
	}
	consider := func(s *session, save bool) {
		gain := 0
		for k := range s.features {
			if !seen[k] {
				seen[k] = true
				gain++
			}
		}
		if gain == 0 && save {
			return
		}
		corpus = append(corpus, s.script)
		if save {
			saved++
			name := filepath.Join(*corpusDir, fmt.Sprintf("s%d_%05d.cmds", *seed, saved))
			if err := os.WriteFile(name, []byte(strings.Join(s.script, "\n")+"\n"), 0o644); err != nil {
				panic(err)
			}
		}
	}

	if err := os.MkdirAll(*corpusDir, 0o755); err != nil {
		panic(err)
	}
	for _, d := range strings.Split(*seedsDirs, ",") {
		paths, _ := filepath.Glob(filepath.Join(d, "*.cmds"))
		for _, p := range paths {
			consider(run(rng, readScript(p), 0), false)
		}
	}
	fmt.Fprintf(os.Stderr, "seeds: %d scripts, %d/%d rules, %d features\n", len(corpus), count(), totalRules, len(seen))

	deadline := time.Now().Add(*dur)
	runs, last := 0, time.Now()
	for time.Now().Before(deadline) {
		// Favor recent discoveries: they sit at the frontier.
		i := len(corpus) - 1 - int(float64(len(corpus))*rng.ExpFloat64()/4)
		if i < 0 {
			i = rng.Intn(len(corpus))
		}
		base := corpus[i]
		cut := len(base)
		if cut > 0 && rng.Intn(4) == 0 {
			cut = rng.Intn(cut + 1)
		}
		budget := *maxLen - cut
		if budget <= 0 {
			continue
		}
		extra := 1 + rng.Intn(60)
		if extra > budget {
			extra = budget
		}
		consider(run(rng, append([]string(nil), base[:cut]...), extra), true)
		runs++
		if time.Since(last) > time.Minute {
			fmt.Fprintf(os.Stderr, "%d runs, corpus %d, %d/%d rules, %d features\n", runs, len(corpus), count(), totalRules, len(seen))
			last = time.Now()
		}
	}
	fmt.Fprintf(os.Stderr, "done: %d runs, corpus %d, %d/%d rules, %d features\n", runs, len(corpus), count(), totalRules, len(seen))
	var missing []string
	for _, r := range game.AllRules() {
		if !seen["r:"+r.Name] {
			missing = append(missing, r.Name)
		}
	}
	_ = os.WriteFile(filepath.Join(*corpusDir, fmt.Sprintf("UNCOVERED-s%d.txt", *seed)), []byte(strings.Join(missing, "\n")+"\n"), 0o644)
	var locs []string
	for k := range seen {
		if strings.HasPrefix(k, "l:") {
			locs = append(locs, k[2:])
		}
	}
	sort.Strings(locs)
	_ = os.WriteFile(filepath.Join(*corpusDir, fmt.Sprintf("ROOMS-s%d.txt", *seed)), []byte(strings.Join(locs, "\n")+"\n"), 0o644)
}
