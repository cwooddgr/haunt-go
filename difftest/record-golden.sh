#!/bin/bash
# Record the JS original's transcripts for the difftest scripts into
# difftest/golden/<dir>_<name>.txt.gz. Run after changing oracle/ or the
# scripts; `go test ./difftest` then checks the Go port against them.
#
#   difftest/record-golden.sh           corpus, targeted, fuzz
#   difftest/record-golden.sh loops     the rewrite-loop scripts. The JS
#       spins silently to its 1,000,000-cycle limit on these (hours in
#       Node), so this records from a temp copy of oracle/ with the limit
#       at 20,000; a silent periodic loop ends with the same output either way.
set -euo pipefail
cd "$(dirname "$0")"
dirs=(corpus targeted fuzz)
[ "${1:-}" = loops ] && dirs=(loops)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p golden
runner=oracle.mjs
if [ "${dirs[0]}" = loops ]; then
  mkdir -p "$tmp/o/difftest" && cp -r ../oracle "$tmp/o/" && cp oracle.mjs "$tmp/o/difftest/"
  sed -i.bak 's/engine.maxCycles = 1_000_000/engine.maxCycles = 20_000/' "$tmp/o/oracle/js/game.js"
  grep -q "maxCycles = 20_000" "$tmp/o/oracle/js/game.js" || { echo "maxCycles line not found" >&2; exit 1; }
  runner="$tmp/o/difftest/oracle.mjs"
fi
for d in "${dirs[@]}"; do
  ls "$d"/*.cmds >/dev/null 2>&1 || continue
  rm -f golden/"${d}"_*.txt.gz
  mkdir -p "$tmp/$d"
  ls "$d"/*.cmds | xargs -P "$(sysctl -n hw.ncpu 2>/dev/null || nproc)" -n 1 node "$runner" "$tmp/$d"
  for f in "$tmp/$d"/*.txt; do gzip -9 -n -c "$f" > "golden/${d}_$(basename "$f").gz"; done
done
echo "golden: $(ls golden | wc -l | tr -d ' ') transcripts"
