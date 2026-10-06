// OPS5-ish production rule engine.
//
// Working memory is sharded by class. Rules have conditions (data) and
// an action closure (codegen output). Matching is backtracking depth-first
// over the conditions. Conflict resolution is MEA (see _findBest for the
// full ladder and rationale):
//
//     1. Highest salience (explicit `priority` field) wins.
//     2. Dominant-stamp tiebreak (x-first uses x stamp; non-x uses max-stamp).
//     3. Specificity, then LEX of remaining stamps, then source order.
//
// Refraction: each rule instantiation fires at most once per set of matched
// (id, stamp) pairs. Modifying a WME bumps its stamp, so the old refraction
// key no longer applies and the rule can re-fire with the new state.

export class WM {
    constructor() {
        this.nextId = 1;
        this.stamp = 0;
        this.classes = new Map();
    }

    _bucket(cls) {
        let b = this.classes.get(cls);
        if (!b) { b = new Map(); this.classes.set(cls, b); }
        return b;
    }

    make(cls, fieldsOrTokens) {
        this.stamp++;
        const wme = { _id: this.nextId++, _stamp: this.stamp, _cls: cls };
        if (Array.isArray(fieldsOrTokens)) {
            wme.tokens = fieldsOrTokens.slice();
        } else if (fieldsOrTokens) {
            Object.assign(wme, fieldsOrTokens);
        }
        this._bucket(cls).set(wme._id, wme);
        return wme;
    }

    modify(wme, changes) {
        if (!wme) return;
        this.stamp++;
        wme._stamp = this.stamp;
        if (Array.isArray(changes)) {
            wme.tokens = changes.slice();
        } else if (changes) {
            Object.assign(wme, changes);
        }
    }

    remove(wme) {
        if (!wme) return;
        const b = this.classes.get(wme._cls);
        if (b) b.delete(wme._id);
    }

    all(cls) {
        const b = this.classes.get(cls);
        return b ? Array.from(b.values()) : [];
    }

    first(cls) {
        const b = this.classes.get(cls);
        if (!b) return null;
        for (const w of b.values()) return w;
        return null;
    }

    findByField(cls, field, value) {
        for (const w of this.all(cls)) {
            if (eqv(w[field], value)) return w;
        }
        return null;
    }
}

export class Engine {
    constructor({ rules, wm, term }) {
        this.rules = rules;
        this.wm = wm;
        this.term = term;
        this.refracted = new Set();
        this.halted = false;
        this.cycle = 0;
        this.maxCycles = 200000;
    }

    halt() { this.halted = true; }

    async run() {
        while (!this.halted && this.cycle++ < this.maxCycles) {
            const inst = this._findBest();
            if (!inst) break;
            this.refracted.add(inst.refKey);
            await new Promise(r => setTimeout(r, 0));
            try {
                const r = inst.rule.action(inst.bindings, this.wm, this.term, this);
                if (r && typeof r.then === "function") await r;
            } catch (e) {
                console.error("Error in rule", inst.rule.name, e);
                this.term.println("[engine error in " + inst.rule.name + ": " + (e.message || e) + "]");
                throw e;
            }
        }
    }

    _findBest() {
        // MEA conflict resolution (OPS5 variant — HAUNT-tuned):
        //   1. Higher explicit priority wins (patches set this explicitly;
        //      generated rules all have priority 0).
        //   2. Dominant-stamp tiebreak:
        //      - If first condition binds an `x` WME → dominant stamp is the
        //        x stamp (preserves HAUNT's `x=0..60` rule-tier ordering).
        //      - Otherwise → dominant stamp is the max over all matched WMEs
        //        (MEA-style recency; keeps input-first and location-first
        //        rules responsive to fresh commands).
        //      Higher dominant stamp wins.
        //   3. Then specificity: more condition tests wins.
        //   4. Then LEX on the remaining stamps, sorted desc.
        //   5. Then source order: lower rule index wins.
        //
        // History: three alternatives were tried and rejected:
        //   - Strict OPS5 MEA (firstStamp = first cond's stamp, no max boost):
        //     starves correct input-first rules in the intro and throughout.
        //     Broke 17/23 walkthroughs.
        //   - OPS4 LEX (sort all stamps desc, compare lexicographically):
        //     breaks 23/23 — intro bus sequence fails on cycle 0.
        //   - Specificity-first (prefer more specific regardless of stamps):
        //     breaks 23/23 — generic fallbacks like "you can't go that way"
        //     lose when they should win.
        // See tools/audit-conflict-resolution.mjs for a per-cycle comparison.
        // ~500 "suspicious starvations" are flagged by the audit but most are
        // false positives — cases where the current behavior is actually
        // faithful to the binary. True divergences are handled case-by-case
        // via priority-overridden patches in js/game.js (see patch_fountain_fill,
        // patch_smoke_marijuana_*, patch_follow_wire_* as the established
        // pattern).
        let best = null;
        let bestKey = null;
        for (const rule of this.rules) {
            const firstCond = rule.conditions[0];
            if (firstCond && !firstCond.negated && this.wm.all(firstCond.cls).length === 0) continue;
            let found = false;
            for (const inst of this._match(rule)) {
                if (this.refracted.has(inst.refKey)) continue;
                const firstMatched = inst.matched.find(w => w);
                const isXFirst = firstMatched && firstMatched._cls === "x";
                const firstStamp = firstMatched ? firstMatched._stamp : 0;
                let domStamp = firstStamp;
                let domWme = firstMatched;
                if (!isXFirst) {
                    for (const w of inst.matched) {
                        if (w && w._stamp > domStamp) {
                            domStamp = w._stamp;
                            domWme = w;
                        }
                    }
                }
                const rest = inst.matched
                    .filter(w => w && w !== domWme)
                    .map(w => w._stamp)
                    .sort((a, b) => b - a);
                const specCount = ruleSpecificity(rule);
                const k = {
                    priority: rule.priority || 0,
                    firstStamp: domStamp,
                    rest,
                    specificity: specCount,
                    sourceIndex: rule.sourceIndex,
                };
                if (!best || compareInst(k, bestKey) < 0) {
                    best = inst;
                    bestKey = k;
                }
                found = true;
                break;
            }
        }
        return best;
    }

    *_match(rule) {
        const matched = [];
        const bindings = {};
        yield* this._matchFrom(rule, 0, matched, bindings);
    }

    *_matchFrom(rule, idx, matched, bindings) {
        if (idx >= rule.conditions.length) {
            let maxStamp = 0;
            for (const w of matched) if (w && w._stamp > maxStamp) maxStamp = w._stamp;
            const refKey = rule.name + "|" +
                matched.map(w => w ? w._id + "." + w._stamp : "-").join("|");
            yield {
                rule,
                matched: matched.slice(),
                bindings: makeBindings(bindings, matched),
                refKey,
                maxStamp,
            };
            return;
        }
        const cond = rule.conditions[idx];
        const candidates = this.wm.all(cond.cls).sort((a, b) => b._stamp - a._stamp);
        if (cond.negated) {
            let any = false;
            for (const w of candidates) {
                const scratch = { ...bindings };
                if (this._testWme(cond, w, scratch)) { any = true; break; }
            }
            if (!any) {
                matched.push(null);
                yield* this._matchFrom(rule, idx + 1, matched, bindings);
                matched.pop();
            }
            return;
        }
        for (const w of candidates) {
            const savedKeys = Object.keys(bindings);
            if (this._testWme(cond, w, bindings)) {
                matched.push(w);
                yield* this._matchFrom(rule, idx + 1, matched, bindings);
                matched.pop();
            }
            for (const k of Object.keys(bindings)) {
                if (!savedKeys.includes(k)) delete bindings[k];
            }
        }
    }

    _testWme(cond, wme, bindings) {
        if (cond.isPositional) {
            const tokens = wme.tokens || [];
            if (cond.prefixLength != null && tokens.length < cond.prefixLength) return false;
        }
        for (const t of cond.tests) {
            const actual = cond.isPositional
                ? (wme.tokens ? wme.tokens[t.index] : undefined)
                : wme[t.field];
            if (!runTest(t, actual, bindings)) return false;
        }
        return true;
    }
}

// Rule-static. Tests flagged `implicit` are auto-added position constraints
// from the rule generator; they must not influence the MEA specificity tiebreak.
function ruleSpecificity(rule) {
    if (rule._specificity !== undefined) return rule._specificity;
    let n = 0;
    for (const c of rule.conditions) {
        if (!c.tests) continue;
        for (const t of c.tests) if (!t.implicit) n++;
    }
    rule._specificity = n;
    return n;
}

function makeBindings(bindings, matched) {
    const out = { ...bindings };
    for (let i = 0; i < matched.length; i++) {
        out["$" + (i + 1)] = matched[i];
    }
    return out;
}

function cmpKey(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
    }
    return 0;
}

// Conflict resolution mode:
//   "mea"  — original: priority → firstStamp → specificity → rest → source.
//             Starves high-spec x-first rules when a non-x rule matches a
//             fresh WME (the name225 fountain bug). Kept for fallback.
//   "lex"  — experimental OPS4-style LEX variant. Not currently matching
//             binary behavior for all cases.
const RESOLVER = (typeof process !== "undefined" && process.env && process.env.HAUNT_RESOLVER) || "mea";

function compareInst(a, b) {
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (RESOLVER === "mea") {
        if (a.firstStamp !== b.firstStamp) return b.firstStamp - a.firstStamp;
        if (a.specificity !== b.specificity) return b.specificity - a.specificity;
        const len = Math.max(a.rest.length, b.rest.length);
        for (let i = 0; i < len; i++) {
            const x = a.rest[i] ?? 0;
            const y = b.rest[i] ?? 0;
            if (x !== y) return y - x;
        }
        return a.sourceIndex - b.sourceIndex;
    }
    // LEX: sort all matched stamps descending, compare lexicographically.
    const aLex = [a.firstStamp, ...a.rest].sort((x, y) => y - x);
    const bLex = [b.firstStamp, ...b.rest].sort((x, y) => y - x);
    const minLen = Math.min(aLex.length, bLex.length);
    for (let i = 0; i < minLen; i++) {
        if (aLex[i] !== bLex[i]) return bLex[i] - aLex[i];
    }
    if (aLex.length !== bLex.length) return aLex.length - bLex.length;
    if (a.specificity !== b.specificity) return b.specificity - a.specificity;
    return a.sourceIndex - b.sourceIndex;
}

function runTest(t, actual, bindings) {
    switch (t.op) {
        case "eq_const":
            return eqv(actual, t.value);
        case "neq_const":
            return !eqv(actual, t.value);
        case "eq_var": {
            if (t.var in bindings) return eqv(actual, bindings[t.var]);
            bindings[t.var] = actual;
            return true;
        }
        case "neq_var": {
            if (t.var in bindings) return !eqv(actual, bindings[t.var]);
            return true;
        }
        case "in_set":
            return t.set.some(x => eqv(actual, x));
        case "bind_set": {
            if (!t.set.some(x => eqv(actual, x))) return false;
            if (t.var in bindings) return eqv(actual, bindings[t.var]);
            bindings[t.var] = actual;
            return true;
        }
        case "cmp": {
            // Numeric comparison. Value can be a literal or a {var: "x"} ref.
            const a = toNum(actual);
            let b;
            if (t.value && typeof t.value === "object" && "var" in t.value) {
                if (!(t.value.var in bindings)) return false;
                b = toNum(bindings[t.value.var]);
            } else {
                b = toNum(t.value);
            }
            if (a === null || b === null) return false;
            switch (t.cmp) {
                case "<": return a < b;
                case ">": return a > b;
                case "<=": return a <= b;
                case ">=": return a >= b;
                case "==": return a === b;
                default: return false;
            }
        }
        case "any":
            return true;
        default:
            return false;
    }
}

function toNum(v) {
    if (v === undefined || v === null || v === "nil") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

// OPS5 treats an absent/unset field as "nil". So undefined, null, and the
// string "nil" are all equivalent for comparison purposes.
export function eqv(a, b) {
    const an = isNil(a);
    const bn = isNil(b);
    if (an && bn) return true;
    if (an || bn) return false;
    return String(a).toLowerCase() === String(b).toLowerCase();
}

function isNil(v) {
    return v === undefined || v === null || v === "nil";
}
