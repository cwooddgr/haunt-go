import { readFileSync } from "node:fs";
const { WM, Engine } = await import("../js/engine.js");
const { Runtime } = await import("../js/runtime.js");
const { createRules } = await import("../js/rules.generated.js");
const { patchRules } = await import("../js/game.js");
class FakeTerm {
    constructor(inputs) { this.inputs = inputs.slice(); }
    println(t){} blank(){} print(t){}
    async readToken() { if (!this.inputs.length) throw new Error("input exhausted"); return this.inputs.shift().split(/\s+/)[0]; }
    async readLine() { if (!this.inputs.length) throw new Error("input exhausted"); return this.inputs.shift(); }
}
const lines = readFileSync("tests/walkthrough_perfectScore.txt","utf8").split("\n").map(s=>s.trim()).filter(s=>s.length&&!s.startsWith("#"));
const term = new FakeTerm(lines);
const wm = new WM(); const rt = new Runtime(wm, term);
const engine = new Engine({ rules: [], wm, term });
const rules = createRules(rt, engine); rules.push(...patchRules(rt));
engine.rules = rules; engine.maxCycles = 100000;
wm.make("start", []);
try { await engine.run(); } catch(e) {}
const objs = wm.classes.get("object");
if (objs) {
    for (const o of objs.values()) {
        if (o.place === "lawn" || o.place === "intruck") console.log(o.name, o.place, "side", o.side, "east", o.east, "north", o.north, "_id", o._id);
    }
}
const gone = wm.classes.get("gone");
console.log("gone count:", gone ? gone.size : 0);
const turnoff = wm.classes.get("turnoff");
console.log("turnoff count:", turnoff ? turnoff.size : 0);
const status = wm.first("status");
console.log("score=", status && status.score);
