# Binary Divergences

Our OPS5 source is a partial OPS4→OPS5 port abandoned mid-way. The original OPS4 source is lost. Ground truth for the parts our source doesn't cover (and for comparison on parts it does) is the live PDP-10 binary on sdf.org.

Connection: `ssh twenex@sdf.org`, login `new`/`new`, run `haunt`.

Probe harness: `tests/remote_play.exp <cmd-file> <log-out>`. Input files mirror walkthrough format; pacing is 80ms/char + 250ms inter-command (faster speeds break the service).

Transcripts from each probe are in `tests/transcripts/`.

---

## Confirmed divergences

### Bus exit verb

- **Binary**: `out` is the only reliable exit verb from the bus. `exit bus`, `get off`, `disembark`, `get out` all fail with various error messages.
- **Our port**: `exit bus`, `get off`, `leave`, `depart`, `disembark`, `get out` all work; bare `out` did not (it normalizes to `exit` alone, which has no target).
- **Status**: Fixed in `patch_bus_out` — bare `out` in bus now modifies place to `lawn out 5,2` (matches name1026).
- **Test**: `tests/walkthrough_bus_out.txt`.

### Outer-lawn geometry

- **Binary**: Bus drops you at the south-wall midpoint, directly facing a *decorative, locked* south gate ("inoperable, won't be able to open it"). The real entry is the **east gate**, 3 tiles north of the SE corner. Walls are slick (no climb anywhere on perimeter).
- **Our port**: Grid-based outer lawn (east/north coords 1..8); entry point at east=8, north=5 (which is geometrically equivalent to the binary's "east gate 3 tiles north of SE corner"). Still has the ivy-wall balcony jump as an alternate entry path that the binary lacks.
- **Status**: Grid coordinates happen to match (confirmed via probe). Ivy-wall alt path remains — flagged but not reconciled; may be intended as a shortcut for players.

### Gate entry sequence

- **Binary**: From the east gate:
  1. `press button` × 4 (progressive snore/grumble/wake responses; 5th press teleports you back to bus stop as penalty).
  2. After 4th press, attendant asks *"How did you get here, on that stupid bus?"* → `yes`.
  3. *"Suppose you think you can survive in Chez Moose for a night...?"* → `yes`.
  4. *"So I guess you want to come in the gate, don't you?"* → `yes`.
  5. Three admission questions:
     - *"What is your name?"* → any answer.
     - *"Which sex... interests you sexually"* → any answer, produces *"Your mother would faint if she knew that."*
     - *"What was the first production system with more than 1500 productions?"* → **`haunt`** (self-referential trivia). Wrong answer → back to bus stop.
  6. Gate opens; attendant **confiscates your gold token**; you're on the driveway with the gate locked behind you.
- **Our port**: Full dialog + trivia + token-toll reproduced via `gateEntryPatches` in `js/game.js` (15 rules). The former `hi` shortcut at the gate is disabled (shows a hint to use the button).
- **Status**: Reconciled.
- **Test**: `tests/walkthrough_gate_entry.txt` exercises the full flow through to token confiscation.

### Starting inventory / token

- **Binary**: Starting inventory is `token` + `watch`. Token is lost to the gate attendant on entry.
- **Our port**: Token is now confiscated at entry (see `patch_gate_trivia_right` in `js/game.js`). Post-entry inventory = `watch` only, matching the binary.
- **Status**: Reconciled.

---

## Inner estate — geometry & landmarks

Post-entry driveway is our port's `lawn side=in east=8 north=5`. From there, walking the binary maps to:

| Binary description                                     | Our port coord (side=in) |
|--------------------------------------------------------|--------------------------|
| "You are on the driveway. Gate to east is locked."     | `(8, 5)`                 |
| "There is a garage to the west." (directly N of drive) | `(8, 6)`                 |
| "East is a wall." (further N)                          | `(8, 7)`                 |
| "Garage to south. You're on the lawn of the mansion."  | `(7, 7)`                 |
| "Lawn of the mansion." (multiple tiles W)              | `(6, 7)` … `(4, 7)`      |
| "North-west corner of the house."                      | `(4, 6)`                 |
| "West side of the house." (house E-blocked)            | `(4, 5)`                 |
| "SW corner of the house."                              | `(4, 4)`                 |
| "Large door in the front of the mansion."              | `(5, 4)` ← `knock` here  |
| "SE corner of the house."                              | `(6, 4)`                 |
| "NE corner of the mansion." (garage-side)              | `(7, 6)`                 |
| "Ivy on the walls of the house. North side."           | `(5, 6)` or `(6, 6)`     |
| "Inside of the north border of a wall."                | `north = 8`              |
| "A wall is to the south." (inner south border)         | `north = 1`              |

**Key insight**: our port's inner-lawn coordinates already line up with the binary. The main difference is that binary tiles have named, distinctive descriptions ("NE corner", "west side", "garage to the south") whereas our port shows generic grid text.

**Ivy-wall authenticity**: ivy is on the NORTH wall of the mansion in the binary, accessed from inside the inner lawn — not on the outer perimeter wall as I first suspected. Our port's ivy-climb-to-balcony at `(5,6) → balcony` is therefore faithful.

---

## Truncated-region treasures (chest, coins, diamonds)

These live in regions whose full rule set is in the portion of the OPS4 source that was never ported to OPS5. Source fragments that DO exist:

- **chest** — `^place ocean ^south 2 ^east 2 ^up 1`. Ocean is 3-axis (south/east/up) so diving is involved.
- **coins** — `^place bathysphere`. Bathysphere is a location with `portal wdoor` (airlock door) and a `rope`.
- **diamonds** — `^place cave`. Cave is mentioned only in the initial make — no movement rules visible.
- **wetsuit** — `^place closet` (closet is reachable). Rule at line 3244 accepts `put on wetsuit`; line 3254 writes "You are wearing a wetsuit."
- **speargun** — `^place bathysphere ^state loaded`. Rules for `shoot speargun` visible; backlash snaps neck (line 3294).
- **conch** — a shell. `listen conch` says *"You hear the ocean 'rumble'."* (line 2792)
- **rope** — `^tied noose` initial. Rule name370: `pull rope` at bathysphere with rope tied to something in ocean + wdoor closed → "The airlock door is closed on the rope."
- **wdoor** portal — airlock between bathysphere and ocean.

The intended flow appears to be (inference):
1. Find bathysphere location somewhere inside the house.
2. Get wetsuit from closet.
3. Enter bathysphere, wear wetsuit.
4. Open wdoor and enter ocean (3D).
5. Navigate to chest at `(S2, E2, U1)`.
6. Find cave from ocean for diamonds.
7. Return to bathysphere via rope pull.

**Next exploration**: need to find the bathysphere entry point inside the mansion (probably a room we haven't mapped) via binary probe, then the ocean navigation grammar.

---

## Confirmed matches (no divergence found)

- **Intro text / bus boarding**: Identical to our port through the bus ride's "Va Vooooom!" narration.
- **Bus-stop `wait` / `board` mechanics**: Identical.
- **Max score (440)** and scoring rubric text: Identical.
- **Gate electrification**: Binary says *"upper part of the gate is electrified"* on `climb gate`; our port has this text too.

---

## Methodology

When probing the binary:

1. Build a command file in `tests/transcripts/<probe>.cmds` — one command per line, `#` for comments.
2. Run `tests/remote_play.exp <cmds> <log>`. Each session is a fresh game (no save state on the binary for `new` users).
3. Keep probes short (< 30 commands) — sdf.org shells get flaky on long sessions and pace-sensitive.
4. Save logs in `tests/transcripts/` with a descriptive name so later comparisons can cite them.

When reconciling a divergence:

1. Document the discrepancy in the "Confirmed divergences" section above, including cited transcript filenames.
2. Decide scope: a surgical patch (few rules, no walkthrough break) vs. a major rewrite (multiple rules, walkthrough updates).
3. For surgical changes, add a test in `tests/` using the `tests/harness.mjs` runner that exercises the new behavior.
4. For major rewrites, plan the full scope before editing (new WMEs, rule re-ordering, walkthrough updates, reference-file re-capture).
