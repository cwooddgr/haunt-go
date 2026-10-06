// CRT terminal: scrollback, typewriter output, inline editable prompt,
// command history, paste sanitation, and readToken/readLine promises.

export class Terminal {
    constructor({ outputEl, promptLineEl, inputEl, screenEl, speed = 120 }) {
        this.outputEl = outputEl;
        this.promptLineEl = promptLineEl;
        this.inputEl = inputEl;
        this.screenEl = screenEl;
        this.speed = speed;

        this.queue = [];
        this.draining = false;
        this.currentLine = null;

        this.history = [];
        this.histIdx = -1;
        this.savedDraft = "";

        this.pendingResolver = null;
        this.pendingMode = null;
        this.promptVisible = false;

        this._linesSinceInput = 0;
        this._morePaused = false;
        this._moreEl = null;
        this._charDebt = 0;
        this._lastDrainT = 0;

        this._bindInput();
    }

    _bindInput() {
        this.inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this._submit();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                this._historyPrev();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                this._historyNext();
            } else if (e.key === "Tab") {
                e.preventDefault();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (this._morePaused) {
                if (e.key !== "Shift" && e.key !== "Control" && e.key !== "Alt" && e.key !== "Meta") {
                    e.preventDefault();
                    this._dismissMore();
                }
                return;
            }
            if (!this.promptVisible) {
                if (this.draining && e.key !== "Shift" && e.key !== "Control" && e.key !== "Alt" && e.key !== "Meta") {
                    this.fastForward();
                }
                return;
            }
            if (document.activeElement !== this.inputEl) {
                this.inputEl.focus();
            }
            if (e.key === "Escape") {
                this.fastForward();
            } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.clearScrollback();
            }
        });

        this.inputEl.addEventListener("paste", (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData("text") || "";
            const cleaned = text
                .replace(/\r/g, "")
                .split("\n")[0]
                .replace(/[^\x20-\x7e]/g, "")
                .replace(/\s+/g, " ")
                .slice(0, 80);
            const el = this.inputEl;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            el.value = el.value.slice(0, start) + cleaned + el.value.slice(end);
            el.selectionStart = el.selectionEnd = start + cleaned.length;
        });

        this.screenEl.addEventListener("touchstart", (e) => {
            if (this._morePaused) {
                e.preventDefault();
                this._dismissMore();
                return;
            }
            if (!this.promptVisible && this.draining) {
                this.fastForward();
                return;
            }
            if (this.promptVisible) {
                setTimeout(() => {
                    this.inputEl.focus();
                }, 50);
            }
        });

        document.addEventListener("click", (e) => {
            if (e.target.closest(".settings")) return;
            if (this.promptVisible) {
                this.inputEl.focus();
            }
        });

        this.inputEl.addEventListener("focus", () => {
            setTimeout(() => this._scrollToBottom(), 300);
        });

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", () => {
                if (this.promptVisible) {
                    this._scrollToBottom();
                }
            });
        }
    }

    _historyPrev() {
        if (this.history.length === 0) return;
        if (this.histIdx === -1) {
            this.savedDraft = this.inputEl.value;
            this.histIdx = this.history.length - 1;
        } else if (this.histIdx > 0) {
            this.histIdx--;
        }
        this.inputEl.value = this.history[this.histIdx];
    }

    _historyNext() {
        if (this.histIdx === -1) return;
        if (this.histIdx < this.history.length - 1) {
            this.histIdx++;
            this.inputEl.value = this.history[this.histIdx];
        } else {
            this.histIdx = -1;
            this.inputEl.value = this.savedDraft;
        }
    }

    _submit() {
        const raw = this.inputEl.value || "";
        const cmd = raw.trim();
        this._freezePrompt(raw);
        this.inputEl.value = "";
        if (cmd && (this.history.length === 0 || this.history[this.history.length - 1] !== cmd)) {
            this.history.push(cmd);
            if (this.history.length > 100) this.history.shift();
        }
        this.histIdx = -1;
        this.savedDraft = "";
        this.hidePrompt();
        this._linesSinceInput = 0;
        const resolver = this.pendingResolver;
        this.pendingResolver = null;
        this.pendingMode = null;
        if (resolver) resolver(cmd);
    }

    _freezePrompt(rawText) {
        const frozen = document.createElement("div");
        frozen.className = "line";
        frozen.textContent = "* " + rawText;
        this.outputEl.appendChild(frozen);
        this._scrollToBottom();
    }

    showPrompt() {
        this.outputEl.appendChild(this.promptLineEl);
        this.promptLineEl.hidden = false;
        this.promptVisible = true;
        this.inputEl.focus();
        this._scrollToBottom();
    }

    hidePrompt() {
        this.promptLineEl.hidden = true;
        this.promptVisible = false;
    }

    async readLine() {
        if (this._runtime) this._runtime.lineBuffer = "";
        await this._flushQueue();
        this.pendingMode = "line";
        this.showPrompt();
        return new Promise((resolve) => { this.pendingResolver = resolve; });
    }

    async readToken() {
        const line = await this.readLine();
        const tok = line.split(/\s+/)[0] || "";
        return tok;
    }

    println(...parts) {
        const text = parts.map(p => p == null ? "" : String(p)).join("");
        this.queue.push({ type: "line", text, _pos: 0 });
        this._startDrain();
    }

    print(text) {
        this.queue.push({ type: "chunk", text: String(text), _pos: 0 });
        this._startDrain();
    }

    blank() {
        this.queue.push({ type: "line", text: "", _pos: 0 });
        this._startDrain();
    }

    clearScrollback() {
        this.outputEl.innerHTML = "";
    }

    fastForward() {
        this.fastMode = true;
    }

    _startDrain() {
        if (!this.draining) {
            this.draining = true;
            this._lastDrainT = 0;
            requestAnimationFrame((t) => this._drain(t));
        }
    }

    _drain(frameT) {
        if (this.queue.length === 0) {
            this.draining = false;
            this.fastMode = false;
            this._charDebt = 0;
            this._lastDrainT = 0;
            if (this._flushResolver) {
                const r = this._flushResolver;
                this._flushResolver = null;
                r();
            }
            return;
        }

        const cps = this.fastMode ? 50000 : this.speed;
        const dt = this._lastDrainT ? frameT - this._lastDrainT : 16;
        this._lastDrainT = frameT;
        this._charDebt += (cps * dt) / 1000;
        let budget = Math.floor(this._charDebt);
        this._charDebt -= budget;

        let wrote = false;
        while (this.queue.length > 0) {
            const item = this.queue[0];
            const remaining = item.text.length - item._pos;

            if (remaining > 0 && budget <= 0) break;

            if (remaining > 0 && !this.currentLine) {
                this.currentLine = document.createElement("div");
                this.currentLine.className = "line";
                this.outputEl.appendChild(this.currentLine);
            }
            const take = Math.min(remaining, budget);
            if (take > 0) {
                this.currentLine.textContent += item.text.slice(item._pos, item._pos + take);
                item._pos += take;
                budget -= take;
                wrote = true;
            }
            if (item._pos >= item.text.length) {
                if (item.type === "line") {
                    this.currentLine = null;
                    this._linesSinceInput++;
                    if (!this.fastMode && this.queue.length > 0 &&
                        this._linesSinceInput >= this._getPageSize()) {
                        this.queue.shift();
                        this._showMore();
                        return;
                    }
                }
                this.queue.shift();
            } else {
                break;
            }
        }

        if (wrote) this._scrollToBottom();
        requestAnimationFrame((t) => this._drain(t));
    }

    _flushQueue() {
        if (this.queue.length === 0 && !this.draining) return Promise.resolve();
        return new Promise((resolve) => {
            this._flushResolver = resolve;
        });
    }

    _scrollToBottom() {
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    setSpeed(cps) {
        this.speed = cps;
    }

    _getPageSize() {
        const el = this.outputEl;
        if (!el) return 24;
        const style = getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize) || 22;
        const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.18;
        const padTop = parseFloat(style.paddingTop) || 0;
        const padBottom = parseFloat(style.paddingBottom) || 0;
        const visible = el.clientHeight - padTop - padBottom;
        return Math.max(6, Math.floor(visible / lineHeight) - 1);
    }

    _showMore() {
        this._morePaused = true;
        this._moreEl = document.createElement("div");
        this._moreEl.className = "line more-prompt";
        this._moreEl.textContent = "[more]";
        this.outputEl.appendChild(this._moreEl);
        this._scrollToBottom();
    }

    _dismissMore() {
        this._morePaused = false;
        this._linesSinceInput = 0;
        this._lastDrainT = 0;
        this._charDebt = 0;
        if (this._moreEl) {
            this._moreEl.remove();
            this._moreEl = null;
        }
        if (this.queue.length > 0) {
            requestAnimationFrame((t) => this._drain(t));
        } else {
            this.draining = false;
            this.fastMode = false;
            if (this._flushResolver) {
                const r = this._flushResolver;
                this._flushResolver = null;
                r();
            }
        }
    }
}
