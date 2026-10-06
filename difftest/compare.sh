#!/bin/bash
# Replay scripts through the JS oracle and the Go port; report mismatches.
# Usage: difftest/compare.sh <workdir> <script>...
set -euo pipefail
work=$1; shift
root=$(cd "$(dirname "$0")/.." && pwd)
rm -rf "$work/js" "$work/go"; mkdir -p "$work/js" "$work/go"
go build -o "$work/haunt-transcript" "$root/cmd/haunt-transcript"
"$work/haunt-transcript" "$work/go" "$@" 2>/dev/null
# The JS is slow; spread it across cores in batches of 8 scripts.
printf '%s\n' "$@" | xargs -P "$(sysctl -n hw.ncpu 2>/dev/null || nproc)" -n 8 node "$root/difftest/oracle.mjs" "$work/js"
same=0; diff=0
for f in "$work"/js/*.txt; do
  b=$(basename "$f")
  if cmp -s "$f" "$work/go/$b"; then same=$((same+1)); else diff=$((diff+1)); echo "DIFF $b"; fi
done
echo "same=$same diff=$diff"
