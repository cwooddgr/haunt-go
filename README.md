# haunt-go

John Laird's **Haunt** (1979-1983), the OPS4 production-system adventure, running in Go so it can live on a small Raspberry Pi game server you reach over SSH. To play, run `ssh -p 3517 dgl@games.dgrlabs.co`, register or log in, and press `h`.

This is a port of a port. John Scalo rebuilt Haunt for the browser from Laird's half-finished OPS5 source, the original HAUNT.EXE binary, and thousands of probe sessions against it. His version is at <https://github.com/jscalo/haunt> and you can play it at <https://haunt.madebywindmill.com>. All of the game's behavior here comes from his work. We changed the language it runs in and nothing else.

## Why Go

Our server is an original Raspberry Pi Model B with one 700 MHz core. Scalo's JavaScript runs there under Node, but it took about 10 seconds to start, 1.5 to 3 seconds per turn, and 60 MB per player. The Go build starts in under a second, answers most turns in about 60 ms (95% within 140 ms), and uses about 16 MB.

## How it works

We didn't rewrite the game by hand. `tools/transpile` reads Scalo's shipped JavaScript (`oracle/js/rules.generated.js` and `oracle/js/game.js`, pinned at upstream commit `09f6f9a`) and writes Go that calls into a small package of JavaScript semantics (`internal/js`), so `==`, truthiness, `+` on strings, and undefined vs. null all behave the way they did in the browser. Scalo's hand edits to the generated rules come along with everything else.

`internal/engine` is his rule engine ported line by line, keeping his conflict resolution and tie-breaking order exactly. On top of that it caches each rule's match until something the rule depends on changes, which is where most of the speed comes from.

`cmd/haunt` is the terminal front end. It saves the game every turn and keeps SAVE/RESTORE slots as JSON files in the player's save directory, the same snapshots the web version keeps in localStorage. Reconnect and it offers to resume. Scalo's `yy` answer at that prompt still resets the madness timer.

## Checking it against the original

`difftest/` runs the same command scripts through Scalo's JavaScript (in Node, set up the way the browser runs it) and through the Go port, then compares the transcripts byte for byte. The scripts are his old test transcripts plus a corpus grown by `cmd/haunt-fuzz`, which plays thousands of sessions, picks commands from what the game just said, and keeps any session that fires a new rule or reaches a new room.

```
./build.sh                                   # regenerate rules_gen.go and patches_gen.go, build bin/
difftest/compare.sh /tmp/cmp difftest/corpus/*.cmds difftest/fuzz/*.cmds
go test ./...                                # Go transcripts against the stored JS ones
./build.sh pi                                # static armv6 binary for the Pi
```

To pick up a newer upstream version, replace `oracle/` with it, run `./build.sh`, and run the difftest. Anything the translator doesn't understand stops the build with a file and line number.

## Credits

- **Haunt** by John Laird. [Wikipedia](https://en.wikipedia.org/wiki/HAUNT)
- Web port by [John Scalo](https://github.com/jscalo/haunt), MIT license. His README tells the story of how he rebuilt it.

MIT license; see `LICENSE`.
