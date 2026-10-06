// Tiny dev server that serves the project folder with no caching.
// Usage: node tools/devserver.mjs [port]

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(__filename), "..");
const PORT = Number(process.argv[2]) || 8765;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
    try {
        const url = new URL(req.url, "http://localhost");
        let path = decodeURIComponent(url.pathname);
        if (path.endsWith("/")) path += "index.html";
        const abs = join(ROOT, path);
        if (!abs.startsWith(ROOT)) {
            res.writeHead(403); res.end("forbidden"); return;
        }
        const data = await readFile(abs);
        const mime = MIME[extname(abs)] || "application/octet-stream";
        res.writeHead(200, {
            "Content-Type": mime,
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        });
        res.end(data);
    } catch (e) {
        res.writeHead(404); res.end("not found: " + e.message);
    }
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("haunt dev server @ http://localhost:" + PORT + "/");
});
