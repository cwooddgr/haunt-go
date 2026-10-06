// Unit test for the patch_pour_on_lawn rule.
//
// Verifies that pouring bathwater on the garden tile (lawn, side=in,
// east=3, north=7) copies the location's side/east/north onto the
// bathwater, so that name1087 can subsequently sprout the orchid.
//
// The original OPS5 rule name240 only copies ^place, which means the
// sprout condition never matches. The patch fixes this without breaking
// pours at non-lawn locations.

import { WM, Engine } from "../js/engine.js";
import { Runtime } from "../js/runtime.js";
import { createRules } from "../js/rules.generated.js";
import { patchRules } from "../js/game.js";

class CaptureTerm {
    constructor() { this.out = []; }
    println(text) { this.out.push(String(text)); }
    blank() { this.out.push(""); }
    print(text) { this.out.push(String(text)); }
    async readToken() { throw new Error("no input expected"); }
    async readLine() { throw new Error("no input expected"); }
}

function assert(cond, msg) {
    if (!cond) {
        console.error("FAIL: " + msg);
        process.exit(1);
    }
}

function buildEngine(term) {
    const wm = new WM();
    const rt = new Runtime(wm, term);
    const engine = new Engine({ rules: [], wm, term });
    const rules = createRules(rt, engine);
    rules.push(...patchRules(rt));
    engine.rules = rules;
    return { wm, rt, engine };
}

async function fireOnce(engine, expectedRuleName) {
    const inst = engine._findBest();
    assert(inst, `no rule matched (expected '${expectedRuleName}')`);
    assert(inst.rule.name === expectedRuleName,
        `expected '${expectedRuleName}' to win MEA, got '${inst.rule.name}'`);
    engine.refracted.add(inst.refKey);
    await inst.rule.action(inst.bindings, engine.wm, engine.term);
    return inst;
}

async function testPourAtGardenSproutsOrchid() {
    const term = new CaptureTerm();
    const { wm, rt, engine } = buildEngine(term);

    wm.make("x", [30]);
    wm.make("location", { name: "lawn", side: "in", east: 3, north: 7 });
    wm.make("place", { name: "lawn" });
    wm.make("status", { score: 0, went: "w", sound: "on" });
    wm.make("time", { realtime: 2200, btime: 2214 });
    wm.make("object", { name: "bottle", place: "held" });
    wm.make("object", { name: "bathwater", inside: "bottle" });
    wm.make("object", { name: "orchid", place: "lawn", side: "in", east: 3, north: 7, state: "seed" });
    wm.make("input", ["pour"]);

    await fireOnce(engine, "name1086");
    await fireOnce(engine, "patch_pour_on_lawn");

    const bathwater = [...wm.all("object")].find(o => o.name === "bathwater");
    assert(bathwater.place === "lawn", `bathwater place wrong: ${bathwater.place}`);
    assert(bathwater.side === "in", `bathwater side wrong: ${bathwater.side}`);
    assert(bathwater.east === 3, `bathwater east wrong: ${bathwater.east}`);
    assert(bathwater.north === 7, `bathwater north wrong: ${bathwater.north}`);
    assert(bathwater.inside === null || bathwater.inside === undefined,
        `bathwater should no longer be inside bottle: ${bathwater.inside}`);

    await fireOnce(engine, "name1087");
    rt.flush();

    const orchid = [...wm.all("object")].find(o => o.name === "orchid");
    assert(orchid.state === "plant", `orchid should be sprouted, state=${orchid.state}`);

    const output = term.out.join("\n").toLowerCase();
    assert(output.includes("orchid sprouts"),
        `expected sprout message, got: ${JSON.stringify(term.out)}`);

    console.log("PASS: pouring bathwater at (3,7) copies coords and sprouts the orchid.");
}

async function testPourInBathroomUnaffected() {
    const term = new CaptureTerm();
    const { wm, rt, engine } = buildEngine(term);

    wm.make("x", [30]);
    wm.make("location", { name: "bathroom" });
    wm.make("place", { name: "bathroom" });
    wm.make("status", { score: 0, went: "w", sound: "on" });
    wm.make("time", { realtime: 2200, btime: 2214 });
    wm.make("object", { name: "bottle", place: "held" });
    wm.make("object", { name: "bathwater", inside: "bottle" });
    wm.make("input", ["pour"]);

    const inst = engine._findBest();
    assert(inst, "no rule matched for pour in bathroom");
    assert(inst.rule.name !== "patch_pour_on_lawn",
        `patch_pour_on_lawn must not fire in bathroom, but did`);

    console.log("PASS: patch_pour_on_lawn does not hijack bathroom pours (winner: " +
        inst.rule.name + ").");
}

async function main() {
    await testPourAtGardenSproutsOrchid();
    await testPourInBathroomUnaffected();
}

main().catch(e => { console.error(e); process.exit(1); });
