import { spawn, execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

export function sbclAvailable() {
    try {
        execFileSync("which", ["sbcl"], { stdio: "pipe" });
        return true;
    } catch {
        return false;
    }
}

export async function runOps5(scriptPath, ops5SourcePath) {
    if (!ops5SourcePath) {
        ops5SourcePath = resolve(PROJECT_ROOT, "ops5", "haunt.ops5");
    }

    const gameCommands = readFileSync(scriptPath, "utf8")
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith("#"))
        .join("\n") + "\nstop\n";

    return new Promise((res, rej) => {
        const child = spawn("sbcl", [
            "--noinform",
            "--non-interactive",
            "--eval", `(load "${resolve(homedir(), "quicklisp", "setup.lisp")}")`,
            "--eval", "(ql:quickload \"ops5\" :silent t)",
            "--eval", "(in-package :ops)",
            "--eval", "(reset-ops)",
            "--eval", `(load "${ops5SourcePath}")`,
            "--eval", "(make start)",
            "--eval", "(run)",
        ], {
            cwd: PROJECT_ROOT,
            timeout: 120000,
        });

        let stdout = "";
        let stderr = "";
        child.stdout.on("data", d => stdout += d);
        child.stderr.on("data", d => stderr += d);
        child.stdin.write(gameCommands);
        child.stdin.end();
        child.on("error", rej);
        child.on("close", code => res({ stdout, stderr, exitCode: code }));
    });
}

function homedir() {
    return process.env.HOME || process.env.USERPROFILE || "/tmp";
}
