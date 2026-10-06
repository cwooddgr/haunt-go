#!/bin/bash
# Regenerate the Go rules from the pinned JS, then build.
#   ./build.sh          host binaries in bin/
#   ./build.sh pi       static armv6 binary for the games Pi in bin/haunt-armv6
set -euo pipefail
cd "$(dirname "$0")"
( cd tools/transpile && [ -d node_modules ] || npm ci --silent )
node tools/transpile/transpile.mjs oracle/js/rules.generated.js internal/game/rules_gen.go --prefix rules_
node tools/transpile/transpile.mjs oracle/js/game.js internal/game/patches_gen.go \
  --skip V,WM,Engine,Runtime,createRules,runGame,serializeWM,restoreWM,SAVE_KEY,AUTO_KEY --prefix game_
gofmt -w internal/game/*_gen.go
mkdir -p bin
if [ "${1:-}" = pi ]; then
  GOOS=linux GOARCH=arm GOARM=6 CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o bin/haunt-armv6 ./cmd/haunt
else
  go build -o bin/ ./cmd/...
fi
