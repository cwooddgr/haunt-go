# CLAUDE.md

**haunt-go**: John Laird's Haunt, via John Scalo's JS web port (`github.com/jscalo/haunt`, MIT), translated to Go so it runs on the rpi-games Pi (armv6, one 700 MHz core) as menu key `h`. Public repo `cwooddgr/haunt-go`; commit and push to `main`. The server side (dgamelaunch, retro-play) is documented in `../rpi-games`.

## Commands

- `./build.sh`: regenerate `internal/game/*_gen.go` from `oracle/js/`, build host tools into `bin/`.
- `./build.sh pi`: static armv6 binary `bin/haunt-armv6`.
- `go test ./...`: the Go port against recorded JS transcripts (`difftest/golden/`).
- `difftest/compare.sh <workdir> <scripts...>`: live JS-vs-Go comparison (needs Node).
- `difftest/record-golden.sh` (and `... loops`): re-record the JS transcripts.
- `bin/haunt-fuzz`: grow the script corpus (`-dur`, `-seeds`, `-corpus`; `-direct` splices uncovered rules' commands; `-minimize` picks a covering subset).
- `bin/haunt-trace <script>`: print every rule firing; `-stats` reports firings per turn.

## Map

- `oracle/`: Scalo's JS pinned at upstream `cbfa108`, plus his `tests/` restored from `dacd25d^`. The source of truth for behavior.
- `tools/transpile/transpile.mjs`: JS → Go translator (acorn). Fails loudly on unsupported syntax.
- `internal/js`: JS value semantics (undefined/null, `==`, truthiness, `+`, String/Array/Set/Map/JSON builtins).
- `internal/engine`: `engine.js` ported line by line, plus a per-rule match cache and the per-turn loop guard.
- `internal/game`: `runGame`/`main.js` glue, runtime (`rt`), terminal, save/restore; `*_gen.go` are generated.
- `cmd/haunt`: the SSH front end that `retro-play` runs as `/usr/games/haunt <savedir> <cols>`.

## Rules

- **Never hand-edit `*_gen.go`**: change the translator or `internal/js`, then `./build.sh`. (Claude Code, 2026-10-05)
- **Fidelity bar is byte-identical transcripts vs the JS** on every difftest script (decided-by-user 2026-10-05; [why](docs/decisions.md)). A difference is a bug in our port.
- **Loop guard**: a safety net for any rule that feeds itself. Upstream `cbfa108` fixed the known case (`name8`/`name9` on "take off off"). We end a turn when its working-memory contents repeat (or at 2,000 cycles). No difftest script reaches it now. (Claude Code, 2026-10-05; decided-by-user to keep it)
- Kept on purpose: Scalo's `yy` resume backdoor (decided-by-user 2026-10-05).
- Deploying to the Pi: `scp bin/haunt-armv6 games:/tmp/ && ssh games 'sudo install -o root -g root -m 755 /tmp/haunt-armv6 /var/dgl/usr/games/haunt'`. Live service with real players; a new binary only affects sessions started afterwards.

## Status

Live on the games server as menu key h; the Pi runs the upstream `cbfa108` build (deployed 2026-10-05). History: [docs/status.md](docs/status.md).
