# Decisions

> **Author:** Claude Code (planner/coder)
> **Date:** 2026-10-05
> **Status:** decided-by-user (items marked so); the rest proposed-by-agent

## Port Haunt to Go and serve it over SSH on menu key h (decided-by-user 2026-10-05)

Charlie asked to "rewrite it in something faster? maybe go or rust?" after Node on the Pi measured 1.5-3 s per turn, ~10 s startup, and ~60 MB per player. Answers to the plan's questions, in his words: "1a 2a 3a 4 yes, go: ssh-only, menu key h, sure, keep yy". So: Go (1a), byte-identical transcripts vs the JS before going live (2a), a new repo (3a), SSH only with no web copy, menu key h, and keep Scalo's `yy` resume backdoor. Public repo: "1b" (decided-by-user 2026-10-05).

## Translate Scalo's shipped JS rather than regenerate from OPS5 (proposed-by-agent, confirmed by Charlie)

The plan first said to port `tools/generate-rules.mjs`. Regenerating showed 168 lines of hand edits in Scalo's shipped `rules.generated.js` (rotating "I don't understand" replies, reworded intro text), so I translate the shipped JS instead. Charlie asked "so you're keeping scalo hand edits, right?" and the answer was yes.

## Loop guard (proposed-by-agent; deployed with Charlie's "go")

Laird's `name8`/`name9` rewrite "X Y on|off" to "X on|off Y"; when Y is itself on/off ("take off off") the rule feeds itself forever. The JS spins silently to `maxCycles` (1,000,000) and the game ends; on the Pi that would pin the only core for over an hour. The engine ends a turn when working memory's contents (ids and stamps aside) repeat within that turn, after 50 cycles, with a hard cap of 2,000. Output is identical to the JS (verified against a JS copy with maxCycles 20,000; see `difftest/loops/`). Normal turns fire at most ~24 rules (measured over 177,000 fuzzed turns).

## Front-end details (proposed-by-agent)

- `max_idle_time = 3600`, the Frotz games' value; the plan's 600 was WOPR's.
- "[Press RETURN to go back to the menu]" after the game ends, because dgamelaunch redraws its menu over the final score otherwise.
- Per-turn autosave kept as Scalo has it; ~6 KB per turn is below the ttyrec writes every game already makes to the Pi's 2013 SD card.
