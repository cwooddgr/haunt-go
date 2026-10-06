// Oracle driver: runs Scalo's JS (oracle/js) the way the browser does,
// minus the boot animation, and prints a transcript per session.
//
// Usage: node difftest/oracle.mjs <outdir> <script>...
// Script: one command per line; blank lines and #comments skipped.
// A line "@restart" ends the session and starts a new page load that
// keeps localStorage (to exercise the resume prompt and save slots).
//
// Transcript: every println/blank as a line, each input as "* <cmd>".

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const store = new Map();
globalThis.window = {};
globalThis.localStorage = {
    getItem: k => store.has(k) ? store.get(k) : null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
};
const { runGame } = await import(resolve(here, "../oracle/js/game.js"));

class Term {
    constructor(inputs, out) { this.inputs = inputs; this.out = out; }
    println(...parts) { this.out.push(parts.map(p => p == null ? "" : String(p)).join("")); }
    print(t) { this.out.push(String(t)); }
    blank() { this.out.push(""); }
    async readLine() {
        if (this._runtime) this._runtime.lineBuffer = "";
        if (this.inputs.length === 0 || this.inputs[0] === "@restart") throw new Error("input exhausted");
        const raw = this.inputs.shift();
        this.out.push("* " + raw);
        return raw.trim();
    }
    async readToken() {
        const line = await this.readLine();
        return line.split(/\s+/)[0] || "";
    }
}

// js/main.js after playBootSequence.
async function pageLoad(term) {
    const autoRaw = localStorage.getItem("haunt:autosave");
    if (autoRaw) {
        term.println("A previous game was found.");
        term.println("Resume? (y/n)");
        const ans = await term.readToken();
        if (ans.toLowerCase().startsWith("y")) {
            try {
                const snapshot = JSON.parse(autoRaw);
                if (ans.toLowerCase() === "yy" && snapshot.classes && snapshot.classes.time) {
                    for (const t of snapshot.classes.time) t.realtime = 2200;
                }
                term.println("Resuming...");
                await runGame(term, { snapshot });
                return;
            } catch (e) {
                term.println("Save corrupted, starting new game.");
            }
        } else {
            localStorage.removeItem("haunt:autosave");
        }
    }
    await runGame(term);
}

export function parseScript(text) {
    return text.split("\n").map(s => s.trim()).filter(s => s.length > 0 && !s.startsWith("#"));
}

export async function runScript(inputs) {
    store.clear();
    const out = [];
    let rest = inputs.slice();
    for (;;) {
        const term = new Term(rest, out);
        try { await pageLoad(term); } catch (e) { term.println(""); term.println("FATAL: " + (e && e.message ? e.message : String(e))); }
        rest = term.inputs;
        // Drop everything up to and including the next @restart.
        const i = rest.indexOf("@restart");
        if (i < 0) break;
        rest = rest.slice(i + 1);
        out.push("@restart");
    }
    return out.join("\n") + "\n";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const outdir = process.argv[2];
    mkdirSync(outdir, { recursive: true });
    const origErr = console.error; console.error = () => {};
    for (const f of process.argv.slice(3)) {
        const t = await runScript(parseScript(readFileSync(f, "utf8")));
        writeFileSync(resolve(outdir, basename(f).replace(/\.[^.]+$/, "") + ".txt"), t);
    }
    console.error = origErr;
}
