// haunt-transcript runs scripted sessions through the Go port and writes
// transcripts in the same format as difftest/oracle.mjs.
//
// Usage: haunt-transcript <outdir> <script>...
package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/cwooddgr/haunt-go/internal/game"
)

func main() {
	outdir := os.Args[1]
	if err := os.MkdirAll(outdir, 0o755); err != nil {
		panic(err)
	}
	for _, f := range os.Args[2:] {
		b, err := os.ReadFile(f)
		if err != nil {
			panic(err)
		}
		name := strings.TrimSuffix(filepath.Base(f), filepath.Ext(f)) + ".txt"
		t := game.Transcript(game.ParseScript(string(b)))
		if err := os.WriteFile(filepath.Join(outdir, name), []byte(t), 0o644); err != nil {
			panic(err)
		}
		fmt.Fprint(os.Stderr, ".")
	}
	fmt.Fprintln(os.Stderr)
}
