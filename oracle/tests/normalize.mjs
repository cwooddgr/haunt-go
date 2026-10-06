export function normalizeJS(raw) {
    let lines = raw.split("\n");
    lines = lines.filter(l =>
        !l.startsWith("> ") &&
        !l.startsWith("[") &&
        !l.match(/^\s+at /)
    );
    return normalizeCommon(lines);
}

export function normalizeOps5(raw) {
    let lines = raw.split("\n");
    lines = lines.map(l => l.trimEnd());
    lines = lines.filter(l => {
        const t = l.trim();
        return (
            !t.match(/^WARNING:/) &&
            !t.match(/^;/) &&
            !t.match(/^Resetting OPS5/) &&
            !t.match(/^Common Lisp OPS5/) &&
            !t.match(/^\*{100,}$/) &&
            !t.match(/^\d+\.\s+NAME/i) &&
            !t.match(/^end\s*--\s*/) &&
            !t.match(/^\d+\s+productions?\s*\(/) &&
            !t.match(/^\d+\s+firings?\s*\(/) &&
            !t.match(/^\d+\s+mean/) &&
            !t.match(/^\d+\s+max/) &&
            !t.match(/^deleting productions/) &&
            !t.match(/^Unhandled/) &&
            !t.match(/^Backtrace/) &&
            !t.match(/^\s*\d+:\s*\(/)
        );
    });
    return normalizeCommon(lines);
}

function normalizeCommon(lines) {
    return lines
        .map(l => l.trimEnd())
        .map(l => l.toLowerCase())
        .map(l => l.replace(/\bnil\b/gi, ""))
        .map(l => l.replace(/\s{2,}/g, " ").trim())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}
