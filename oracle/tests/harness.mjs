// Headless harness: run the engine with a scripted input sequence and capture
// all output to stdout. Usage: node tests/harness.mjs [script.txt]
//
// Script file format: one command per line, blank lines allowed.
// "@stop" on its own line halts the harness after any queued input.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { WM, Engine } = await import("../js/engine.js");
const { Runtime } = await import("../js/runtime.js");
const { createRules } = await import("../js/rules.generated.js");
const { patchRules } = await import("../js/game.js");

class FakeTerm {
    constructor(inputs) {
        this.inputs = inputs.slice();
        this.out = [];
        this.turn = 0;
    }
    println(text) {
        this.out.push(String(text));
        process.stdout.write(String(text) + "\n");
    }
    blank() {
        this.out.push("");
        process.stdout.write("\n");
    }
    print(text) {
        this.out.push(String(text));
        process.stdout.write(String(text));
    }
    async readToken() {
        if (this.inputs.length === 0) {
            process.stdout.write("\n[input exhausted, halting]\n");
            throw new Error("input exhausted");
        }
        const line = this.inputs.shift();
        process.stdout.write("> " + line + "\n");
        return line.split(/\s+/)[0] || "";
    }
    async readLine() {
        if (this.inputs.length === 0) {
            process.stdout.write("\n[input exhausted, halting]\n");
            throw new Error("input exhausted");
        }
        const line = this.inputs.shift();
        this.turn++;
        process.stdout.write("> " + line + "\n");
        return line;
    }
}

const scriptPath = process.argv[2];
let inputs;
if (scriptPath) {
    inputs = readFileSync(resolve(scriptPath), "utf8")
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith("#"));
} else {
    inputs = ["no", "look", "wait", "wait", "wait", "wait", "wait", "wait", "wait", "wait"];
}

const term = new FakeTerm(inputs);
const wm = new WM();
const rt = new Runtime(wm, term);
const engine = new Engine({ rules: [], wm, term });
const rules = createRules(rt, engine);
rules.push(...patchRules(rt));
engine.rules = rules;
engine.maxCycles = 50000;

wm.make("start", []);

try {
    await engine.run();
} catch (e) {
    if (/input exhausted/.test(e.message || "")) {
        process.stdout.write("\n[input exhausted]\n");
    } else {
        console.error("ERROR:", e.message);
        console.error(e.stack);
    }
}
rt.flush();
process.stdout.write("\n[engine stopped after " + engine.cycle + " cycles]\n");
process.stdout.write("[wm classes: " + Array.from(wm.classes.keys()).sort().join(", ") + "]\n");
const loc = wm.first("location");
if (loc) process.stdout.write("[location: " + loc.name + "]\n");
const time = wm.first("time");
if (time) process.stdout.write("[realtime: " + time.realtime + "]\n");
