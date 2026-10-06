#!/bin/bash
# Record the JS original's transcripts for the difftest scripts into
# difftest/golden/<dir>_<name>.txt.gz. Run after changing oracle/ or the
# scripts; `go test ./difftest` then checks the Go port against them.
#
#   difftest/record-golden.sh           corpus, targeted, fuzz
#   difftest/record-golden.sh loops     the name8/name9 rewrite-loop scripts.
#       Before upstream cbfa108 the JS spun to its 1,000,000-cycle limit on
#       these; it now answers them like any other input.
set -euo pipefail
cd "$(dirname "$0")"
dirs=(corpus targeted fuzz)
[ "${1:-}" = loops ] && dirs=(loops)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p golden
runner=oracle.mjs
for d in "${dirs[@]}"; do
  ls "$d"/*.cmds >/dev/null 2>&1 || continue
  rm -f golden/"${d}"_*.txt.gz
  mkdir -p "$tmp/$d"
  ls "$d"/*.cmds | xargs -P "$(sysctl -n hw.ncpu 2>/dev/null || nproc)" -n 1 node "$runner" "$tmp/$d"
  for f in "$tmp/$d"/*.txt; do gzip -9 -n -c "$f" > "golden/${d}_$(basename "$f").gz"; done
done
echo "golden: $(ls golden | wc -l | tr -d ' ') transcripts"
