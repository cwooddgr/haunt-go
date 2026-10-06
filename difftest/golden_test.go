// Package difftest checks the Go port against transcripts recorded from
// Scalo's JavaScript (difftest/golden, made by record-golden.sh).
package difftest

import (
	"bytes"
	"compress/gzip"
	"io"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/cwooddgr/haunt-go/internal/game"
)

func TestGolden(t *testing.T) {
	var scripts []string
	for _, d := range []string{"corpus", "targeted", "fuzz", "loops"} {
		m, _ := filepath.Glob(filepath.Join(d, "*.cmds"))
		scripts = append(scripts, m...)
	}
	if len(scripts) == 0 {
		t.Fatal("no scripts")
	}
	for _, p := range scripts {
		name := strings.TrimSuffix(filepath.Base(p), ".cmds")
		t.Run(filepath.Base(filepath.Dir(p))+"/"+name, func(t *testing.T) {
			want := readGolden(t, filepath.Join("golden", filepath.Base(filepath.Dir(p))+"_"+name+".txt.gz"))
			src, err := os.ReadFile(p)
			if err != nil {
				t.Fatal(err)
			}
			got := game.Transcript(game.ParseScript(string(src)))
			if got != want {
				gl, wl := strings.Split(got, "\n"), strings.Split(want, "\n")
				for i := 0; i < len(gl) && i < len(wl); i++ {
					if gl[i] != wl[i] {
						t.Fatalf("line %d differs\n got: %q\nwant: %q", i+1, gl[i], wl[i])
					}
				}
				t.Fatalf("length differs: got %d lines, want %d", len(gl), len(wl))
			}
		})
	}
}

func readGolden(t *testing.T, path string) string {
	f, err := os.Open(path)
	if err != nil {
		t.Fatalf("missing golden transcript %s (run difftest/record-golden.sh)", path)
	}
	defer f.Close()
	zr, err := gzip.NewReader(f)
	if err != nil {
		t.Fatal(err)
	}
	var b bytes.Buffer
	if _, err := io.Copy(&b, zr); err != nil {
		t.Fatal(err)
	}
	return b.String()
}
