// Runtime helpers that generated rule actions call into.
// Keeps js/rules.generated.js readable and lets us change semantics in one place.

const V = new URL(import.meta.url).search || "";
const { eqv } = await import("./engine.js" + V);

export class Runtime {
    constructor(wm, term) {
        this.wm = wm;
        this.term = term;
        this.lineBuffer = "";
        term._runtime = this;
    }

    // ---- write / crlf ----
    //
    // Rules call write(parts...) once per (write ...) form. Each call maps to
    // one OPS5 write action. `crlf` in the source is translated to the literal
    // string "\n"; we join parts into a buffered line and flush on each CRLF.
    write(...parts) {
        for (let i = 0; i < parts.length; i++) {
            const p = parts[i];
            if (p == null) continue;
            const s = typeof p === "string" ? p : String(p);
            if (s === "\n") {
                if (this.lineBuffer) {
                    this.term.println(this.lineBuffer);
                    this.lineBuffer = "";
                } else {
                    this.term.blank();
                }
                continue;
            }
            if (this.lineBuffer && !this.lineBuffer.endsWith(" ") && !s.startsWith(" ")) {
                this.lineBuffer += " ";
            }
            this.lineBuffer += s;
        }
    }


    flush() {
        if (this.lineBuffer) {
            this.term.println(this.lineBuffer);
            this.lineBuffer = "";
        }
    }

    // ---- arithmetic ----
    compute(a, op, b) {
        const x = Number(a) || 0;
        const y = Number(b) || 0;
        switch (op) {
            case "+": return x + y;
            case "-": return x - y;
            case "*": return x * y;
            case "/": return y === 0 ? 0 : x / y;
            default: return 0;
        }
    }

    // ---- substr ----
    //
    // OPS5 substr is 1-indexed. `inf` means "to end". The first argument is
    // a WME (passed as a resolved object), from which we take its tokens.
    // (substr 2 4 inf) on WME whose tokens are [a,b,c,d,e] with class prefix
    // at position 1 means: elements starting at position 4 = index 3 of tokens.
    //
    // Important: OPS5 counts position 1 as the class name. So `substr N M inf`
    // with position 4 means: skip the class name and the first 2 tokens, return
    // the rest. Translating: returned slice is wme.tokens.slice(M - 2).
    substr(wme, from, to) {
        const tokens = wme && wme.tokens ? wme.tokens : [];
        const startIdx = Math.max(0, from - 2);
        if (to === "inf" || to === Infinity || to == null) {
            return tokens.slice(startIdx);
        }
        const endIdx = Math.max(0, to - 1);
        return tokens.slice(startIdx, endIdx);
    }

    // ---- make / modify / remove / halt ----
    make(cls, fieldsOrTokens) {
        return this.wm.make(cls, fieldsOrTokens);
    }

    modify(wme, changes) {
        this.wm.modify(wme, changes);
    }

    remove(wme) {
        this.wm.remove(wme);
    }
}
