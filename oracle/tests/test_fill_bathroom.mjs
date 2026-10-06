// Unit test for the patch_fill_bathroom rule.
//
// Verifies the MEA-conflict fix: when the player is in the bathroom holding
// an empty bottle and types "fill bottle water", the patch rule wins the
// conflict resolution against the generic name231 fallback ("There is nothing
// to fill the bottle with.") and fills the bottle with bathwater.
//
// Runs in isolation: builds a minimal working memory and drives a single
// conflict-resolution cycle directly.

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

async function main() {
    const term = new CaptureTerm();
    const wm = new WM();
    const rt = new Runtime(wm, term);
    const engine = new Engine({ rules: [], wm, term });
    const rules = createRules(rt, engine);
    rules.push(...patchRules(rt));
    engine.rules = rules;

    wm.make("x", [30]);
    wm.make("location", { name: "bathroom" });
    wm.make("place", { name: "bathroom", visited: "t" });
    wm.make("object", { name: "bottle", place: "held" });
    wm.make("status", { score: 0, went: "w", sound: "on" });
    wm.make("time", { realtime: 2200, btime: 2214 });
    wm.make("input", ["fill", "bottle", "water"]);

    const inst = engine._findBest();
    assert(inst, "no rule matched for 'fill bottle water' in bathroom");
    assert(inst.rule.name === "patch_fill_bathroom",
        `expected patch_fill_bathroom to win conflict resolution, got '${inst.rule.name}'`);

    await inst.rule.action(inst.bindings, wm, term);
    rt.flush();
    const output = term.out.join("\n").toLowerCase();

    assert(output.includes("bottle is full of bathwater"),
        `expected bathwater output, got: ${JSON.stringify(term.out)}`);

    const bathwater = [...wm.all("object")].find(o => o.name === "bathwater");
    assert(bathwater, "bathwater object was not created");
    assert(bathwater.inside === "bottle", "bathwater should be inside the bottle");

    console.log("PASS: patch_fill_bathroom wins MEA and fills the bottle with bathwater.");
}

main().catch(e => { console.error(e); process.exit(1); });
