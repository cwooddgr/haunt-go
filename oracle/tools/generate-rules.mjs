#!/usr/bin/env node
//
// generate-rules.mjs — translate the OPS5 Haunt source into JavaScript rules.
//
// Usage: node tools/generate-rules.mjs
//
// Reads  ../haunt_game_source.txt (relative to this file),
// writes ../js/rules.generated.js
//
// The generated file exports createRules(runtime) which returns an array of
// rule objects consumable by js/engine.js.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC = resolve(__dirname, "../haunt_game_source.txt");
const DST = resolve(__dirname, "../js/rules.generated.js");

// -------------------------------------------------------------------------
// Lexer
// -------------------------------------------------------------------------
//
// Tokens: LPAREN RPAREN LBRACE RBRACE STRING VAR ATTR NUMBER SYMBOL
//         LTLT GTGT NEQ LEQ GEQ LT GT OP
//
// Comments:
//   ;;; and ;  to end of line
//   (comment ...)  also stripped (treated as no-op s-expression at parser level)

function tokenize(src) {
    const tokens = [];
    let i = 0;
    const n = src.length;

    while (i < n) {
        const c = src[i];

        if (c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f" || c === "\v") { i++; continue; }

        if (c === ";") {
            while (i < n && src[i] !== "\n") i++;
            continue;
        }

        if (c === "(") { tokens.push({ t: "LP" }); i++; continue; }
        if (c === ")") { tokens.push({ t: "RP" }); i++; continue; }
        if (c === "{") { tokens.push({ t: "LB" }); i++; continue; }
        if (c === "}") { tokens.push({ t: "RB" }); i++; continue; }

        if (c === "|") {
            i++;
            let s = "";
            while (i < n && src[i] !== "|") { s += src[i]; i++; }
            if (i < n) i++;
            tokens.push({ t: "STR", v: s });
            continue;
        }

        if (c === "<" && src[i + 1] === "<") { tokens.push({ t: "LTLT" }); i += 2; continue; }
        if (c === ">" && src[i + 1] === ">") { tokens.push({ t: "GTGT" }); i += 2; continue; }
        if (c === "<" && src[i + 1] === ">") { tokens.push({ t: "NEQ" }); i += 2; continue; }
        if (c === "<" && src[i + 1] === "=") { tokens.push({ t: "LEQ" }); i += 2; continue; }
        if (c === ">" && src[i + 1] === "=") { tokens.push({ t: "GEQ" }); i += 2; continue; }

        if (c === "<") {
            const m = /^<([A-Za-z_][A-Za-z0-9_]*)>/.exec(src.slice(i));
            if (m) {
                tokens.push({ t: "VAR", v: m[1] });
                i += m[0].length;
                continue;
            }
            tokens.push({ t: "LT" }); i++; continue;
        }
        if (c === ">") { tokens.push({ t: "GT" }); i++; continue; }

        if (c === "^") {
            const m = /^\^([A-Za-z_][A-Za-z0-9_]*)/.exec(src.slice(i));
            if (m) {
                tokens.push({ t: "ATTR", v: m[1] });
                i += m[0].length;
                continue;
            }
            throw new Error("Bad ^ at " + i);
        }

        const numMatch = /^-?\d+(\.\d+)?/.exec(src.slice(i));
        if (numMatch && (c >= "0" && c <= "9" || (c === "-" && /\d/.test(src[i + 1] || "")))) {
            tokens.push({ t: "NUM", v: Number(numMatch[0]) });
            i += numMatch[0].length;
            continue;
        }

        if (c === "'") { tokens.push({ t: "QUOTE" }); i++; continue; }

        // Special-case the rule divider token.
        if (c === "-" && src[i + 1] === "-" && src[i + 2] === ">") {
            tokens.push({ t: "SYM", v: "-->" });
            i += 3;
            continue;
        }

        const symMatch = /^[A-Za-z_0-9\-+*/?!:=.][A-Za-z_0-9\-+*/?!:=.]*/.exec(src.slice(i));
        if (symMatch) {
            tokens.push({ t: "SYM", v: symMatch[0] });
            i += symMatch[0].length;
            continue;
        }

        throw new Error("Unexpected char " + JSON.stringify(c) + " at " + i);
    }

    return tokens;
}

// -------------------------------------------------------------------------
// Parser: tokens -> s-expressions
// -------------------------------------------------------------------------
//
// An s-expression is one of:
//   { type: "list", items: [...]  }
//   { type: "brace", items: [...]  }           -- {a b c}
//   { type: "sym",  value: "..." }
//   { type: "num",  value: 42 }
//   { type: "str",  value: "..." }
//   { type: "var",  value: "x" }               -- <x>
//   { type: "attr", value: "name" }            -- ^name
//   { type: "disj", items: [...] }             -- <<a b c>>
//   { type: "neq"  }                           -- <>   (not-equal comparator)
//   { type: "op",   value: "+"/"-" }
//   { type: "lt"   }                           -- literal <
//   { type: "gt"   }                           -- literal >

function parseAll(tokens) {
    let i = 0;
    const forms = [];

    function parse() {
        if (i >= tokens.length) throw new Error("unexpected end");
        const tok = tokens[i++];
        switch (tok.t) {
            case "LP": {
                const items = [];
                while (i < tokens.length && tokens[i].t !== "RP") {
                    items.push(parse());
                }
                if (i >= tokens.length) throw new Error("missing )");
                i++;
                return { type: "list", items };
            }
            case "LB": {
                const items = [];
                while (i < tokens.length && tokens[i].t !== "RB") {
                    items.push(parse());
                }
                if (i >= tokens.length) throw new Error("missing }");
                i++;
                return { type: "brace", items };
            }
            case "LTLT": {
                const items = [];
                while (i < tokens.length && tokens[i].t !== "GTGT") {
                    items.push(parse());
                }
                if (i >= tokens.length) throw new Error("missing >>");
                i++;
                return { type: "disj", items };
            }
            case "STR": return { type: "str", value: tok.v };
            case "VAR": return { type: "var", value: tok.v };
            case "ATTR": return { type: "attr", value: tok.v };
            case "NUM": return { type: "num", value: tok.v };
            case "SYM": return { type: "sym", value: tok.v };
            case "NEQ": return { type: "neq" };
            case "LEQ": return { type: "sym", value: "<=" };
            case "GEQ": return { type: "sym", value: ">=" };
            case "LT": return { type: "sym", value: "<" };
            case "GT": return { type: "sym", value: ">" };
            case "QUOTE": return { type: "sym", value: "quote" };
            default:
                throw new Error("unexpected token " + tok.t);
        }
    }

    while (i < tokens.length) {
        // top-level negation prefix for conditions is handled in the rule parser,
        // not here, so treat leading symbols/lists as normal forms.
        forms.push(parse());
    }
    return forms;
}

// -------------------------------------------------------------------------
// Semantic pass: walk forms, collect literalize decls, extract rules
// -------------------------------------------------------------------------

const literalized = new Set();
const literalizedFields = new Map();

function sym(x) { return x && x.type === "sym" ? x.value : null; }
function isSym(x, name) {
    return x && x.type === "sym" && x.value.toLowerCase() === name.toLowerCase();
}

function handleLiteralize(form) {
    // (literalize <class> <field>...)
    const items = form.items;
    const cls = sym(items[1]);
    if (!cls) return;
    literalized.add(cls.toLowerCase());
    const fields = [];
    for (let j = 2; j < items.length; j++) {
        const s = sym(items[j]);
        if (s) fields.push(s);
    }
    literalizedFields.set(cls.toLowerCase(), fields);
}

// The source wraps much of the game behind (comment ...) macros which are
// s-expressions but must be treated as no-ops. The `defmacro comment` at the
// top lets them parse without error.

function isCommentForm(form) {
    return form.type === "list" && form.items.length > 0 && isSym(form.items[0], "comment");
}

// -------------------------------------------------------------------------
// Rule extraction
// -------------------------------------------------------------------------
//
// (p <name> <lhs>... --> <rhs>...)
//
// LHS items are condition elements. Each is either:
//   - a list like (object ^name <x> ^place held)  -- positive
//   - a leading `-` sign followed by the condition -- negative
//   - a brace group {<cond>} -- rare, typically for complex tests
//
// In the source, negated conditions are written as `-` immediately followed
// by the condition, often on the same line: `-(input)` -> two tokens `-` and
// `(input)`. Our tokenizer swallows `-` as part of SYM if adjacent, so we
// handle this by inspecting the raw text before tokenization.
//
// Simpler: preprocess source text to replace `-(` with ` NEG (` so the lexer
// emits a dedicated NEG token. Done in the top-level parse.

function splitRule(form) {
    // find "-->" symbol
    const items = form.items;
    let divider = -1;
    for (let j = 2; j < items.length; j++) {
        if (isSym(items[j], "-->")) { divider = j; break; }
    }
    if (divider < 0) return null;
    const name = sym(items[1]);
    const lhs = items.slice(2, divider);
    const rhs = items.slice(divider + 1);
    return { name, lhs, rhs };
}

// --- LHS translation ---------------------------------------------------

function conditionFromList(condForm, negated) {
    const items = condForm.items;
    if (items.length === 0) return null;
    const cls = (sym(items[0]) || "").toLowerCase();
    if (!cls) return null;
    const isLit = literalized.has(cls);

    const tests = [];
    let positionalPrefix = 0;

    if (isLit) {
        const bareCmpOps = new Set(["<", ">", "<=", ">="]);
        let j = 1;
        while (j < items.length) {
            const t = items[j];
            if (t.type === "attr") {
                const field = t.value;
                j++;
                if (j >= items.length) break;
                const nextVal = items[j];
                if (nextVal.type === "sym" && bareCmpOps.has(nextVal.value) && j + 1 < items.length) {
                    const op = nextVal.value;
                    const operand = items[j + 1];
                    const v = operand.type === "num" ? operand.value
                            : operand.type === "var" ? { var: operand.value }
                            : operand.type === "sym" ? (Number(operand.value) || operand.value.toLowerCase())
                            : 0;
                    tests.push({ field, op: "cmp", cmp: op, value: v });
                    j += 2;
                } else {
                    const testsForField = translateFieldValue(items[j], field, "named");
                    for (const x of testsForField) tests.push(x);
                    j++;
                }
            } else {
                j++;
            }
        }
    } else {
        // positional: each element is one slot. slot 0 = class (already consumed),
        // then slots for remaining items.
        let slotIndex = 0;
        for (let j = 1; j < items.length; j++) {
            const t = items[j];
            if (t.type === "attr") {
                // Shouldn't happen for non-literalized, but if it does skip the pair.
                j++;
                continue;
            }
            const testsForSlot = translateFieldValue(t, slotIndex, "positional");
            for (const x of testsForSlot) tests.push(x);
            slotIndex++;
            positionalPrefix = slotIndex;
        }
    }

    return {
        cls,
        isPositional: !isLit,
        prefixLength: !isLit ? positionalPrefix : null,
        negated,
        tests,
    };
}

function translateFieldValue(valForm, fieldOrIndex, kind) {
    // Returns an array of tests (usually 1, but brace groups can produce many).
    const mkField = (extra) => kind === "named"
        ? { field: fieldOrIndex, ...extra }
        : { index: fieldOrIndex, ...extra };

    switch (valForm.type) {
        case "sym":
            return [mkField({ op: "eq_const", value: valForm.value.toLowerCase() })];
        case "num":
            return [mkField({ op: "eq_const", value: valForm.value })];
        case "str":
            return [mkField({ op: "eq_const", value: valForm.value })];
        case "var":
            return [mkField({ op: "eq_var", var: valForm.value })];
        case "disj": {
            const set = valForm.items.map(v => v.type === "num" ? v.value : (sym(v) || "").toLowerCase());
            return [mkField({ op: "in_set", set })];
        }
        case "brace": {
            // Brace groups combine multiple tests on the same field.
            // Supported forms we've seen in Haunt:
            //   {<> X}          not equal to X
            //   {<<a b c>>}     membership test
            //   {<<a b c>> <x>} membership + bind
            //   {< N}           less than N
            //   {< N <v>}       less than N and bind the field value to <v>
            //   {> N <v>}, {<= N}, {>= N}, {= N}
            //   {> A < B}       between (two comparisons, same field)
            //   {<> then <y>}   not equal to "then" and bind to <y>
            const out = [];
            let j = 0;
            const cmpSyms = new Set(["<", ">", "<=", ">=", "="]);
            while (j < valForm.items.length) {
                const el = valForm.items[j];
                if (el.type === "neq") {
                    const next = valForm.items[j + 1];
                    if (next && next.type === "sym") {
                        out.push(mkField({ op: "neq_const", value: next.value.toLowerCase() }));
                    } else if (next && next.type === "num") {
                        out.push(mkField({ op: "neq_const", value: next.value }));
                    } else if (next && next.type === "var") {
                        out.push(mkField({ op: "neq_var", var: next.value }));
                    }
                    j += 2;
                    continue;
                }
                if (el.type === "sym" && cmpSyms.has(el.value)) {
                    const op = el.value === "=" ? "==" : el.value;
                    const vn = valForm.items[j + 1];
                    const v = vn && vn.type === "num" ? vn.value
                            : vn && vn.type === "var" ? { var: vn.value }
                            : vn && vn.type === "sym" ? (Number(vn.value) || vn.value.toLowerCase())
                            : 0;
                    j += 2;
                    out.push(mkField({ op: "cmp", cmp: op, value: v }));
                    continue;
                }
                if (el.type === "disj") {
                    const set = el.items.map(v => v.type === "num" ? v.value : (sym(v) || "").toLowerCase());
                    const next = valForm.items[j + 1];
                    if (next && next.type === "var") {
                        out.push(mkField({ op: "bind_set", set, var: next.value }));
                        j += 2;
                    } else {
                        out.push(mkField({ op: "in_set", set }));
                        j++;
                    }
                    continue;
                }
                if (el.type === "var") {
                    out.push(mkField({ op: "eq_var", var: el.value }));
                    j++;
                    continue;
                }
                if (el.type === "sym") {
                    out.push(mkField({ op: "eq_const", value: el.value.toLowerCase() }));
                    j++;
                    continue;
                }
                if (el.type === "num") {
                    out.push(mkField({ op: "eq_const", value: el.value }));
                    j++;
                    continue;
                }
                j++;
            }
            return out;
        }
        case "neq": {
            // Bare <> means "not nil" — matches any non-null value. Used like `(status ^going <> nil)`.
            const next = null;
            // The next token is consumed by the caller, but since we can't see it here,
            // we return a placeholder and fix up in parent. This path shouldn't normally hit
            // if the field-value is being parsed as a brace group. In practice the
            // source writes `^going <> nil` which our caller sees as two separate items
            // "<>" and "nil"; we don't get here. Leave as any-op.
            return [mkField({ op: "any" })];
        }
        default:
            return [mkField({ op: "any" })];
    }
}

// Special handling: some conditions have an explicit `<> value` pair after
// a plain attribute, like `^going <> nil`. translateFieldValue only handles
// the value AFTER `<>`. We preprocess those cases in conditionFromList.
//
// Patch: rewrite attribute pairs so that `^field <> X` becomes a "neq" test
// on field for value X. We do this by scanning items and assembling pairs
// ourselves instead of relying on translateFieldValue for the value slot.

function conditionFromListV2(condForm, negated) {
    const items = condForm.items;
    if (items.length === 0) return null;
    const cls = (sym(items[0]) || "").toLowerCase();
    if (!cls) return null;
    const isLit = literalized.has(cls);
    const tests = [];
    let positionalPrefix = 0;

    if (isLit) {
        let j = 1;
        while (j < items.length) {
            const t = items[j];
            if (t.type !== "attr") { j++; continue; }
            const field = t.value;
            j++;
            if (j >= items.length) break;
            // peek: `<> value`
            if (items[j].type === "neq") {
                j++;
                const v = items[j++];
                if (!v) break;
                if (v.type === "sym") tests.push({ field, op: "neq_const", value: v.value.toLowerCase() });
                else if (v.type === "num") tests.push({ field, op: "neq_const", value: v.value });
                else if (v.type === "var") tests.push({ field, op: "neq_var", var: v.value });
                continue;
            }
            const valForm = items[j];
            const bareCmpOps = new Set(["<", ">", "<=", ">="]);
            if (valForm.type === "sym" && bareCmpOps.has(valForm.value) && j + 1 < items.length) {
                const op = valForm.value;
                const operand = items[j + 1];
                const v = operand.type === "num" ? operand.value
                        : operand.type === "var" ? { var: operand.value }
                        : operand.type === "sym" ? (Number(operand.value) || operand.value.toLowerCase())
                        : 0;
                tests.push({ field, op: "cmp", cmp: op, value: v });
                j += 2;
            } else {
                j++;
                const ts = translateFieldValue(valForm, field, "named");
                for (const x of ts) tests.push(x);
            }
        }
    } else {
        let slotIndex = 0;
        let j = 1;
        while (j < items.length) {
            const t = items[j];
            if (t.type === "neq") {
                // <> token in positional stream: next item is the value, slot is slotIndex
                j++;
                const v = items[j++];
                if (!v) break;
                if (v.type === "sym") tests.push({ index: slotIndex, op: "neq_const", value: v.value.toLowerCase() });
                else if (v.type === "num") tests.push({ index: slotIndex, op: "neq_const", value: v.value });
                else if (v.type === "var") tests.push({ index: slotIndex, op: "neq_var", var: v.value });
                slotIndex++;
                positionalPrefix = slotIndex;
                continue;
            }
            const ts = translateFieldValue(t, slotIndex, "positional");
            for (const x of ts) tests.push(x);
            slotIndex++;
            positionalPrefix = slotIndex;
            j++;
        }
    }

    return {
        cls,
        isPositional: !isLit,
        prefixLength: !isLit ? positionalPrefix : null,
        negated,
        tests,
    };
}

// --- LHS driver --------------------------------------------------------
//
// The source marks negation with a standalone `-` token immediately before a
// condition. We preprocess the raw text so `-(` becomes ` NEG ` token boundary
// and store negation as its own pseudo-sym.

function translateLHS(lhs) {
    // Keep every condition in place, including (x N) markers. OPS5 MEA uses
    // the x-WME's recency as the tier mechanism: name013 makes x=0..60 in
    // order, so (x 60) has the freshest stamp and rules matching it fire
    // preferentially. We don't collapse (x N) into a static priority.
    const out = [];
    for (let j = 0; j < lhs.length; j++) {
        const el = lhs[j];
        if (isSym(el, "NEG-NEXT")) {
            const next = lhs[j + 1];
            j++;
            if (next && next.type === "list") {
                const cond = conditionFromListV2(next, true);
                if (cond) out.push(cond);
            }
            continue;
        }
        if (el.type === "list") {
            const cond = conditionFromListV2(el, false);
            if (cond) out.push(cond);
        }
    }
    addPositionConstraints(out);
    return { conditions: out, priority: 0, shift: 0 };
}

// The lawn is a grid of ~64 cells sharing ^name lawn and differing only in
// side/east/north. The OPS5 source pairs `(location ^name <x>)` with
// `(object ^place <x>)` without constraining position, so every lawn item
// announces itself from every lawn cell. Tag added tests `implicit: true`
// so the engine excludes them from the specificity tiebreak — preserving
// original MEA conflict resolution.
function addPositionConstraints(conditions) {
    const loc = conditions.find(c =>
        c && !c.negated && c.cls === "location" && !c.isPositional
    );
    if (!loc) return;
    const nameTest = loc.tests.find(t => t.field === "name" && t.op === "eq_var");
    if (!nameTest) return;
    const locVar = nameTest.var;
    const posFields = ["side", "east", "north"];
    const hasField = (cond, f) => cond.tests.some(t => t.field === f);
    if (posFields.some(f => hasField(loc, f))) return;

    const targets = conditions.filter(cond =>
        cond && !cond.negated && !cond.isPositional
        && (cond.cls === "object" || cond.cls === "portal")
        && cond.tests.some(t =>
            t.field === "place" && t.op === "eq_var" && t.var === locVar
        )
    );
    if (targets.length === 0) return;

    const fresh = {
        side: "__pos_side_" + locVar,
        east: "__pos_east_" + locVar,
        north: "__pos_north_" + locVar,
    };
    for (const f of posFields) {
        loc.tests.push({ field: f, op: "eq_var", var: fresh[f], implicit: true });
    }
    for (const cond of targets) {
        for (const f of posFields) {
            if (hasField(cond, f)) continue;
            cond.tests.push({ field: f, op: "eq_var", var: fresh[f], implicit: true });
        }
    }
}

// --- RHS translation ---------------------------------------------------
//
// We emit a JavaScript function body as a string. Bindings come in on `m`,
// matched WMEs are m.$1, m.$2, ... Variables from the LHS are m.<var>.
//
// Generated actions call into the Runtime instance `rt`.

function emitExpr(node, ctx) {
    if (!node) return "null";
    switch (node.type) {
        case "sym":
            if (node.value.toLowerCase() === "nil") return "null";
            return JSON.stringify(node.value.toLowerCase());
        case "num":
            return String(node.value);
        case "str":
            return JSON.stringify(node.value);
        case "var":
            return "m." + safeName(node.value);
        case "list": {
            const items = node.items;
            if (items.length === 0) return "null";
            const head = sym(items[0]);
            if (head === "crlf") return "\"\\n\"";
            if (head === "compute") {
                const a = emitExpr(items[1], ctx);
                const op = sym(items[2]);
                const b = emitExpr(items[3], ctx);
                return "rt.compute(" + a + ", " + JSON.stringify(op) + ", " + b + ")";
            }
            if (head === "substr") {
                const rawIdx = items[1].type === "num" ? items[1].value : 1;
                const wmeIdx = Math.max(1, rawIdx - (ctx.shift || 0));
                const from = items[2].type === "num" ? items[2].value : 2;
                const to = items[3] && items[3].type === "num" ? items[3].value
                    : (items[3] && sym(items[3]) === "inf" ? "inf" : "inf");
                return "rt.substr(m.$" + wmeIdx + ", " + from + ", " + JSON.stringify(to) + ")";
            }
            if (head === "accept") return "(await rt.term.readToken()).toLowerCase()";
            if (head === "acceptline") return "(await rt.term.readLine()).toLowerCase().split(/\\s+/).filter(Boolean)";
            return "null";
        }
        default:
            return "null";
    }
}

function safeName(v) {
    return v.replace(/[^A-Za-z0-9_]/g, "_");
}

// Extract field/value pairs from (make class ^f v ^f v ...) or (modify N ^f v ...)
function extractFieldPairs(items, startIdx) {
    const pairs = [];
    const positionals = [];
    let sawAttr = false;
    let j = startIdx;
    while (j < items.length) {
        const t = items[j];
        if (t.type === "attr") {
            sawAttr = true;
            const field = t.value;
            j++;
            const valItems = [];
            while (j < items.length && items[j].type !== "attr") {
                valItems.push(items[j]);
                j++;
            }
            pairs.push({ field, valItems });
        } else {
            positionals.push(t);
            j++;
        }
    }
    return { pairs, positionals, hadAttrs: sawAttr };
}

function emitValueFromItems(valItems, ctx) {
    // A field value in a make/modify can be:
    //   - a single literal/var: ^name foo  -> "foo"
    //   - multiple tokens: ^contains a b c  -> array?  (rare)
    //   - a computed form: (compute ...) or (substr ...)
    //
    // Handle the common case: one item. Otherwise join tokens.
    if (valItems.length === 0) return "null";
    if (valItems.length === 1) return emitExpr(valItems[0], ctx);
    // Multiple values: make an array joined by spaces? Stringify as space-joined.
    const parts = valItems.map(x => emitExpr(x, ctx));
    return "[" + parts.join(", ") + "]";
}

function emitAction(rhs, ctx) {
    const lines = [];
    for (const form of rhs) {
        if (form.type !== "list") continue;
        const items = form.items;
        const head = sym(items[0]);
        if (!head) continue;
        const h = head.toLowerCase();

        if (h === "write") {
            // (write (crlf) |text| <var> |more|)
            const parts = [];
            for (let j = 1; j < items.length; j++) {
                parts.push(emitExpr(items[j], ctx));
            }
            lines.push("rt.write(" + parts.join(", ") + ");");
            continue;
        }

        if (h === "make") {
            // (make class ^f v ^f v) or (make class tok tok tok)
            const clsNode = items[1];
            const cls = sym(clsNode) || "";
            const { pairs, positionals, hadAttrs } = extractFieldPairs(items, 2);
            if (hadAttrs) {
                const fieldsJs = pairs
                    .map(p => JSON.stringify(p.field) + ": " + emitValueFromItems(p.valItems, ctx))
                    .join(", ");
                lines.push("rt.make(" + JSON.stringify(cls.toLowerCase()) + ", { " + fieldsJs + " });");
            } else {
                // Positional: emit as array. Flatten any substr results so
                // `make input X Y (substr ...)` produces a flat token list.
                const parts = positionals.map(p => emitExpr(p, ctx));
                lines.push("rt.make(" + JSON.stringify(cls.toLowerCase()) + ", [" + parts.join(", ") + "].flat());");
            }
            continue;
        }

        if (h === "modify") {
            const rawN = items[1].type === "num" ? items[1].value : 1;
            const n = Math.max(1, rawN - (ctx.shift || 0));
            const { pairs, positionals, hadAttrs } = extractFieldPairs(items, 2);
            if (hadAttrs) {
                const fieldsJs = pairs
                    .map(p => JSON.stringify(p.field) + ": " + emitValueFromItems(p.valItems, ctx))
                    .join(", ");
                lines.push("rt.modify(m.$" + n + ", { " + fieldsJs + " });");
            } else {
                const parts = positionals.map(p => emitExpr(p, ctx));
                lines.push("rt.modify(m.$" + n + ", [" + parts.join(", ") + "].flat());");
            }
            continue;
        }

        if (h === "remove") {
            const rawN = items[1].type === "num" ? items[1].value : 1;
            const n = Math.max(1, rawN - (ctx.shift || 0));
            lines.push("rt.remove(m.$" + n + ");");
            continue;
        }

        if (h === "halt") {
            lines.push("engine.halt();");
            continue;
        }

        if (h === "bind") {
            // (bind <x> (compute ...))
            const varNode = items[1];
            if (varNode.type === "var") {
                lines.push("m." + safeName(varNode.value) + " = " + emitExpr(items[2], ctx) + ";");
            }
            continue;
        }

        // Unknown action: emit a comment so we notice during audit.
        lines.push("/* TODO unknown action: " + head + " */");
    }
    return lines;
}

// -------------------------------------------------------------------------
// Top-level pipeline
// -------------------------------------------------------------------------

function main() {
    let raw = readFileSync(SRC, "utf8");

    // Drop the defmacro line — it uses backtick/quote/& which we don't parse.
    raw = raw.replace(/\(defmacro[^\n]*\n/g, "\n");
    // Drop the top-level (strategy mea) form — not a production.
    raw = raw.replace(/\(strategy[^)]*\)/g, "");

    // Preprocess: make `-(` into ` NEG-NEXT (` so the lexer/parser treat it
    // as a prefix sentinel. Be careful not to touch inside |...| strings.
    const preprocessed = preprocessNegation(raw);

    const tokens = tokenize(preprocessed);
    const forms = parseAll(tokens);

    // First pass: collect literalize declarations
    for (const f of forms) {
        if (f.type !== "list" || f.items.length === 0) continue;
        if (isSym(f.items[0], "literalize")) {
            handleLiteralize(f);
        }
    }

    // Second pass: extract rules
    const rules = [];
    let ruleIdx = 0;
    for (const f of forms) {
        if (f.type !== "list" || f.items.length === 0) continue;
        if (!isSym(f.items[0], "p")) continue;
        const split = splitRule(f);
        if (!split) continue;
        const { conditions, priority, shift } = translateLHS(split.lhs);
        const actionLines = emitAction(split.rhs, { shift });
        const rulePriority = isLocationDescription(conditions, split.rhs)
            ? priority + 1
            : priority;
        rules.push({
            name: split.name,
            priority: rulePriority,
            sourceIndex: ruleIdx++,
            conditions,
            actionBody: actionLines.join("\n            "),
        });
    }

    // Emit
    const out = renderModule(rules);
    writeFileSync(DST, out, "utf8");
    console.error("Wrote " + rules.length + " rules to " + DST);
    console.error("Literalized classes: " + Array.from(literalized).sort().join(", "));
}

// A "location description" rule emits only (write ...) text and is keyed on
// the player's location without referring to any specific object/portal/input.
// These are the "You are in the foyer." / "You are on the west side" style
// rules. We elevate their priority so they print before item-display rules
// (which also have location as their first condition and tie on MEA recency).
function isLocationDescription(conditions, rhs) {
    const positive = conditions.filter(c => !c.negated);
    if (positive.length === 0 || positive[0].cls !== "location") return false;
    for (const cond of positive.slice(1)) {
        if (cond.cls === "object" || cond.cls === "portal" || cond.cls === "input") {
            return false;
        }
    }
    for (const form of rhs) {
        if (form.type !== "list") continue;
        const head = sym(form.items[0]);
        if (head && head.toLowerCase() !== "write") return false;
    }
    return true;
}

function preprocessNegation(src) {
    // Replace `-(` when `-` is not part of an identifier and not inside a |string|.
    let out = "";
    let i = 0;
    const n = src.length;
    let inStr = false;
    let inLineComment = false;
    while (i < n) {
        const c = src[i];
        if (inLineComment) {
            out += c;
            if (c === "\n") inLineComment = false;
            i++;
            continue;
        }
        if (inStr) {
            out += c;
            if (c === "|") inStr = false;
            i++;
            continue;
        }
        if (c === "|") { inStr = true; out += c; i++; continue; }
        if (c === ";") { inLineComment = true; out += c; i++; continue; }
        if (c === "-") {
            // Check for negation: `-` followed by optional whitespace then `(`.
            const prev = out.length > 0 ? out[out.length - 1] : " ";
            if (prev === " " || prev === "\t" || prev === "\n" || prev === "\r" || prev === "(") {
                let peek = i + 1;
                while (peek < n && (src[peek] === " " || src[peek] === "\t")) peek++;
                if (peek < n && src[peek] === "(") {
                    out += " NEG-NEXT ";
                    i++;
                    continue;
                }
            }
        }
        out += c;
        i++;
    }
    return out;
}

function renderModule(rules) {
    const parts = [];
    parts.push("// AUTO-GENERATED from haunt_game_source.txt by tools/generate-rules.mjs");
    parts.push("// Do not edit by hand.");
    parts.push("");
    parts.push("export function createRules(rt, engine) {");
    parts.push("    return [");
    for (const r of rules) {
        parts.push("        {");
        parts.push("            name: " + JSON.stringify(r.name) + ",");
        parts.push("            priority: " + r.priority + ",");
        parts.push("            sourceIndex: " + r.sourceIndex + ",");
        parts.push("            conditions: " + JSON.stringify(r.conditions) + ",");
        parts.push("            action: async (m, wm, term) => {");
        parts.push("                " + (r.actionBody || ""));
        parts.push("            },");
        parts.push("        },");
    }
    parts.push("    ];");
    parts.push("}");
    parts.push("");
    return parts.join("\n");
}

main();
