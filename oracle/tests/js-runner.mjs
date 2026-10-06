import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runJS(scriptPath) {
    const harnessPath = resolve(__dirname, "harness.mjs");
    return new Promise((res, rej) => {
        const child = spawn("node", [harnessPath, scriptPath], {
            cwd: resolve(__dirname, ".."),
        });
        let stdout = "";
        let stderr = "";
        child.stdout.on("data", d => stdout += d);
        child.stderr.on("data", d => stderr += d);
        child.on("error", rej);
        child.on("close", code => res({ stdout, stderr, exitCode: code }));
    });
}
