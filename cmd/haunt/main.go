// haunt is the line-mode front end for the games server. retro-play runs it
// the way it runs dumb-mode dfrotz: stdin/stdout pipes, one output burst per
// turn, then a line of input.
//
// Usage: haunt <savedir> [columns]
//
// Saves (the per-turn autosave and SAVE/RESTORE slots) are JSON files in
// savedir, the same snapshots Scalo's web version keeps in localStorage.
package main

import (
	"bufio"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/cwooddgr/haunt-go/internal/game"
)

// fileStore maps localStorage keys to files in the player's save dir.
type fileStore struct{ dir string }

func (f fileStore) path(key string) string {
	var b strings.Builder
	b.WriteString("haunt")
	k := strings.TrimPrefix(key, "haunt")
	for _, r := range k {
		switch {
		case r >= 'a' && r <= 'z', r >= 'A' && r <= 'Z', r >= '0' && r <= '9':
			b.WriteRune(r)
		default:
			b.WriteByte('-')
		}
	}
	name := b.String()
	if len(name) > 80 {
		name = name[:80]
	}
	return filepath.Join(f.dir, name+".json")
}

func (f fileStore) Get(key string) (string, bool) {
	b, err := os.ReadFile(f.path(key))
	if err != nil {
		return "", false
	}
	return string(b), true
}

func (f fileStore) Set(key, value string) {
	p := f.path(key)
	tmp := p + ".tmp"
	if err := os.WriteFile(tmp, []byte(value), 0o644); err == nil {
		_ = os.Rename(tmp, p)
	}
}

func (f fileStore) Remove(key string) { _ = os.Remove(f.path(key)) }

// lineIO writes game output word-wrapped to the terminal width and reads
// commands. Output is buffered and flushed only when the game waits for
// input, so retro-play sees each turn as one burst.
type lineIO struct {
	in   *bufio.Reader
	out  *bufio.Writer
	cols int
}

func (l *lineIO) Println(s string) {
	l.out.WriteString(wrap(s, l.cols))
	l.out.WriteByte('\n')
}

func (l *lineIO) Print(s string) { l.out.WriteString(s) }

func (l *lineIO) ReadLine() (string, bool) {
	l.out.WriteString("* ")
	l.out.Flush()
	line, err := l.in.ReadString('\n')
	if err != nil && line == "" {
		// Hung up. The autosave already ran before this read.
		os.Exit(0)
	}
	return strings.TrimRight(line, "\r\n"), true
}

// wrap breaks lines longer than the terminal at spaces; Laird's text is
// already hand-wrapped, so this only matters on narrow terminals.
func wrap(s string, cols int) string {
	if cols < 20 || len(s) < cols {
		return s
	}
	var b strings.Builder
	for len(s) >= cols {
		cut := strings.LastIndexByte(s[:cols], ' ')
		if cut <= 0 {
			cut = cols - 1
		}
		b.WriteString(strings.TrimRight(s[:cut], " "))
		b.WriteByte('\n')
		s = strings.TrimLeft(s[cut:], " ")
	}
	b.WriteString(s)
	return b.String()
}

func main() {
	if len(os.Args) < 2 {
		os.Stderr.WriteString("usage: haunt <savedir> [columns]\n")
		os.Exit(2)
	}
	cols := 80
	if len(os.Args) > 2 {
		if n, err := strconv.Atoi(os.Args[2]); err == nil && n > 0 {
			cols = n
		}
	}
	io := &lineIO{in: bufio.NewReader(os.Stdin), out: bufio.NewWriter(os.Stdout), cols: cols}
	game.Main(game.NewTerm(io), fileStore{dir: os.Args[1]})
	// dgamelaunch redraws its menu the moment we exit, which would wipe the
	// final score off the screen. Hold it until the player is done reading.
	io.out.WriteString("\n[Press RETURN to go back to the menu]")
	io.out.Flush()
	_, _ = io.in.ReadString('\n')
}
