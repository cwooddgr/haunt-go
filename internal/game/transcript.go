package game

import "strings"

// MemStore keeps localStorage keys in memory (tests and tools).
type MemStore map[string]string

func (m MemStore) Get(k string) (string, bool) { v, ok := m[k]; return v, ok }
func (m MemStore) Set(k, v string)             { m[k] = v }
func (m MemStore) Remove(k string)             { delete(m, k) }

type scriptIO struct {
	inputs []string
	out    *strings.Builder
}

func (s *scriptIO) Println(l string) { s.out.WriteString(l); s.out.WriteByte('\n') }
func (s *scriptIO) Print(t string)   { s.out.WriteString(t); s.out.WriteByte('\n') }
func (s *scriptIO) ReadLine() (string, bool) {
	if len(s.inputs) == 0 || s.inputs[0] == "@restart" {
		return "", false
	}
	raw := s.inputs[0]
	s.inputs = s.inputs[1:]
	s.Println("* " + raw)
	return raw, true
}

// ParseScript reads a difftest script: one command per line, blank lines
// and #comments skipped.
func ParseScript(text string) []string {
	var out []string
	for _, l := range strings.Split(text, "\n") {
		l = strings.TrimSpace(l)
		if l != "" && !strings.HasPrefix(l, "#") {
			out = append(out, l)
		}
	}
	return out
}

// Transcript plays a script the way difftest/oracle.mjs plays it in the
// JS: every printed line, each command echoed as "* <cmd>", and "@restart"
// starting a new page load that keeps localStorage.
func Transcript(inputs []string) string {
	var out strings.Builder
	store := MemStore{}
	rest := inputs
	for {
		io := &scriptIO{inputs: rest, out: &out}
		Main(NewTerm(io), store)
		rest = io.inputs
		i := -1
		for j, l := range rest {
			if l == "@restart" {
				i = j
				break
			}
		}
		if i < 0 {
			break
		}
		rest = rest[i+1:]
		out.WriteString("@restart\n")
	}
	return out.String()
}
