// Run every test_*.mjs in tests/ plus the walkthrough verification framework.
// Each test is spawned as its own Node subprocess.
//
//   node tests/run-all.mjs            # run everything
//   node tests/run-all.mjs --unit     # skip verify.mjs (unit tests only)

import { readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const unitOnly = process.argv.includes("--unit");

const unitTests = readdirSync(__dirname)
    .filter(f => f.startsWith("test_") && f.endsWith(".mjs"))
    .sort()
    .map(f => ({ name: f, path: resolve(__dirname, f), args: [] }));

const suites = [...unitTests];
if (!unitOnly) {
    suites.push({ name: "verify.mjs", path: resolve(__dirname, "verify.mjs"), args: [] });
}

function run(suite) {
    return new Promise(resolve => {
        const child = spawn(process.execPath, [suite.path, ...suite.args], {
            stdio: "inherit",
        });
        child.on("exit", code => resolve(code ?? 1));
    });
}

const results = [];
for (const suite of suites) {
    console.log(`\n=== ${suite.name} ===`);
    const code = await run(suite);
    results.push({ name: suite.name, code });
}

console.log("\n========================================");
const failed = results.filter(r => r.code !== 0);
for (const r of results) {
    console.log(`${r.code === 0 ? "PASS" : "FAIL"}  ${r.name}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed.`);
process.exit(failed.length > 0 ? 1 : 0);
