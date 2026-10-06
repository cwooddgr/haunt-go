#!/usr/bin/env node
// transpile.mjs — translate Scalo's Haunt JS modules (js/rules.generated.js,
// js/game.js) into Go that runs on internal/js + internal/engine.
//
// Usage: node transpile.mjs <input.js> <output.go> [--skip name,name] [--prefix p]
//
// It handles the JavaScript subset those files use and fails loudly on any
// node type it does not know, so nothing is silently dropped. Every value
// is a js.Value; operators go through the js package so JS semantics (==,
// truthiness, + on strings, undefined vs null) carry over exactly.

import { readFileSync, writeFileSync } from "node:fs";
import * as acorn from "acorn";

const args = process.argv.slice(2);
const inPath = args[0], outPath = args[1];
let skip = new Set(), prefix = "";
for (let i = 2; i < args.length; i++) {
    if (args[i] === "--skip") skip = new Set(args[++i].split(","));
    else if (args[i] === "--prefix") prefix = args[++i];
}

const src = readFileSync(inPath, "utf8");
const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module", allowAwaitOutsideFunction: true, locations: true });

function fail(node, msg) {
    const loc = node && node.loc ? `${inPath}:${node.loc.start.line}:${node.loc.start.column}` : inPath;
    throw new Error(`${loc}: ${msg}`);
}

// ---------------------------------------------------------------------------
// Names and scopes

const GO_GLOBAL_FUNCS = {
    String: "js.String", Number: "js.Number", Boolean: "js.Boolean",
    parseInt: "js.ParseInt", isNaN: "js.IsNaN",
};
const GO_NAMESPACED = {
    "Math.floor": "js.MathFloor", "Math.ceil": "js.MathCeil", "Math.abs": "js.MathAbs",
    "Math.min": "js.MathMin", "Math.max": "js.MathMax", "Math.round": "js.MathRound",
    "Object.keys": "js.ObjectKeys", "Object.values": "js.ObjectValues",
    "Object.entries": "js.ObjectEntries", "Object.assign": "js.ObjectAssign",
    "Array.from": "js.ArrayFrom", "Array.isArray": "js.ArrayIsArray",
    "console.log": "js.ConsoleLog", "console.error": "js.ConsoleLog", "console.warn": "js.ConsoleLog",
};
const GO_GLOBAL_VALUES = {
    window: "Window", localStorage: "LocalStorage",
    undefined: "js.Value(nil)", NaN: "js.Value(math.NaN())", Infinity: "js.Value(math.Inf(1))",
};

const goSafe = n => n.replace(/\$/g, "S_");

let tmpN = 0;
const tmp = (p = "t") => `${p}${++tmpN}`;

class Scope {
    constructor(parent) { this.parent = parent; this.names = new Map(); }
    declare(name, kind = "local") {
        const go = kind === "modfunc" ? `${prefix}f_${goSafe(name)}`
                 : kind === "modvar" ? `${prefix}g_${goSafe(name)}`
                 : `v_${goSafe(name)}`;
        this.names.set(name, { kind, go });
        return go;
    }
    lookup(name) {
        for (let s = this; s; s = s.parent) if (s.names.has(name)) return s.names.get(name);
        return null;
    }
}

let usesMath = false;

// ---------------------------------------------------------------------------
// Expressions. Each returns { code, kind } where kind is "value" (a
// js.Value) or "bool" (a Go bool).

const V = (code) => ({ code, kind: "value" });
const B = (code) => ({ code, kind: "bool" });
const asValue = (e) => e.kind === "bool" ? `js.Value(${e.code})` : e.code;
const asBool = (e) => e.kind === "bool" ? e.code : `js.Truthy(${e.code})`;

function numLit(n) {
    if (Number.isNaN(n)) { usesMath = true; return "js.Value(math.NaN())"; }
    let s = String(n);
    if (!/[.eE]/.test(s)) s += ".0";
    return `js.Value(float64(${s}))`;
}

function strLit(s) { return JSON.stringify(s); }

function expr(node, sc) {
    switch (node.type) {
        case "Literal": {
            if (node.regex) return V(`js.Value(js.NewRegex(${strLit(node.regex.pattern)}, ${strLit(node.regex.flags)}))`);
            if (node.value === null) return V("js.Null");
            if (typeof node.value === "string") return V(`js.Value(${strLit(node.value)})`);
            if (typeof node.value === "number") return V(numLit(node.value));
            if (typeof node.value === "boolean") return B(String(node.value));
            fail(node, "unknown literal");
        }
        case "Identifier": return V(ident(node, sc));
        case "TemplateLiteral": {
            const parts = [];
            node.quasis.forEach((q, i) => {
                if (q.value.cooked) parts.push(strLit(q.value.cooked));
                if (i < node.expressions.length) parts.push(`js.ToString(${asValue(expr(node.expressions[i], sc))})`);
            });
            return V(`js.Value(${parts.length ? parts.join(" + ") : '""'})`);
        }
        case "ArrayExpression": return V(arrayLit(node.elements, sc));
        case "ObjectExpression": return V(objectLit(node, sc));
        case "ArrowFunctionExpression":
        case "FunctionExpression":
            return V(funcLit(node, sc));
        case "AwaitExpression": return expr(node.argument, sc);
        case "ParenthesizedExpression": return expr(node.expression, sc);
        case "UnaryExpression": return unary(node, sc);
        case "BinaryExpression": return binary(node, sc);
        case "LogicalExpression": {
            const a = asValue(expr(node.left, sc)), b = asValue(expr(node.right, sc));
            const fn = { "&&": "js.And", "||": "js.Or", "??": "js.Nullish" }[node.operator];
            return V(`${fn}(${a}, func() js.Value { return ${b} })`);
        }
        case "ConditionalExpression":
            return V(`js.Cond(${boolExpr(node.test, sc)}, func() js.Value { return ${asValue(expr(node.consequent, sc))} }, func() js.Value { return ${asValue(expr(node.alternate, sc))} })`);
        case "MemberExpression": {
            if (node.optional) return V(chain(node, sc));
            return V(`js.Get(${asValue(expr(node.object, sc))}, ${memberKey(node, sc)})`);
        }
        case "ChainExpression": return V(chain(node.expression, sc));
        case "CallExpression": {
            if (node.optional || hasOptional(node.callee)) return V(chain(node, sc));
            return V(call(node, sc));
        }
        case "NewExpression": {
            const c = node.callee.type === "Identifier" ? node.callee.name : null;
            const a = callArgs(node.arguments, sc);
            if (c === "Set") return V(`js.NewSetFrom(${a})`);
            if (c === "Map") return V(`js.NewMapFrom(${a})`);
            fail(node, "unsupported new " + c);
        }
        case "AssignmentExpression": {
            const t = tmp();
            return V(`func() js.Value { ${t} := ${assignValue(node, sc)}; ${assignTo(node.left, t, sc)}; return ${t} }()`);
        }
        case "UpdateExpression": {
            const t = tmp();
            const cur = asValue(expr(node.argument, sc));
            const delta = node.operator === "++" ? "+ 1" : "- 1";
            const ret = node.prefix ? `js.Value(js.ToNumber(${t}) ${delta})` : `js.Value(js.ToNumber(${t}))`;
            return V(`func() js.Value { ${t} := ${cur}; ${assignTo(node.argument, `js.Value(js.ToNumber(${t}) ${delta})`, sc)}; return ${ret} }()`);
        }
        case "SequenceExpression": {
            const parts = node.expressions.map(e => asValue(expr(e, sc)));
            const last = parts.pop();
            return V(`func() js.Value { ${parts.map(p => `_ = ${p}`).join("; ")}; return ${last} }()`);
        }
        default:
            fail(node, "unsupported expression " + node.type);
    }
}

function boolExpr(node, sc) { return asBool(expr(node, sc)); }

function ident(node, sc) {
    const name = node.name;
    const r = sc.lookup(name);
    if (r) {
        if (r.kind === "modfunc") return `js.Value(js.Func(${r.go}))`;
        return r.go;
    }
    if (name in GO_GLOBAL_VALUES) {
        if (name === "NaN" || name === "Infinity") usesMath = true;
        return GO_GLOBAL_VALUES[name];
    }
    if (name in GO_GLOBAL_FUNCS) return `js.Value(js.Func(${GO_GLOBAL_FUNCS[name]}))`;
    fail(node, "unresolved identifier " + name);
}

function memberKey(node, sc) {
    if (node.computed) return asValue(expr(node.property, sc));
    return strLit(node.property.name);
}

function hasOptional(n) {
    while (n) {
        if (n.optional) return true;
        if (n.type === "MemberExpression") n = n.object;
        else if (n.type === "CallExpression") n = n.callee;
        else return false;
    }
    return false;
}

// Optional chains: emit a closure that returns undefined as soon as an
// optional link sees null/undefined, so the rest of the chain is skipped.
function chain(node, sc) {
    const steps = [];
    let n = node;
    while (true) {
        if (n.type === "MemberExpression") { steps.unshift({ kind: "member", node: n }); n = n.object; }
        else if (n.type === "CallExpression" && n.callee.type === "MemberExpression") {
            steps.unshift({ kind: "mcall", node: n }); n = n.callee.object;
        } else if (n.type === "CallExpression") { steps.unshift({ kind: "call", node: n }); n = n.callee; }
        else break;
    }
    const lines = [];
    let cur = tmp();
    lines.push(`${cur} := ${asValue(expr(n, sc))}`);
    for (const st of steps) {
        const nx = tmp();
        if (st.kind === "member") {
            if (st.node.optional) lines.push(`if js.IsNullish(${cur}) { return nil }`);
            lines.push(`${nx} := js.Get(${cur}, ${memberKey(st.node, sc)})`);
        } else if (st.kind === "mcall") {
            const callee = st.node.callee;
            if (callee.optional) lines.push(`if js.IsNullish(${cur}) { return nil }`);
            if (st.node.optional) fail(st.node, "optional method call ?.() unsupported");
            const a = callArgs(st.node.arguments, sc);
            if (callee.computed) lines.push(`${nx} := js.CallF(js.Get(${cur}, ${memberKey(callee, sc)})${a ? ", " + a : ""})`);
            else lines.push(`${nx} := js.Call(${cur}, ${strLit(callee.property.name)}${a ? ", " + a : ""})`);
        } else {
            if (st.node.optional) lines.push(`if js.IsNullish(${cur}) { return nil }`);
            const a = callArgs(st.node.arguments, sc);
            lines.push(`${nx} := js.CallF(${cur}${a ? ", " + a : ""})`);
        }
        cur = nx;
    }
    lines.push(`return ${cur}`);
    return `func() js.Value { ${lines.join("; ")} }()`;
}

function callArgs(list, sc) {
    if (list.some(a => a.type === "SpreadElement")) {
        return `js.Spread(${spreadParts(list, sc)})...`;
    }
    return list.map(a => asValue(expr(a, sc))).join(", ");
}

function spreadParts(list, sc) {
    return list.map(a => a.type === "SpreadElement"
        ? `js.Iter(${asValue(expr(a.argument, sc))})`
        : `[]js.Value{${asValue(expr(a, sc))}}`).join(", ");
}

function call(node, sc) {
    const cal = node.callee;
    const a = callArgs(node.arguments, sc);
    if (cal.type === "Identifier") {
        const r = sc.lookup(cal.name);
        if (r && r.kind === "modfunc") return `${r.go}(${a})`;
        if (!r && cal.name in GO_GLOBAL_FUNCS) return `${GO_GLOBAL_FUNCS[cal.name]}(${a})`;
        return `js.CallF(${ident(cal, sc)}${a ? ", " + a : ""})`;
    }
    if (cal.type === "MemberExpression") {
        if (!cal.computed && cal.object.type === "Identifier" && !sc.lookup(cal.object.name)) {
            const k = cal.object.name + "." + cal.property.name;
            if (k in GO_NAMESPACED) return `${GO_NAMESPACED[k]}(${a})`;
        }
        const obj = asValue(expr(cal.object, sc));
        if (cal.computed) return `js.CallF(js.Get(${obj}, ${memberKey(cal, sc)})${a ? ", " + a : ""})`;
        return `js.Call(${obj}, ${strLit(cal.property.name)}${a ? ", " + a : ""})`;
    }
    return `js.CallF(${asValue(expr(cal, sc))}${a ? ", " + a : ""})`;
}

function unary(node, sc) {
    const op = node.operator;
    if (op === "typeof") {
        if (node.argument.type === "Identifier" && !sc.lookup(node.argument.name) && !(node.argument.name in GO_GLOBAL_VALUES) && !(node.argument.name in GO_GLOBAL_FUNCS)) {
            return V(`js.Value("undefined")`);
        }
        return V(`js.Value(js.Typeof(${asValue(expr(node.argument, sc))}))`);
    }
    if (op === "!") return B(`!${paren(boolExpr(node.argument, sc))}`);
    if (op === "-") return V(`js.Neg(${asValue(expr(node.argument, sc))})`);
    if (op === "+") return V(`js.Pos(${asValue(expr(node.argument, sc))})`);
    if (op === "void") return V(`func() js.Value { _ = ${asValue(expr(node.argument, sc))}; return nil }()`);
    if (op === "delete") {
        const m = node.argument;
        if (m.type !== "MemberExpression") fail(node, "delete of non-member");
        return B(`js.Delete(${asValue(expr(m.object, sc))}, ${memberKey(m, sc)})`);
    }
    fail(node, "unsupported unary " + op);
}

const paren = s => /^[\w.]+(\(.*\))?$/.test(s) ? s : `(${s})`;

function binary(node, sc) {
    const op = node.operator;
    if (op === "in") return B(`js.Has(${asValue(expr(node.right, sc))}, ${asValue(expr(node.left, sc))})`);
    const a = asValue(expr(node.left, sc)), b = asValue(expr(node.right, sc));
    switch (op) {
        case "===": return B(`js.StrictEq(${a}, ${b})`);
        case "!==": return B(`!js.StrictEq(${a}, ${b})`);
        case "==": return B(`js.LooseEq(${a}, ${b})`);
        case "!=": return B(`!js.LooseEq(${a}, ${b})`);
        case "<": return B(`js.Lt(${a}, ${b})`);
        case ">": return B(`js.Gt(${a}, ${b})`);
        case "<=": return B(`js.Le(${a}, ${b})`);
        case ">=": return B(`js.Ge(${a}, ${b})`);
        case "+": return V(`js.Add(${a}, ${b})`);
        case "-": return V(`js.Sub(${a}, ${b})`);
        case "*": return V(`js.Mul(${a}, ${b})`);
        case "/": return V(`js.Div(${a}, ${b})`);
        case "%": return V(`js.Mod(${a}, ${b})`);
    }
    fail(node, "unsupported binary " + op);
}

function arrayLit(elements, sc) {
    if (elements.some(e => e && e.type === "SpreadElement")) {
        return `js.Value(&js.Array{E: js.Spread(${spreadParts(elements, sc)})})`;
    }
    return `js.Value(js.NewArray(${elements.map(e => e ? asValue(expr(e, sc)) : "nil").join(", ")}))`;
}

function propName(p, sc) {
    if (p.computed) return `js.ToString(${asValue(expr(p.key, sc))})`;
    if (p.key.type === "Identifier") return strLit(p.key.name);
    if (p.key.type === "Literal") return strLit(String(p.key.value));
    fail(p, "unsupported property key");
}

function propValue(p, sc) {
    if (p.method || p.kind !== "init") {
        if (p.kind !== "init") fail(p, "getters/setters unsupported");
        return funcLit(p.value, sc);
    }
    return asValue(expr(p.value, sc));
}

function objectLit(node, sc) {
    const simple = node.properties.every(p => p.type === "Property" && !p.computed);
    if (simple) {
        const kv = node.properties.map(p => `${propName(p, sc)}, ${propValue(p, sc)}`);
        return `js.Value(js.NewObject(${kv.join(", ")}))`;
    }
    const o = tmp("o");
    const lines = [`${o} := js.NewObject()`];
    for (const p of node.properties) {
        if (p.type === "SpreadElement") lines.push(`js.ObjectSpread(${o}, ${asValue(expr(p.argument, sc))})`);
        else lines.push(`${o}.SetProp(${propName(p, sc)}, ${propValue(p, sc)})`);
    }
    return `func() js.Value { ${lines.join("; ")}; return ${o} }()`;
}

// ---------------------------------------------------------------------------
// Assignment

function assignValue(node, sc) {
    const rhs = asValue(expr(node.right, sc));
    if (node.operator === "=") return rhs;
    const cur = asValue(expr(node.left, sc));
    switch (node.operator) {
        case "+=": return `js.Add(${cur}, ${rhs})`;
        case "-=": return `js.Sub(${cur}, ${rhs})`;
        case "*=": return `js.Mul(${cur}, ${rhs})`;
        case "||=": return `js.Or(${cur}, func() js.Value { return ${rhs} })`;
        case "??=": return `js.Nullish(${cur}, func() js.Value { return ${rhs} })`;
    }
    fail(node, "unsupported assignment " + node.operator);
}

function assignTo(target, valueCode, sc) {
    if (target.type === "Identifier") {
        const r = sc.lookup(target.name);
        if (!r) fail(target, "assignment to undeclared " + target.name);
        if (r.kind === "modfunc") fail(target, "assignment to function");
        return `${r.go} = ${valueCode}`;
    }
    if (target.type === "MemberExpression") {
        return `js.Put(${asValue(expr(target.object, sc))}, ${memberKey(target, sc)}, ${valueCode})`;
    }
    fail(target, "unsupported assignment target " + target.type);
}

// ---------------------------------------------------------------------------
// Functions

function funcLit(node, sc) {
    if (node.generator) fail(node, "generators unsupported");
    const fsc = new Scope(sc);
    const a = tmp("a");
    const body = [];
    node.params.forEach((p, i) => bindParam(p, i, a, fsc, body));
    if (node.body.type === "BlockStatement") {
        body.push(...block(node.body.body, fsc));
        const last = node.body.body[node.body.body.length - 1];
        if (!last || last.type !== "ReturnStatement") body.push("return nil");
    } else {
        body.push(`return ${asValue(expr(node.body, fsc))}`);
    }
    return `js.Value(js.Func(func(${a} ...js.Value) js.Value {\n${indent(body.join("\n"))}\n}))`;
}

function bindParam(p, i, a, fsc, out) {
    if (p.type === "Identifier") {
        const go = fsc.declare(p.name);
        out.push(`${go} := js.Arg(${a}, ${i})`, `_ = ${go}`);
    } else if (p.type === "AssignmentPattern") {
        bindParam(p.left, i, a, fsc, out);
        const go = fsc.lookup(p.left.name).go;
        out.push(`if ${go} == nil { ${go} = ${asValue(expr(p.right, fsc))} }`);
    } else if (p.type === "RestElement") {
        const go = fsc.declare(p.argument.name);
        out.push(`${go} := js.Value(js.RestArgs(${a}, ${i}))`, `_ = ${go}`);
    } else {
        const t = tmp();
        out.push(`${t} := js.Arg(${a}, ${i})`);
        destructure(p, t, fsc, out);
    }
}

// destructure binds pattern p from Go expression src (a js.Value variable).
function destructure(p, src, sc, out) {
    if (p.type === "Identifier") {
        const go = sc.declare(p.name);
        out.push(`${go} := ${src}`, `_ = ${go}`);
    } else if (p.type === "ArrayPattern") {
        p.elements.forEach((el, i) => {
            if (!el) return;
            if (el.type === "RestElement") {
                const go = sc.declare(el.argument.name);
                out.push(`${go} := js.Call(${src}, "slice", ${numLit(i)})`, `_ = ${go}`);
                return;
            }
            const t = tmp();
            out.push(`${t} := js.Get(${src}, ${numLit(i)})`);
            destructure(el, t, sc, out);
        });
    } else if (p.type === "ObjectPattern") {
        for (const prop of p.properties) {
            if (prop.type === "RestElement") fail(prop, "object rest unsupported");
            const t = tmp();
            out.push(`${t} := js.Get(${src}, ${propName(prop, sc)})`);
            destructure(prop.value, t, sc, out);
        }
    } else if (p.type === "AssignmentPattern") {
        const t = tmp();
        out.push(`${t} := ${src}`, `if ${t} == nil { ${t} = ${asValue(expr(p.right, sc))} }`);
        destructure(p.left, t, sc, out);
    } else fail(p, "unsupported pattern " + p.type);
}

// ---------------------------------------------------------------------------
// Statements

function indent(s) { return s.split("\n").map(l => l ? "\t" + l : l).join("\n"); }

function block(stmts, sc) {
    const out = [];
    // Hoist function declarations within this block.
    for (const s of stmts) {
        if (s.type === "FunctionDeclaration") {
            const go = sc.declare(s.id.name);
            out.push(`var ${go} js.Value`, `_ = ${go}`);
        }
    }
    for (const s of stmts) {
        if (s.type === "FunctionDeclaration") {
            out.push(`${sc.lookup(s.id.name).go} = ${funcLit(s, sc)}`);
            continue;
        }
        out.push(...stmt(s, sc));
    }
    return out;
}

function exprStmt(e, sc) {
    switch (e.type) {
        case "AssignmentExpression":
            return [assignTo(e.left, assignValue(e, sc), sc)];
        case "UpdateExpression": {
            const delta = e.operator === "++" ? "+ 1" : "- 1";
            return [assignTo(e.argument, `js.Value(js.ToNumber(${asValue(expr(e.argument, sc))}) ${delta})`, sc)];
        }
        case "AwaitExpression":
            return exprStmt(e.argument, sc);
        case "CallExpression": {
            const r = expr(e, sc);
            return [r.kind === "value" && r.code.startsWith("js.Value(") ? `_ = ${r.code}` : r.code];
        }
        case "LogicalExpression":
            if (e.operator === "&&") return [`if ${boolExpr(e.left, sc)} {`, indent(exprStmt(e.right, sc).join("\n")), `}`];
            if (e.operator === "||") return [`if !${paren(boolExpr(e.left, sc))} {`, indent(exprStmt(e.right, sc).join("\n")), `}`];
    }
    return [`_ = ${asValue(expr(e, sc))}`];
}

function varDecl(d, sc, out) {
    for (const dec of d.declarations) {
        const init = dec.init ? asValue(expr(dec.init, sc)) : "js.Value(nil)";
        if (dec.id.type === "Identifier") {
            // Declare first so a closure in the initializer can refer to itself.
            const selfRef = dec.init && (dec.init.type === "ArrowFunctionExpression" || dec.init.type === "FunctionExpression");
            if (selfRef) {
                const go = sc.declare(dec.id.name);
                out.push(`var ${go} js.Value`, `_ = ${go}`);
                out.push(`${go} = ${asValue(expr(dec.init, sc))}`);
            } else {
                const go = sc.declare(dec.id.name);
                out.push(`var ${go} js.Value = ${init}`, `_ = ${go}`);
            }
        } else {
            const t = tmp();
            out.push(`${t} := ${init}`);
            destructure(dec.id, t, sc, out);
        }
    }
}

function stmt(s, sc) {
    switch (s.type) {
        case "EmptyStatement": return [];
        case "ExpressionStatement": return exprStmt(s.expression, sc);
        case "VariableDeclaration": { const out = []; varDecl(s, sc, out); return out; }
        case "ReturnStatement": return [s.argument ? `return ${asValue(expr(s.argument, sc))}` : "return nil"];
        case "BlockStatement": return ["{", indent(block(s.body, new Scope(sc)).join("\n")), "}"];
        case "IfStatement": {
            const out = [`if ${boolExpr(s.test, sc)} {`, indent(block(bodyOf(s.consequent), new Scope(sc)).join("\n"))];
            if (s.alternate) {
                if (s.alternate.type === "IfStatement") {
                    const alt = stmt(s.alternate, sc);
                    alt[0] = "} else " + alt[0];
                    out.push(...alt);
                    return out;
                }
                out.push("} else {", indent(block(bodyOf(s.alternate), new Scope(sc)).join("\n")));
            }
            out.push("}");
            return out;
        }
        case "ForStatement": {
            const fsc = new Scope(sc);
            let init = "";
            if (s.init) {
                if (s.init.type === "VariableDeclaration") {
                    if (s.init.declarations.length !== 1 || s.init.declarations[0].id.type !== "Identifier") fail(s, "complex for-init");
                    const d = s.init.declarations[0];
                    const v = d.init ? asValue(expr(d.init, fsc)) : "js.Value(nil)";
                    init = `${fsc.declare(d.id.name)} := js.Value(${v})`;
                } else init = exprStmt(s.init, fsc).join("; ");
            }
            const test = s.test ? boolExpr(s.test, fsc) : "";
            const upd = s.update ? exprStmt(s.update, fsc).join("; ") : "";
            return [`for ${init}; ${test}; ${upd} {`, indent(block(bodyOf(s.body), new Scope(fsc)).join("\n")), "}"];
        }
        case "ForOfStatement": {
            const fsc = new Scope(sc);
            const it = tmp("it");
            const pre = [];
            const left = s.left.type === "VariableDeclaration" ? s.left.declarations[0].id : s.left;
            if (s.left.type !== "VariableDeclaration") fail(s, "for-of over existing var");
            destructure(left, it, fsc, pre);
            return [`for _, ${it} := range js.Iter(${asValue(expr(s.right, sc))}) {`, indent([...pre, ...block(bodyOf(s.body), new Scope(fsc))].join("\n")), "}"];
        }
        case "ForInStatement": {
            const fsc = new Scope(sc);
            const k = tmp("k");
            const pre = [];
            destructure(s.left.declarations[0].id, `js.Value(${k})`, fsc, pre);
            return [`for _, ${k} := range js.OwnKeys(${asValue(expr(s.right, sc))}) {`, indent([...pre, ...block(bodyOf(s.body), new Scope(fsc))].join("\n")), "}"];
        }
        case "WhileStatement":
            return [`for ${boolExpr(s.test, sc)} {`, indent(block(bodyOf(s.body), new Scope(sc)).join("\n")), "}"];
        case "DoWhileStatement":
            return ["for {", indent(block(bodyOf(s.body), new Scope(sc)).join("\n")), `\tif !${paren(boolExpr(s.test, sc))} { break }`, "}"];
        case "BreakStatement": if (s.label) fail(s, "labels"); return ["break"];
        case "ContinueStatement": if (s.label) fail(s, "labels"); return ["continue"];
        case "ThrowStatement": return [`panic(js.Throw(${asValue(expr(s.argument, sc))}))`];
        case "TryStatement": return tryStmt(s, sc);
        case "SwitchStatement": return switchStmt(s, sc);
        case "FunctionDeclaration": {
            const go = sc.declare(s.id.name);
            return [`var ${go} js.Value`, `${go} = ${funcLit(s, sc)}`, `_ = ${go}`];
        }
    }
    fail(s, "unsupported statement " + s.type);
}

function bodyOf(s) { return s.type === "BlockStatement" ? s.body : [s]; }

function switchStmt(s, sc) {
    // JS switch with fallthrough: evaluate the discriminant once, find the
    // first matching case, then run cases from there inside a run-once loop
    // so `break` exits the switch.
    const d = tmp("d"), idx = tmp("i");
    let defIdx = -1;
    s.cases.forEach((c, i) => { if (!c.test) defIdx = i; });
    const out = [];
    out.push(`${d} := ${asValue(expr(s.discriminant, sc))}`, `_ = ${d}`, `${idx} := -1`);
    s.cases.forEach((c, i) => {
        if (!c.test) return;
        out.push(`if ${idx} < 0 && js.StrictEq(${d}, ${asValue(expr(c.test, sc))}) { ${idx} = ${i} }`);
    });
    if (defIdx >= 0) out.push(`if ${idx} < 0 { ${idx} = ${defIdx} }`);
    out.push("for once := true; once; once = false {");
    const csc = new Scope(sc);
    s.cases.forEach((c, i) => {
        out.push(indent(`if ${idx} <= ${i} && ${idx} >= 0 {`));
        out.push(indent(indent(block(c.consequent, csc).join("\n"))));
        out.push(indent("}"));
    });
    out.push("}");
    return out;
}

function tryStmt(s, sc) {
    // try { A } catch (e) { B } finally { C }
    // Emitted as a closure that recovers a panic into the catch body. A
    // `return` inside try/catch is not supported (fail loudly).
    const scan = n => { if (!n || typeof n !== "object") return; if (n.type === "ReturnStatement") fail(n, "return inside try"); if (n.type.endsWith("FunctionExpression") || n.type === "FunctionDeclaration") return; for (const k in n) if (k !== "loc") { const v = n[k]; if (Array.isArray(v)) v.forEach(scan); else if (v && typeof v.type === "string") scan(v); } };
    scan(s.block); if (s.handler) scan(s.handler.body);
    const out = [];
    const body = block(s.block.body, new Scope(sc)).join("\n");
    if (s.handler) {
        const hsc = new Scope(sc);
        const r = tmp("r");
        const pre = [];
        if (s.handler.param) destructure(s.handler.param, `js.Caught(${r})`, hsc, pre);
        const hb = [...pre, ...block(s.handler.body.body, hsc)].join("\n");
        out.push("func() {", indent(`defer func() {\n\tif ${r} := recover(); ${r} != nil {\n${indent(indent(hb))}\n\t}\n}()`), indent(body), "}()");
    } else {
        out.push("func() {", indent(body), "}()");
    }
    if (s.finalizer) out.push(...block(s.finalizer.body, new Scope(sc)));
    return out;
}

// ---------------------------------------------------------------------------
// Module

const modScope = new Scope(null);
const decls = [];       // Go top-level declarations
const initLines = [];   // module-level const initializers, in source order

function topLevel(node) {
    if (node.type === "ImportDeclaration") return;
    if (node.type === "ExportNamedDeclaration") { if (node.declaration) topLevel(node.declaration); return; }
    if (node.type === "FunctionDeclaration") {
        if (skip.has(node.id.name)) return;
        modScope.declare(node.id.name, "modfunc");
        decls.push(node);
        return;
    }
    if (node.type === "VariableDeclaration") {
        for (const d of node.declarations) {
            if (d.id.type !== "Identifier") {
                // Only the `const { X } = await import(...)` lines; skip if listed.
                const names = d.id.properties ? d.id.properties.map(p => p.value.name) : [];
                if (names.length && names.every(n => skip.has(n))) continue;
                fail(d, "top-level destructuring");
            }
            if (skip.has(d.id.name)) continue;
            modScope.declare(d.id.name, "modvar");
            decls.push({ type: "ModVar", decl: d });
        }
        return;
    }
    if (node.type === "ExpressionStatement") fail(node, "top-level expression statement");
    fail(node, "unsupported top-level " + node.type);
}

for (const n of ast.body) topLevel(n);

const out = [];
for (const d of decls) {
    if (d.type === "FunctionDeclaration") {
        const go = modScope.lookup(d.id.name).go;
        const lit = funcLit(d, modScope);
        // funcLit returns js.Value(js.Func(func(aN ...js.Value) js.Value {...}));
        // turn it into a plain Go function declaration.
        const m = /^js\.Value\(js\.Func\(func\((a\d+) \.\.\.js\.Value\) js\.Value \{\n([\s\S]*)\n\}\)\)$/.exec(lit);
        if (!m) fail(d, "internal: funcLit shape");
        out.push(`func ${go}(${m[1]} ...js.Value) js.Value {\n${m[2]}\n}\n`);
    } else {
        const go = modScope.lookup(d.decl.id.name).go;
        out.push(`var ${go} js.Value\n`);
        initLines.push(`${go} = ${d.decl.init ? asValue(expr(d.decl.init, modScope)) : "js.Value(nil)"}`);
    }
}

const header = `// Code generated by tools/transpile from ${inPath.replace(/^.*\/oracle\//, "oracle/")}. DO NOT EDIT.

package game

import (
${usesMath ? '\t"math"\n' : ""}
\t"github.com/cwooddgr/haunt-go/internal/js"
)

`;
const initFn = `// ${prefix}moduleInit runs the module's top-level const initializers in source order.
func ${prefix}moduleInit() {
${indent(initLines.join("\n"))}
}
`;
writeFileSync(outPath, header + out.join("\n") + "\n" + initFn);
console.error(`wrote ${outPath}: ${decls.length} top-level declarations`);
