import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeJS, normalizeOps5 } from "./normalize.mjs";
import { runJS } from "./js-runner.mjs";
import { runOps5, sbclAvailable } from "./sbcl-runner.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REF_DIR = resolve(__dirname, "reference");

const args = process.argv.slice(2);
const flagCapture = args.includes("--capture");
const flagVerbose = args.includes("--verbose");
const flagScriptIdx = args.indexOf("--script");
const flagScript = flagScriptIdx >= 0 ? args[flagScriptIdx + 1] : null;

const scripts = readdirSync(__dirname)
    .filter(f => f.startsWith("walkthrough_") && f.endsWith(".txt"))
    .sort()
    .filter(f => !flagScript || f.includes(flagScript));

if (scripts.length === 0) {
    console.log("No matching walkthrough scripts found.");
    process.exit(0);
}

const hasSbcl = sbclAvailable();

console.log("Haunt Verification Framework");
console.log("=".repeat(40));
console.log(`SBCL: ${hasSbcl ? "available" : "not found (using reference outputs)"}`);
console.log(`Scripts: ${scripts.length}`);
console.log();

const results = [];

for (const script of scripts) {
    const name = basename(script, ".txt").replace("walkthrough_", "");
    const scriptPath = resolve(__dirname, script);
    process.stdout.write(`Running: ${name} `);

    let jsNorm, ops5Norm, jsRefNorm;

    try {
        const jsResult = await runJS(scriptPath);
        jsNorm = normalizeJS(jsResult.stdout);

        if (flagVerbose) {
            console.log("\n--- JS raw (first 80 lines) ---");
            console.log(jsResult.stdout.split("\n").slice(0, 80).join("\n"));
            console.log("--- JS normalized (first 80 lines) ---");
            console.log(jsNorm.split("\n").slice(0, 80).join("\n"));
        }
    } catch (e) {
        console.log(`ERROR (JS): ${e.message}`);
        results.push({ name, pass: false, error: `JS error: ${e.message}` });
        continue;
    }

    if (hasSbcl) {
        try {
            const ops5Result = await runOps5(scriptPath);
            ops5Norm = normalizeOps5(ops5Result.stdout);

            if (flagVerbose) {
                console.log("\n--- OPS5 raw (first 80 lines) ---");
                console.log(ops5Result.stdout.split("\n").slice(0, 80).join("\n"));
                console.log("--- OPS5 normalized (first 80 lines) ---");
                console.log(ops5Norm.split("\n").slice(0, 80).join("\n"));
            }
        } catch (e) {
            console.log(`ERROR (OPS5): ${e.message}`);
            ops5Norm = null;
        }
    } else {
        const refPath = resolve(REF_DIR, `${name}.ops5.txt`);
        if (existsSync(refPath)) {
            ops5Norm = readFileSync(refPath, "utf8").trim();
        }
    }

    if (flagCapture) {
        if (!existsSync(REF_DIR)) mkdirSync(REF_DIR, { recursive: true });
        writeFileSync(resolve(REF_DIR, `${name}.js.txt`), jsNorm + "\n");
        if (ops5Norm) writeFileSync(resolve(REF_DIR, `${name}.ops5.txt`), ops5Norm + "\n");
    }

    const jsRefPath = resolve(REF_DIR, `${name}.js.txt`);
    if (!existsSync(jsRefPath)) {
        process.stdout.write("SKIP (no JS reference — run with --capture)\n");
        results.push({ name, pass: null, skip: true });
        continue;
    }
    jsRefNorm = readFileSync(jsRefPath, "utf8").trim();

    const regressionDiffs = computeDiff(jsNorm, jsRefNorm);
    const ops5Diffs = ops5Norm ? computeDiff(jsNorm, ops5Norm).length : null;
    const ops5Suffix = ops5Diffs == null ? "" : ` [OPS5 divergence: ${ops5Diffs}]`;

    if (regressionDiffs.length === 0) {
        process.stdout.write(`PASS${ops5Suffix}\n`);
        results.push({ name, pass: true, ops5Diffs });
    } else {
        process.stdout.write(`REGRESSION (${regressionDiffs.length} lines vs. JS reference)${ops5Suffix}\n`);
        results.push({ name, pass: false, diffs: regressionDiffs, ops5Diffs });
    }
}

console.log();

for (const r of results) {
    if (r.diffs && r.diffs.length > 0) {
        console.log(`--- ${r.name} differences (first 20) ---`);
        for (const d of r.diffs.slice(0, 20)) {
            console.log(`  Line ${d.line}:`);
            if (d.contextBefore.length > 0) {
                for (const c of d.contextBefore) console.log(`    ${c}`);
            }
            console.log(`    JS:  ${JSON.stringify(d.js)}`);
            console.log(`    REF: ${JSON.stringify(d.ops5)}`);
        }
        if (r.diffs.length > 20) {
            console.log(`  ... and ${r.diffs.length - 20} more`);
        }
        console.log();
    }
    if (r.error) {
        console.log(`--- ${r.name} error ---`);
        console.log(`  ${r.error}`);
        console.log();
    }
}

const passed = results.filter(r => r.pass === true).length;
const failed = results.filter(r => r.pass === false).length;
const skipped = results.filter(r => r.pass === null).length;
console.log(`Results: ${passed} passed, ${failed} failed, ${skipped} skipped`);
process.exit(failed > 0 ? 1 : 0);

function computeDiff(textA, textB) {
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");
    const diffs = [];
    const maxLen = Math.max(linesA.length, linesB.length);

    for (let i = 0; i < maxLen; i++) {
        const a = linesA[i] ?? "[end]";
        const b = linesB[i] ?? "[end]";
        if (a !== b) {
            diffs.push({
                line: i + 1,
                js: a,
                ops5: b,
                contextBefore: linesA.slice(Math.max(0, i - 2), i),
            });
        }
    }
    return diffs;
}
