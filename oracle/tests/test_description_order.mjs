// Unit test for the MEA priority boost on location-description rules.
//
// When the player is at a lawn cell with dropped items, the room description
// ("You are on the west side of the house.") must print BEFORE any
// "There is a X here." item lines. Before the priority fix, items and
// descriptions interleaved based on raw WME stamp order.

import { WM, Engine } from "../js/engine.js";
import { Runtime } from "../js/runtime.js";
import { createRules } from "../js/rules.generated.js";
import { patchRules } from "../js/game.js";

class CaptureTerm {
    constructor() { this.out = []; }
    println(text) { this.out.push(String(text)); }
    blank() { this.out.push(""); }
    print(text) { this.out.push(String(text)); }
    async readToken() { throw new Error("done"); }
    async readLine() { throw new Error("done"); }
}

function assert(cond, msg) {
    if (!cond) { console.error("FAIL: " + msg); process.exit(1); }
}

function buildEngine(term) {
    const wm = new WM();
    const rt = new Runtime(wm, term);
    const engine = new Engine({ rules: [], wm, term });
    const rules = createRules(rt, engine);
    rules.push(...patchRules(rt));
    engine.rules = rules;
    engine.maxCycles = 100000;
    return { wm, rt, engine };
}

async function testLawnDescriptionBeforeItems() {
    const term = new CaptureTerm();
    const { wm, rt, engine } = buildEngine(term);

    wm.make("x", [30]);
    wm.make("location", { name: "lawn", side: "in", east: 4, north: 5 });
    wm.make("place", { name: "lawn", visited: "t" });
    wm.make("status", { score: 0 });
    wm.make("time", { realtime: 2200, btime: 2214 });
    const cell = { place: "lawn", side: "in", east: 4, north: 5, treasure: "t", xscore: "t", scored: "t" };
    wm.make("object", { name: "gem", ...cell });
    wm.make("object", { name: "jade", ...cell });
    wm.make("object", { name: "mattress", place: "lawn", side: "in", east: 4, north: 5 });

    try { await engine.run(); } catch (e) {}
    rt.flush();

    const lines = term.out.filter(l => l && l.trim());
    const descIdx = lines.findIndex(l => /west side of the house/i.test(l));
    assert(descIdx >= 0, `room description never printed. Output: ${JSON.stringify(lines)}`);

    for (let i = 0; i < descIdx; i++) {
        assert(!/there is .* here/i.test(lines[i]),
            `item line appeared before description at line ${i}: '${lines[i]}'. Full output: ${JSON.stringify(lines)}`);
    }

    const itemLines = lines.filter(l => /there is .* here/i.test(l));
    assert(itemLines.length >= 2,
        `expected multiple item lines, got ${itemLines.length}. Output: ${JSON.stringify(lines)}`);

    console.log("PASS: lawn room description fires before item lines.");
}

async function testSingleCellDescriptionStillWorks() {
    const term = new CaptureTerm();
    const { wm, rt, engine } = buildEngine(term);

    wm.make("x", [30]);
    wm.make("location", { name: "bathroom" });
    wm.make("place", { name: "bathroom", visited: "t" });
    wm.make("status", { score: 0 });
    wm.make("time", { realtime: 2200, btime: 2214 });
    wm.make("object", { name: "soap", place: "bathroom" });

    try { await engine.run(); } catch (e) {}
    rt.flush();

    const lines = term.out.filter(l => l && l.trim());
    const soapIdx = lines.findIndex(l => /bar of soap here/i.test(l));
    assert(soapIdx >= 0, `soap display rule did not fire. Output: ${JSON.stringify(lines)}`);
    console.log("PASS: single-cell room item display still works.");
}

async function main() {
    await testLawnDescriptionBeforeItems();
    await testSingleCellDescriptionStillWorks();
}

main().catch(e => { console.error(e); process.exit(1); });
