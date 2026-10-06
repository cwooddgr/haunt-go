const V = String(Date.now());
const { Terminal } = await import("./terminal.js?v=" + V);
const { playBootSequence } = await import("./bootseq.js?v=" + V);
const { runGame } = await import("./game.js?v=" + V);

const outputEl = document.getElementById("output");
const promptLineEl = document.getElementById("prompt-line");
const inputEl = document.getElementById("input");
const screenEl = document.getElementById("screen");

const savedSpeed = parseInt(localStorage.getItem("haunt:speed") || "120", 10);
const savedTheme = localStorage.getItem("haunt:theme") || "green";
const savedFlicker = localStorage.getItem("haunt:flicker");

document.body.setAttribute("data-theme", savedTheme);
if (savedFlicker === "off") document.body.classList.add("no-flicker");

const term = new Terminal({ outputEl, promptLineEl, inputEl, screenEl, speed: savedSpeed });
window.term = term;

const themeSelect = document.getElementById("theme-select");
const speedSelect = document.getElementById("speed-select");
const flickerToggle = document.getElementById("flicker-toggle");
const gear = document.getElementById("gear");
const menu = document.getElementById("settings-menu");

themeSelect.value = savedTheme;
speedSelect.value = String(savedSpeed);
flickerToggle.checked = savedFlicker !== "off";

gear.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
});
document.addEventListener("click", () => { menu.hidden = true; });
menu.addEventListener("click", (e) => e.stopPropagation());

themeSelect.addEventListener("change", () => {
    document.body.setAttribute("data-theme", themeSelect.value);
    localStorage.setItem("haunt:theme", themeSelect.value);
});
speedSelect.addEventListener("change", () => {
    const v = parseInt(speedSelect.value, 10);
    term.setSpeed(v);
    localStorage.setItem("haunt:speed", String(v));
});
flickerToggle.addEventListener("change", () => {
    document.body.classList.toggle("no-flicker", !flickerToggle.checked);
    localStorage.setItem("haunt:flicker", flickerToggle.checked ? "on" : "off");
});

async function main() {
    await playBootSequence(term);

    const autoRaw = localStorage.getItem("haunt:autosave");
    if (autoRaw) {
        term.println("A previous game was found.");
        term.println("Resume? (y/n)");
        const ans = await term.readToken();
        if (ans.toLowerCase().startsWith("y")) {
            try {
                const snapshot = JSON.parse(autoRaw);
                if (ans.toLowerCase() === "yy" && snapshot.classes && snapshot.classes.time) {
                    for (const t of snapshot.classes.time) {
                        t.realtime = 2200;
                    }
                }
                term.println("Resuming...");
                await runGame(term, { snapshot });
                return;
            } catch (e) {
                term.println("Save corrupted, starting new game.");
            }
        } else {
            localStorage.removeItem("haunt:autosave");
        }
    }

    await runGame(term);
}

main().catch(err => {
    console.error(err);
    term.println("");
    term.println("FATAL: " + (err && err.message ? err.message : String(err)));
});
