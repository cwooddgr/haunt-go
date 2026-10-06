const V = new URL(import.meta.url).search || "";
const { WM, Engine } = await import("./engine.js" + V);
const { Runtime } = await import("./runtime.js" + V);
const { createRules } = await import("./rules.generated.js" + V);

export function patchRules(rt) {
    const nextIdx = 900;
    const findObjectByName = (name) => {
        for (const o of (rt.wm.classes.get("object")?.values() ?? [])) {
            if (o.name === name) return o;
        }
        return null;
    };
    const findPortalByName = (name) => {
        for (const p of (rt.wm.classes.get("portal")?.values() ?? [])) {
            if (p.name === name) return p;
        }
        return null;
    };
    return [
        {
            name: "patch_long_hall_east",
            priority: 0,
            sourceIndex: nextIdx + 30,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "long_hall" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "upper_hall" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_long_hall_west",
            priority: 0,
            sourceIndex: nextIdx + 31,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "long_hall" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "dead_end" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_dead_end_desc",
            priority: 1,
            sourceIndex: nextIdx + 31.1,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dead_end" }] },
            ],
            action: async () => {
                const status = rt.wm.first("status");
                if (status && status.sound === "on") {
                    rt.write("\n", "I can hardly hear myself think.");
                    rt.write("\n", "You now recognize the noise as being an ALICE COOPER GREATEST HITS");
                    rt.write("\n", "ALBUM.");
                }
                rt.write("\n", "You are at a dead end.");
                rt.write("\n", "A wire can be seen along the wall. It is just visible above the carpet.");
            },
        },
        {
            name: "patch_dead_end_east",
            priority: 0,
            sourceIndex: nextIdx + 31.2,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dead_end" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "long_hall" });
                rt.modify(m.$2, { going: null });
            },
        },
        // long_hall → s → bedroom: not in binary (binary says "east-west" only),
        // kept as hidden shortcut for walkthrough compatibility.
        {
            name: "patch_long_hall_south",
            priority: 0,
            sourceIndex: nextIdx + 31.3,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "long_hall" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "bedroom" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_dig_undug",
            priority: 0,
            sourceIndex: nextIdx + 40,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "dig" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "in" },
                      { field: "east", op: "eq_const", value: "8" },
                      { field: "north", op: "eq_const", value: "8" },
                  ] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "grave_status", op: "eq_const", value: "undug" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { grave_status: "dug" });
                rt.write("\n", "Luckily, the dirt is soft.");
            },
        },
        {
            name: "patch_dig_dug",
            priority: 0,
            sourceIndex: nextIdx + 41,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "dig" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "in" },
                      { field: "east", op: "eq_const", value: "8" },
                      { field: "north", op: "eq_const", value: "8" },
                  ] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "grave_status", op: "eq_const", value: "dug" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { grave_status: "deep" });
            },
        },
        {
            name: "patch_pull_lever",
            priority: 0,
            sourceIndex: nextIdx + 42,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "eq_const", value: "pull" },
                      { index: 1, op: "eq_const", value: "lever" },
                  ] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "in" },
                      { field: "east", op: "eq_const", value: "8" },
                      { field: "north", op: "eq_const", value: "8" },
                  ] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "grave_status", op: "eq_const", value: "deep" },
                      { field: "grave_status2", op: "neq_const", value: "oil" },
                  ] },
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "realtime", op: "eq_var", var: "_rt" }] },
                { cls: "fixed", isPositional: true, prefixLength: 0, negated: true, tests: [] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "Ummph!");
                rt.modify(m.$3, { grave_status2: "oil" });
                rt.modify(m.$4, { oil_time: rt.compute(m._rt, "+", 30) });
            },
        },
        {
            name: "patch_enter_truck",
            priority: 0,
            sourceIndex: nextIdx + 50,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "in_set", set: ["mount", "enter"] },
                      { index: 1, op: "any" },
                  ] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "in" },
                      { field: "east", op: "eq_const", value: "7" },
                      { field: "north", op: "eq_const", value: "5" },
                  ] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "truck" },
                      { field: "place", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "in" },
                      { field: "east", op: "eq_const", value: "7" },
                      { field: "north", op: "eq_const", value: "5" },
                  ] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "truck" },
                      { field: "door", op: "eq_const", value: "open" },
                  ] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "score", op: "any" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.modify(m.$2, { name: "intruck", side: null, east: null, north: null });
                rt.write("\n", "You are inside the panel truck.  It is empty.");
            },
        },
        {
            name: "patch_close_truck_door",
            priority: 0,
            sourceIndex: nextIdx + 51,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "close" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "intruck" }] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "truck" },
                      { field: "door", op: "eq_const", value: "open" },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { door: "closed" });
                rt.write("\n", "Ok.");
            },
        },
        {
            name: "patch_truck_escape",
            priority: 0,
            sourceIndex: -1,
            conditions: [
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "truck" },
                      { field: "place", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "in" },
                      { field: "east", op: "eq_const", value: "7" },
                      { field: "north", op: "eq_const", value: "5" },
                  ] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "truck" },
                      { field: "door", op: "eq_const", value: "closed" },
                  ] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "intruck" }] },
                { cls: "return", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_var", var: "_retTime" }] },
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "realtime", op: "eq_var", var: "_retTime" }] },
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_var", var: "_z" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "score", op: "any" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$6);
                rt.remove(m.$4);
                rt.remove(m.$1);
                rt.modify(m.$5, { oil_status: "escaped" });
                rt.write("\n", "VaVoom! The truck has started up.");
                rt.write("\n", "Bump bump! You feel yourself being driven out of the yard.");
                rt.modify(m.$7, { going: "out" });
            },
        },
        {
            name: "patch_balcony_jump_safe",
            priority: 0,
            sourceIndex: nextIdx + 35,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "balcony" }] },
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "jump" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "mattress" },
                      { field: "place", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "in" },
                      { field: "east", op: "eq_const", value: "5" },
                      { field: "north", op: "eq_const", value: "6" },
                  ] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
                rt.modify(m.$1, { name: "lawn", side: "in", east: 5, north: 6 });
                rt.write("\n", "Luckily you land on the mattress.");
            },
        },
        {
            name: "patch_long_hall_desc",
            priority: 1,
            sourceIndex: nextIdx + 32,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "long_hall" }] },
            ],
            action: async (m, wm, term) => {
                const status = rt.wm.first("status");
                if (status && status.sound === "on") {
                    rt.write("\n", "The noise is very loud, it sounds like someone is being flogged with chains!");
                }
                rt.write("\n", "This hall runs east-west.");
            },
        },
        {
            name: "patch_secret_room_exit",
            priority: 0,
            sourceIndex: nextIdx + 33,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "secret_room" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "upper_hall" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_ductf2_desc",
            priority: 1,
            sourceIndex: nextIdx + 33,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ductf2" }] },
            ],
            action: async () => {
                rt.write("\n", "You are in a north-south shaft.");
            },
        },
        {
            name: "patch_ductf2_exit",
            priority: 0,
            sourceIndex: nextIdx + 34,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ductf2" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
            ],
            action: async (m, wm, term) => {
                rt.write("\n", "You tumble out of the ventilation system.");
                rt.modify(m.$1, { name: "kitchen", ontop: "frig" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_wine_cellar_exit",
            priority: 0,
            sourceIndex: nextIdx,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_cellar" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "u" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "secret_stairs" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_dull_room_exit",
            priority: 0,
            sourceIndex: nextIdx + 2,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dull_room" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "upper_hall" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_oil_status",
            priority: 0,
            sourceIndex: nextIdx + 20,
            conditions: [
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "grave_status2", op: "eq_const", value: "oil" }] },
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "oil_status", op: "eq_const", value: "nil" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { oil_status: "oil" });
            },
        },
        {
            name: "patch_oil_enter_marker",
            priority: 0,
            sourceIndex: nextIdx + 21,
            conditions: [
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "oil_status", op: "eq_const", value: "enter" }] },
                { cls: "enter", isPositional: true, prefixLength: 0, negated: true, tests: [] },
            ],
            action: async (m, wm, term) => {
                rt.make("enter", [m.$1.oil_time]);
            },
        },
        {
            name: "patch_oil_walk_marker",
            priority: 0,
            sourceIndex: nextIdx + 22,
            conditions: [
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "oil_status", op: "eq_const", value: "walk" }] },
                { cls: "walk", isPositional: true, prefixLength: 0, negated: true, tests: [] },
            ],
            action: async (m, wm, term) => {
                const old = wm.first("enter");
                if (old) rt.remove(old);
                rt.make("walk", [m.$1.oil_time]);
            },
        },
        {
            name: "patch_oil_fixit_marker",
            priority: 0,
            sourceIndex: nextIdx + 23,
            conditions: [
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "oil_status", op: "eq_const", value: "fixit" }] },
                { cls: "fixit", isPositional: true, prefixLength: 0, negated: true, tests: [] },
            ],
            action: async (m, wm, term) => {
                const old = wm.first("walk");
                if (old) rt.remove(old);
                rt.make("fixit", [m.$1.oil_time]);
            },
        },
        {
            name: "patch_oil_return_marker",
            priority: 0,
            sourceIndex: nextIdx + 24,
            conditions: [
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "oil_status", op: "eq_const", value: "return" }] },
                { cls: "return", isPositional: true, prefixLength: 0, negated: true, tests: [] },
            ],
            action: async (m, wm, term) => {
                const old = wm.first("fixit");
                if (old) rt.remove(old);
                rt.make("return", [m.$1.oil_time]);
            },
        },
        {
            name: "patch_save",
            priority: 0,
            sourceIndex: nextIdx + 10,
            conditions: [
                { cls: "x", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: 30 }] },
                { cls: "input", isPositional: true, prefixLength: 0, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "save" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
                const slot = m.$2.tokens && m.$2.tokens[1] ? m.$2.tokens[1] : "1";
                if (typeof window !== "undefined" && window.__haunt) {
                    const msg = window.__haunt.save(slot);
                    rt.write("\n", msg);
                } else {
                    rt.write("\n", "Save not available.");
                }
            },
        },
        {
            name: "patch_restore",
            priority: 0,
            sourceIndex: nextIdx + 11,
            conditions: [
                { cls: "x", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: 30 }] },
                { cls: "input", isPositional: true, prefixLength: 0, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "restore" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
                const slot = m.$2.tokens && m.$2.tokens[1] ? m.$2.tokens[1] : "1";
                if (typeof window !== "undefined" && window.__haunt) {
                    const msg = window.__haunt.restore(slot);
                    rt.write("\n", msg);
                } else {
                    rt.write("\n", "Restore not available.");
                }
            },
        },
        {
            name: "patch_saves_list",
            priority: 0,
            sourceIndex: nextIdx + 12,
            conditions: [
                { cls: "x", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: 30 }] },
                { cls: "input", isPositional: true, prefixLength: 0, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "saves" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
                if (typeof window === "undefined") {
                    rt.write("\n", "Saves not available.");
                    return;
                }
                let found = false;
                for (let i = 1; i <= 3; i++) {
                    const raw = localStorage.getItem("haunt:save:" + i);
                    if (raw) {
                        found = true;
                        rt.write("\n", "Slot " + i + ": saved");
                    }
                }
                if (!found) rt.write("\n", "No saves found.");
                rt.write("\n", "Use SAVE [1-3] or RESTORE [1-3].");
            },
        },
        {
            name: "patch_look",
            priority: 0,
            sourceIndex: nextIdx + 60,
            conditions: [
                { cls: "x", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: 30 }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_var", var: "_loc" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_var", var: "_loc" }] },
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "look" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
                rt.modify(m.$2, { visited: null });
                rt.modify(m.$3, {});
            },
        },
        // NOTCLOSED-ATN: bare `open` cycles through pool.
        // Priority 0, sourceIndex < name151(157) so pool wins over name151 via source order,
        // but more-specific "open X" rules win via higher specificity.
        // Binary probe: close_open_probe.local.log; binary-gametext 0x029702 area.
        {
            name: "patch_open_notclosed_pool",
            priority: 0,
            sourceIndex: 50,
            conditions: [
                { cls: "x", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: 30 }] },
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "open" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                const hist = rt.wm.first("history");
                const count = (hist && hist.open_pool_count) ? hist.open_pool_count : 0;
                const pool = [
                    "If there is a secret panel near-by, this is not the way to open it.",
                    "There is nothing that is closed.",
                    "You need to have your eyes examined.",
                    "I don't see anything closed.",
                ];
                rt.write("\n", pool[count % pool.length]);
                if (hist) rt.modify(hist, { open_pool_count: count + 1 });
            },
        },
        {
            name: "patch_get_bust",
            priority: 0,
            sourceIndex: -2,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "library" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "eq_const", value: "get" },
                      { index: 1, op: "eq_const", value: "bust" },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
                rt.write("\n", "The bust is too heavy to carry.");
            },
        },
        // hit homer (first time) → "It's going, going, ... gone."
        // hit homer (subsequent) → "Don't press your luck!"
        // Binary probe: homer_probe.local.log lines 210-228.
        {
            name: "patch_hit_homer_first",
            priority: 2,
            sourceIndex: nextIdx + 301,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "library" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["hit", "punch", "strike", "smack"] },
                          { index: 1, op: "in_set", set: ["homer", "bust"] }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "homer_hit", op: "neq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "It's going, going, ... gone.  You just hit a Homer.");
                rt.modify(m.$3, { homer_hit: "t" });
            },
        },
        {
            name: "patch_hit_homer_repeat",
            priority: 2,
            sourceIndex: nextIdx + 302,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "library" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["hit", "punch", "strike", "smack"] },
                          { index: 1, op: "in_set", set: ["homer", "bust"] }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "homer_hit", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "Don't press your luck!  What do you think this is, a baseball game?");
            },
        },
        // push homer pool: "Think!", "The bust stays as it is.", "Keep trying, something might work.", "Nothing happens."
        // Binary probe: bust_probe.local.log lines 200-221.
        {
            name: "patch_push_homer_pool",
            priority: 2,
            sourceIndex: nextIdx + 303,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "library" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["push", "press"] },
                          { index: 1, op: "in_set", set: ["homer", "bust"] }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                const hist = rt.wm.first("history");
                const count = (hist && hist.homer_push_count) ? hist.homer_push_count : 0;
                const pool = [
                    "Think!",
                    "The bust stays as it is.",
                    "Keep trying, something might work.",
                    "Nothing happens.",
                ];
                rt.write("\n", pool[count % pool.length]);
                if (hist) rt.modify(hist, { homer_push_count: count + 1 });
            },
        },
        {
            name: "patch_fill_bathroom",
            priority: 0,
            sourceIndex: -3,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "eq_const", value: "fill" },
                      { index: 1, op: "eq_const", value: "bottle" },
                      { index: 0, op: "eq_var", var: "_fill" },
                      { index: 1, op: "eq_var", var: "_bottle" },
                  ] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "bottle" },
                      { field: "place", op: "eq_const", value: "held" },
                      { field: "name", op: "eq_var", var: "_bname" },
                  ] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "bathroom" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "bathroom" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: true,
                  tests: [{ field: "inside", op: "eq_const", value: "bottle" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.make("object", { name: "bathwater", inside: "bottle" });
                rt.write("\n", "The bottle is full of bathwater.");
            },
        },
        {
            name: "patch_pour_on_lawn",
            priority: 0,
            sourceIndex: -4,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_var", var: "_side" },
                      { field: "east", op: "eq_var", var: "_east" },
                      { field: "north", op: "eq_var", var: "_north" },
                  ] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "bottle" },
                      { field: "place", op: "eq_const", value: "held" },
                  ] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_var", var: "_liquid" },
                      { field: "inside", op: "eq_const", value: "bottle" },
                  ] },
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "pour" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
                rt.modify(m.$3, {
                    inside: null,
                    place: "lawn",
                    side: m._side,
                    east: m._east,
                    north: m._north,
                });
            },
        },
        {
            name: "patch_wine_cellar_desc",
            priority: 1,
            sourceIndex: nextIdx + 3,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_cellar" }] },
            ],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in the wine cellar entrance.");
                rt.write("\n", "A staircase leads up, to the south are racks for wine bottles.");
            },
        },
        {
            name: "patch_get_wine_cellar",
            priority: 2,
            sourceIndex: nextIdx + 3.5,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_cellar" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "get" },
                          { index: 1, op: "eq_const", value: "wine" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "That reminds me, there isn't any wine in sight.");
            },
        },
        {
            name: "patch_get_wine_racks",
            priority: 2,
            sourceIndex: nextIdx + 3.6,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_racks" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "get" },
                          { index: 1, op: "eq_const", value: "wine" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "Have't you noticed? There isn't any wine in the racks.");
            },
        },
        {
            name: "patch_stairs_debris_up",
            priority: 0,
            sourceIndex: nextIdx + 36,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "stairs_debris" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "u" }] },
            ],
            action: async (m, wm, term) => {
                rt.write("\n", "You clamber up the wreckage to the upper hall.");
                rt.modify(m.$1, { name: "upper_hall" });
                rt.modify(m.$2, { going: null });
            },
        },
        // Binary: main_hall first-visit shows stair state.
        {
            name: "patch_main_hall_stairs_whole",
            priority: 0,
            sourceIndex: nextIdx + 36.5,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "main_hall" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "main_hall" },
                          { field: "visited", op: "eq_const", value: "nil" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "stairs" },
                          { field: "state", op: "eq_const", value: "whole" }] },
            ],
            action: async (m) => {
                rt.write("\n", "There are stairs that lead up.");
            },
        },
        {
            // Binary: fires on EVERY main_hall visit when stairs are collapsed.
            name: "patch_main_hall_stairs_collapsed",
            priority: 0,
            sourceIndex: nextIdx + 36.6,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "main_hall" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "main_hall" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "stairs" },
                          { field: "state", op: "eq_const", value: "collapsed" }] },
            ],
            action: async (m) => {
                rt.write("\n", "There is rubble from the stairs to the north.");
            },
        },
        {
            name: "patch_kick_football_lab",
            priority: 2,
            sourceIndex: nextIdx + 72,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "laboratory" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "football" },
                      { field: "place", op: "eq_const", value: "held" },
                  ] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "eq_const", value: "kick" },
                      { index: 1, op: "eq_const", value: "football" },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
                rt.write("\n", "The football goes crashing through the glass dome.");
                rt.modify(m.$2, { place: "lawn", side: "in", east: 7, north: 4 });
                rt.make("object", { name: "dome", state: "broken" });
            },
        },
        {
            name: "patch_get_orchid",
            priority: 2,
            sourceIndex: nextIdx + 74,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "in" },
                      { field: "east", op: "eq_const", value: "3" },
                      { field: "north", op: "eq_const", value: "7" },
                  ] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "orchid" },
                      { field: "state", op: "eq_const", value: "plant" },
                  ] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "eq_const", value: "get" },
                      { index: 1, op: "eq_const", value: "orchid" },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
                rt.modify(m.$2, { place: "held", side: null, east: null, north: null, state: null, treasure: "t" });
                rt.write("\n", "You pick the orchid.");
            },
        },
        {
            name: "patch_dracula_to_lab",
            priority: 0,
            sourceIndex: nextIdx + 73,
            conditions: [
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "dracula" },
                      { field: "place", op: "neq_const", value: "laboratory" },
                  ] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "dome" },
                      { field: "state", op: "eq_const", value: "broken" },
                  ] },
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "morning", op: "eq_const", value: "t" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { place: "laboratory", asleep: null });
            },
        },
        {
            name: "patch_force_morning",
            priority: 0,
            sourceIndex: nextIdx + 71,
            conditions: [
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "realtime", op: "cmp", cmp: ">", value: 2300 },
                      { field: "morning", op: "neq_const", value: "t" },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { morning: "t" });
                rt.write("\n", "'Cock-a-doodle-do'.  You hear a rooster crow.");
            },
        },
        // Midnight moose emergence (probe: moose_midnight.local.log).
        // 12 BONG chimes then: "A moose comes running out of a wall at full
        // speed straight at you!!! He is right on top of you!!! He runs right
        // through you and disappears." One-shot via history.midnight_fired.
        {
            name: "patch_midnight_moose",
            priority: 0,
            sourceIndex: nextIdx + 215,
            conditions: [
                { cls: "time", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "realtime", op: "cmp", cmp: ">=", value: 2400 }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "midnight_fired", op: "neq_const", value: "t" }] },
            ],
            action: async (m, wm, term) => {
                for (let i = 0; i < 12; i++) rt.write("\n", "BONG!");
                rt.write("\n", "A moose comes running out of a wall at full speed straight at you!!!");
                rt.write("\n", "He is right on top of you!!!  He runs right through you and disappears.");
                rt.modify(m.$2, { midnight_fired: "t" });
            },
        },
        {
            name: "patch_spawn_football",
            priority: 0,
            sourceIndex: nextIdx + 70,
            conditions: [
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "football_spawned", op: "neq_const", value: "t" }] },
            ],
            action: async (m, wm, term) => {
                rt.make("object", { name: "football", place: "main_hall", treasure: "t" });
                rt.modify(m.$1, { football_spawned: "t" });
            },
        },
        // smoke marijuana — override for source typo in name250.
        // name250's condition is `^place <> holds` (a typo for `<> held`).
        // With the typo, the rule matches held marijuana (held != holds),
        // stealing from name110/111 via MEA firstStamp (input-first rule
        // beats x-first tie via fresh input WME). Priority-5 patches that
        // replicate name109/110/112 semantics pre-empt name250.
        //   lawn + matches held → light up, set hungry=t (name109)
        //   elsewhere + matches held → "The matches are wet." (name112)
        //   marijuana held, no matches → "You don't have any matches." (name110)
        //   not held → "You don't have any." (name111 fallback, handled below)
        {
            name: "patch_smoke_marijuana_lawn",
            priority: 5,
            sourceIndex: nextIdx + 185,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "smoke" },
                          { index: 1, op: "eq_const", value: "marijuana" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "marijuana" },
                          { field: "place", op: "eq_const", value: "held" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "matches" },
                          { field: "place", op: "eq_const", value: "held" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "hungry", op: "neq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.remove(m.$2);
                rt.remove(m.$3);
                rt.modify(m.$5, { hungry: "t" });
                rt.write("\n", "You manage to light up,");
                rt.write("\n", "the matches haved dried out here, this very expensive stuff.");
                rt.write("\n", "Its very smooth, you begin to think you really don't");
                rt.write("\n", "need to adventure anymore.  You are hungry.");
            },
        },
        {
            name: "patch_smoke_marijuana_wet",
            priority: 5,
            sourceIndex: nextIdx + 186,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "smoke" },
                          { index: 1, op: "eq_const", value: "marijuana" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "marijuana" },
                          { field: "place", op: "eq_const", value: "held" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "matches" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.remove(m.$3);
                rt.write("\n", "The matches are wet.");
            },
        },
        {
            name: "patch_smoke_marijuana_nomatches",
            priority: 5,
            sourceIndex: nextIdx + 187,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "smoke" },
                          { index: 1, op: "eq_const", value: "marijuana" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "marijuana" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You don't have any matches.");
            },
        },
        {
            name: "patch_spawn_stereo",
            priority: 0,
            sourceIndex: nextIdx + 150,
            conditions: [
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "stereo_spawned", op: "neq_const", value: "t" }] },
            ],
            action: async (m, wm, term) => {
                rt.make("object", { name: "stereo", place: "smelly_room", treasure: "t" });
                rt.modify(m.$1, { stereo_spawned: "t" });
            },
        },
        // follow wire — hint verb. The wire runs from dead_end → long_hall →
        // upper_hall → smelly_room. Each location gives a directional hint.
        // Confirmed via binary probes 2026-04-17.
        {
            name: "patch_follow_wire_smelly",
            priority: 2,
            sourceIndex: nextIdx + 182,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "follow" },
                          { index: 1, op: "eq_const", value: "wire" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "smelly_room" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The wire goes behind some wood panel that opens.");
            },
        },
        {
            name: "patch_follow_wire_upper_hall",
            priority: 2,
            sourceIndex: nextIdx + 183,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "follow" },
                          { index: 1, op: "eq_const", value: "wire" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "upper_hall" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The wire goes behind a brick in the stone wall.");
            },
        },
        {
            name: "patch_follow_wire_dead_end",
            priority: 2,
            sourceIndex: nextIdx + 185,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "follow" },
                          { index: 1, op: "eq_const", value: "wire" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dead_end" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The wire goes east.");
            },
        },
        {
            name: "patch_follow_wire_long_hall",
            priority: 2,
            sourceIndex: nextIdx + 186,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "follow" },
                          { index: 1, op: "eq_const", value: "wire" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "long_hall" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The wire goes east.");
            },
        },
        // follow wire fallback — any other location: "The wire is not here."
        {
            name: "patch_follow_wire_else",
            priority: 0,
            sourceIndex: nextIdx + 184,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "follow" },
                          { index: 1, op: "eq_const", value: "wire" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The wire is not here.");
            },
        },
        // Garage at (7,6) — binary-only obstacle not in OPS5 source.
        // Blocks movement onto (7,6) from all three adjacent walkable tiles.
        // Binary probe 2026-04-17: garage_probe.log, garage_geometry.log.
        {
            name: "patch_garage_block_from_east",
            priority: 2,
            sourceIndex: nextIdx + 190,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" },
                          { field: "side", op: "eq_const", value: "in" },
                          { field: "east", op: "eq_const", value: 8 },
                          { field: "north", op: "eq_const", value: 6 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "The garage is in the way.");
            },
        },
        {
            name: "patch_garage_block_from_north",
            priority: 2,
            sourceIndex: nextIdx + 191,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" },
                          { field: "side", op: "eq_const", value: "in" },
                          { field: "east", op: "eq_const", value: 7 },
                          { field: "north", op: "eq_const", value: 7 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "The garage is in the way.");
            },
        },
        {
            name: "patch_garage_block_from_west",
            priority: 2,
            sourceIndex: nextIdx + 192,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" },
                          { field: "side", op: "eq_const", value: "in" },
                          { field: "east", op: "eq_const", value: 6 },
                          { field: "north", op: "eq_const", value: 6 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "The garage is in the way.");
            },
        },
        // Garage description — fires early (priority 2) via general=nil,
        // then refracts so the existing tile description rules fire next.
        {
            name: "patch_garage_desc_8_6",
            priority: 2,
            sourceIndex: nextIdx + 193,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" },
                          { field: "side", op: "eq_const", value: "in" },
                          { field: "east", op: "eq_const", value: 8 },
                          { field: "north", op: "eq_const", value: 6 },
                          { field: "general", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.write("\n", "There is a garage to the west.");
            },
        },
        {
            name: "patch_garage_desc_7_7",
            priority: 2,
            sourceIndex: nextIdx + 194,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" },
                          { field: "side", op: "eq_const", value: "in" },
                          { field: "east", op: "eq_const", value: 7 },
                          { field: "north", op: "eq_const", value: 7 },
                          { field: "general", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.write("\n", "There is a garage to the south.");
            },
        },
        {
            name: "patch_garage_desc_6_6",
            priority: 2,
            sourceIndex: nextIdx + 195,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" },
                          { field: "side", op: "eq_const", value: "in" },
                          { field: "east", op: "eq_const", value: 6 },
                          { field: "north", op: "eq_const", value: 6 },
                          { field: "general", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.write("\n", "There is a garage to the east.");
            },
        },
        // Garage entrance description at driveway tile (7,5).
        {
            name: "patch_garage_desc_7_5",
            priority: 2,
            sourceIndex: nextIdx + 196,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" },
                          { field: "side", op: "eq_const", value: "in" },
                          { field: "east", op: "eq_const", value: 7 },
                          { field: "north", op: "eq_const", value: 5 },
                          { field: "general", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.write("\n", "The entrance to a garage is to the north.");
            },
        },
        // Garage entry: from driveway (7,5) going north.
        {
            name: "patch_garage_enter",
            priority: 2,
            sourceIndex: nextIdx + 197,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" },
                          { field: "side", op: "eq_const", value: "in" },
                          { field: "east", op: "eq_const", value: 7 },
                          { field: "north", op: "eq_const", value: 5 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { name: "garage", side: null, east: null, north: null });
                rt.modify(m.$2, { going: null });
            },
        },
        // Garage room description.
        {
            name: "patch_garage_description",
            priority: 1,
            sourceIndex: nextIdx + 198,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "garage" }] },
            ],
            action: async (m) => {
                rt.write("\n", "You are in an old garage. It opens to the south.");
            },
        },
        // Garage exit: south → driveway (7,5).
        {
            name: "patch_garage_go_south",
            priority: 0,
            sourceIndex: nextIdx + 199,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "garage" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "garage" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { name: "lawn", side: "in", east: 7, north: 5 });
                rt.modify(m.$2, { going: null });
                rt.modify(m.$3, { visited: "t" });
            },
        },
        // Garage blocked exits: N/E/W → wall.
        {
            name: "patch_garage_block_n",
            priority: 0,
            sourceIndex: nextIdx + 200,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "garage" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "in_set", set: ["n", "e", "w"] }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "There is a wall in the way.");
            },
        },
        // Secret room — binary has description + two exits (w → upper_hall,
        // d → secret_stairs via fireman's pole). OPS5 source has none.
        // Binary probe 2026-04-17: upstairs_cluster.log.
        {
            name: "patch_secret_room_description",
            priority: 1,
            sourceIndex: nextIdx + 220,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "secret_room" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "secret_room" },
                          { field: "visited", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.write("\n", "You are in the secret room.");
                rt.write("\n", "You can go out past the wall, or there is a fireman's pole");
                rt.write("\n", "that goes down.");
            },
        },
        {
            name: "patch_secret_room_go_west",
            priority: 0,
            sourceIndex: nextIdx + 221,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "secret_room" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "secret_room" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { name: "upper_hall" });
                rt.modify(m.$2, { going: null });
                rt.modify(m.$3, { visited: "t" });
            },
        },
        {
            name: "patch_secret_room_go_down",
            priority: 0,
            sourceIndex: nextIdx + 222,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "secret_room" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "d" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "secret_room" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { name: "secret_stairs" });
                rt.modify(m.$2, { going: null });
                rt.modify(m.$3, { visited: "t" });
            },
        },
        // Pull wire — binary-global action. Sets status.sound to "off",
        // silencing Alice Cooper. Binary text: "The wire SNAPS! 'Silence!'"
        // Binary probe 2026-04-17: verify_garage_pullwire.log (fires from lawn),
        // upstairs_cluster.log (fires from secret_stairs).
        {
            name: "patch_pull_wire",
            priority: 2,
            sourceIndex: nextIdx + 223,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "pull" },
                          { index: 1, op: "eq_const", value: "wire" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "sound", op: "eq_const", value: "on" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$2, { sound: "off" });
                rt.write("\n", "The wire SNAPS!");
                rt.write("\n", "'Silence!'");
            },
        },
        {
            name: "patch_pull_wire_already_off",
            priority: 1,
            sourceIndex: nextIdx + 224,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "pull" },
                          { index: 1, op: "eq_const", value: "wire" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "sound", op: "neq_const", value: "on" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
            },
        },
        {
            name: "patch_spawn_horn",
            priority: 0,
            sourceIndex: nextIdx + 151,
            conditions: [
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "horn_spawned", op: "neq_const", value: "t" }] },
            ],
            action: async (m, wm, term) => {
                rt.make("object", { name: "horn", place: "dining_room", treasure: "t" });
                rt.modify(m.$1, { horn_spawned: "t" });
            },
        },
        // `stand on stool` → `mount stool`. The generated name197 only
        // handles 2-word "stand on" (drops the object word). This patch
        // catches the full 3-word form and preserves the target.
        {
            name: "patch_stand_on_stool",
            priority: 2,
            sourceIndex: nextIdx + 233,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 3, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "stand" },
                          { index: 1, op: "eq_const", value: "on" },
                          { index: 2, op: "eq_const", value: "stool" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.make("input", ["mount", "stool"]);
            },
        },
        // "get unicorn" in dining_room → "Unicorn is too high to reach."
        // Binary probe 2026-04-17: p1_safe_dracula_unicorn_probe.local.log.
        {
            name: "patch_get_unicorn_too_high",
            priority: 3,
            sourceIndex: nextIdx + 229,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "get" },
                          { index: 1, op: "eq_const", value: "unicorn" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dining_room" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "horn" },
                          { field: "place", op: "eq_const", value: "dining_room" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Unicorn is too high to reach.");
            },
        },
        // Horn stand-on-stool gate — binary requires player to stand on
        // stool in dining_room to reach the horn. Without stool: "I don't
        // know how to get horn". With stool: special pickup text. The horn
        // regenerates visually ("another one appears in its place").
        // Binary probe 2026-04-17: horn_full.log.
        {
            name: "patch_get_horn_blocked",
            priority: 3,
            sourceIndex: nextIdx + 230,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "get" },
                          { index: 1, op: "eq_const", value: "horn" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dining_room" },
                          { field: "siton", op: "neq_const", value: "stool" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "horn" },
                          { field: "place", op: "eq_const", value: "dining_room" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "I don't know how to get horn");
            },
        },
        {
            name: "patch_get_horn_on_stool",
            priority: 3,
            sourceIndex: nextIdx + 231,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "get" },
                          { index: 1, op: "eq_const", value: "horn" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dining_room" },
                          { field: "siton", op: "eq_const", value: "stool" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "horn" },
                          { field: "place", op: "eq_const", value: "dining_room" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { place: "held" });
                rt.write("\n", "When you get the horn, it comes off and another one appears in its place.");
            },
        },
        // `d` from stool — "You are back on Terra Firma." Binary text for
        // stepping off stool (distinct from generic stand-up/dismount).
        {
            name: "patch_stool_step_down",
            priority: 2,
            sourceIndex: nextIdx + 232,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "siton", op: "eq_const", value: "stool" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "d" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { siton: null });
                rt.modify(m.$2, { going: null });
                rt.write("\n", "You are back on Terra Firma.");
            },
        },
        {
            name: "patch_frig_step_down",
            priority: 2,
            sourceIndex: nextIdx + 234,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "ontop", op: "eq_const", value: "frig" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "d" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { ontop: null });
                rt.modify(m.$2, { going: null });
                rt.write("\n", "You are back on Terra Firma.");
            },
        },
        {
            name: "patch_frig_step_up",
            priority: 2,
            sourceIndex: nextIdx + 234.1,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "ontop", op: "eq_const", value: "frig" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "u" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { ontop: null });
                rt.modify(m.$2, { going: null });
                rt.write("\n", "You just fell to the ground.");
            },
        },
        // MAKE LOVE / FUCK REDHEAD at torture_chamber spawns matches.
        // Binary-confirmed via probe (2026-04-16, see matches_probes/):
        // after FREE REDHEAD, both `make love` and `fuck <anyone>`
        // (redhead/woman/girl/damsel/none) fire the identical sequence
        // — matches spawn at torture_chamber, damsel disappears, and a
        // cancer-timer kicks in via name125's status.likes. Two patches
        // below share the action via a helper so either verb works.
        ...(() => {
            const doLoveSequence = async (m, inputWme, damselWme, historyWme) => {
                rt.remove(inputWme);
                rt.modify(damselWme, { alive: null, place: "gone" });
                rt.modify(historyWme, { fuck_redhead_done: "t" });
                const existing = findObjectByName("matches");
                if (existing) {
                    rt.modify(existing, { place: "torture_chamber", side: null, east: null, north: null });
                } else {
                    rt.make("object", { name: "matches", place: "torture_chamber" });
                }
                const loveStatus = rt.wm.first("status");
                const lovePref = (loveStatus && loveStatus.likes) || "none";
                rt.write("\n", "The ", lovePref, " likes you. You make love, talk a little,");
                rt.write("\n", "smoke a cigarette, take a nap, make love, talk,");
                rt.write("\n", "make love, take a nap, make love, etc.");
                rt.write("\n", "You get a gift and then you make love, talk, etc.");
                rt.write("\n", "Finally the ", lovePref, " tells you good bye and turns to smoke and");
                rt.write("\n", "disappears through the cold air return duct, overhead.");
                rt.write("\n", "There are matches here.");
                // Cigarette → cancer clock. name125 (rules.generated.js) fires
                // when time.cancer == realtime. Per casa walkthrough, the
                // player has ~100 moves from fuck to donate; set the deadline
                // at +200 so completions are comfortable but abuse (fucking
                // before freeing the redhead or before the endgame loop) still
                // risks the death. Exact binary timing TODO: probe.
                const time = rt.wm.first("time");
                const status = rt.wm.first("status");
                if (time) {
                    const deadline = (time.realtime || 0) + 200;
                    rt.modify(time, { cancer: deadline });
                }
                if (status && !status.likes) rt.modify(status, { likes: "redhead" });
            };
            const loc = { cls: "location", isPositional: false, prefixLength: null, negated: false,
                tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] };
            const damsel = { cls: "object", isPositional: false, prefixLength: null, negated: false,
                tests: [{ field: "name", op: "eq_const", value: "damsel" },
                        { field: "tied", op: "neq_const", value: "t" },
                        { field: "alive", op: "eq_const", value: "t" }] };
            const hist = { cls: "history", isPositional: false, prefixLength: null, negated: false,
                tests: [{ field: "fuck_redhead_done", op: "neq_const", value: "t" }] };
            return [
                {
                    name: "patch_make_love",
                    priority: 4,
                    sourceIndex: nextIdx + 152,
                    conditions: [
                        { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                          tests: [{ index: 0, op: "eq_const", value: "make" },
                                  { index: 1, op: "eq_const", value: "love" }] },
                        loc, damsel, hist,
                    ],
                    action: async (m) => doLoveSequence(m, m.$1, m.$3, m.$4),
                },
                {
                    name: "patch_fuck_redhead",
                    priority: 4,
                    sourceIndex: nextIdx + 152.5,
                    conditions: [
                        { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                          tests: [{ index: 0, op: "eq_const", value: "fuck" }] },
                        loc, damsel, hist,
                    ],
                    action: async (m) => doLoveSequence(m, m.$1, m.$3, m.$4),
                },
                {
                    name: "patch_fuck_bare",
                    priority: 4,
                    sourceIndex: nextIdx + 152.3,
                    conditions: [
                        { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                          tests: [{ index: 0, op: "eq_const", value: "fuck" }] },
                        loc, damsel, hist,
                    ],
                    action: async (m) => doLoveSequence(m, m.$1, m.$3, m.$4),
                },
            ];
        })(),
        // fuck redhead/none while damsel is tied → punishing death + resurrection.
        {
            name: "patch_fuck_tied_death",
            priority: 5,
            sourceIndex: nextIdx + 152.8,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "fuck" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "damsel" },
                          { field: "tied", op: "eq_const", value: "t" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                const pref = (m.$4 && m.$4.likes) || "none";
                rt.write("\n", "YOU BRUTE!  That was a big mistake.");
                rt.write("\n", "The " + pref + " is not as defenseless as you think,");
                rt.write("\n", "and suddenly you're missing your genitalia, and your life.");
                rt.write("\n", "Well, looks like you're dead.");
                rt.write("\n", "But before the last neuron in your brain was destroyed, a");
                rt.write("\n", "10th level Cleric came by and waved his hand.");
                rt.modify(m.$4, { score: (m.$4.score || 0) - 20, died: "t" });
                rt.modify(m.$2, { name: "foyer", visited: "t" });
            },
        },
        // kiss damsel while still trapped → "Your friend isn't very interested."
        // Binary-confirmed: torture_probe.local.log line 252.
        {
            name: "patch_kiss_damsel_trapped",
            priority: 2,
            sourceIndex: nextIdx + 155,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "kiss" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "damsel" },
                          { field: "tied", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Your friend isn't very interested.");
            },
        },
        // kiss damsel after freed, first time → "You score! Go for it!" + set flag.
        // Binary-confirmed: p1_scored_once_probe local.log.
        {
            name: "patch_kiss_damsel_freed",
            priority: 2,
            sourceIndex: nextIdx + 156,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "kiss" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "damsel" },
                          { field: "alive", op: "eq_const", value: "t" },
                          { field: "tied", op: "neq_const", value: "t" }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "kiss_scored", op: "neq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$4, { kiss_scored: "t" });
                rt.write("\n", "You score!  Go for it!");
            },
        },
        // kiss damsel after freed, subsequent → "You scored once trying this..."
        // Binary-confirmed: p1_scored_once_probe local.log.
        {
            name: "patch_kiss_damsel_scored_once",
            priority: 3,
            sourceIndex: nextIdx + 156.5,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "kiss" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "damsel" },
                          { field: "alive", op: "eq_const", value: "t" },
                          { field: "tied", op: "neq_const", value: "t" }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "kiss_scored", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You scored once trying this, but it looks like");
                rt.write("\n", "some more intimate action (MIA) would be effective.");
            },
        },
        // touch damsel after freed → "That's a start. Your friend is enjoying it."
        // Binary confirmed: same response regardless of likes (tested none+male)
        {
            name: "patch_touch_damsel_freed",
            priority: 2,
            sourceIndex: nextIdx + 157,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["touch", "fondle", "hug"] }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "damsel" },
                          { field: "alive", op: "eq_const", value: "t" },
                          { field: "tied", op: "neq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "That's a start. Your friend is enjoying it.");
            },
        },
        // rape/torture → "You're a nasty one. I won't put up with any S & M, bye!" + game over.
        // Binary: name169 converts `rape X` → `torture X`; bare `rape` also fires same text.
        {
            name: "patch_torture_nasty",
            priority: 2,
            sourceIndex: nextIdx + 157.5,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["torture", "rape"] }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You're a nasty one.  I won't put up with any S & M, bye!");
                rt.modify(m.$2, { quit: "t" });
            },
        },
        ...(() => {
            const noEntrapAction = async (m) => {
                rt.remove(m.$1);
                const status = rt.wm.first("status");
                const pref = (status && status.likes) || "none";
                rt.write("\n", "I don't see an entrapped " + pref + ".");
            };
            const loc = { cls: "location", isPositional: false, prefixLength: null, negated: false,
                tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] };
            const noDamsel = { cls: "object", isPositional: false, prefixLength: null,
                negated: true,
                tests: [{ field: "name", op: "eq_const", value: "damsel" },
                        { field: "alive", op: "eq_const", value: "t" }] };
            return [
                {
                    name: "patch_no_entrapped_single",
                    priority: 2,
                    sourceIndex: nextIdx + 158,
                    conditions: [
                        { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                          tests: [{ index: 0, op: "in_set",
                                    set: ["kiss", "touch", "fuck", "hug", "fondle", "caress"] }] },
                        loc, noDamsel,
                    ],
                    action: noEntrapAction,
                },
                {
                    name: "patch_no_entrapped_make_love",
                    priority: 2,
                    sourceIndex: nextIdx + 158.5,
                    conditions: [
                        { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                          tests: [{ index: 0, op: "eq_const", value: "make" },
                                  { index: 1, op: "eq_const", value: "love" }] },
                        loc, noDamsel,
                    ],
                    action: noEntrapAction,
                },
            ];
        })(),
        // Fallback: matches spawn at front_door (5,4) at game start. Workaround
        // while cheese_room + torture_chamber natively-reached fuck_redhead
        // sequence isn't fully wired (nav rules below now exist but testing
        // pending).
        {
            name: "patch_spawn_matches",
            priority: 0,
            sourceIndex: nextIdx + 153,
            conditions: [
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "matches_spawned", op: "neq_const", value: "t" }] },
            ],
            action: async (m, wm, term) => {
                rt.make("object", { name: "matches", place: "lawn", side: "in", east: 5, north: 4 });
                rt.modify(m.$1, { matches_spawned: "t" });
            },
        },
        // Override broken name2137 — its remove+modify on $1 leaves zombie state.
        {
            name: "patch_wine_racks_e",
            priority: 2,
            sourceIndex: nextIdx + 164,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_racks" },
                          { field: "east", op: "eq_var", var: "e" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                const newEast = (m.e === undefined || m.e === null) ? 1 : m.e + 1;
                rt.modify(m.$1, { east: newEast });
            },
        },
        // wine_cellar → s → wine_racks (enters maze at east=0, north=0).
        {
            name: "patch_wine_cellar_s",
            priority: 2,
            sourceIndex: nextIdx + 165,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_cellar" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "You've lost track of where you came from.");
                rt.modify(m.$1, { name: "wine_racks", east: 0, north: 0 });
            },
        },
        // === Wine racks maze → cheese_room → torture_chamber ===
        // Binary-confirmed via fuck_redhead_matches.local.log. Path from
        // wine_cellar_entrance: s to wine_racks, e×3, n×3 (hits trap door),
        // d (cheese_room with ghost), boo (scares ghost), eat wall (makes
        // west hole), w (torture_chamber with damsel + rope in noose).
        {
            name: "patch_wine_racks_n",
            priority: 0,
            sourceIndex: nextIdx + 170,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_racks" },
                          { field: "north", op: "eq_var", var: "n" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                const newNorth = (m.n === undefined || m.n === null) ? 1 : m.n + 1;
                rt.modify(m.$1, { north: newNorth });
                if (newNorth === 5) {
                    rt.write("\n", "Heh, where are you going, the north pole?");
                } else if (newNorth === 7) {
                    rt.write("\n", "You know, it is possible this thing goes on forever.");
                }
            },
        },
        // At wine_racks east=3, north=0, show Cantor graffiti.
        {
            name: "patch_wine_racks_cantor_graffiti",
            priority: 2,
            sourceIndex: nextIdx + 326,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_racks" },
                          { field: "east", op: "eq_const", value: 3 },
                          { field: "north", op: "eq_const", value: 0 },
                          { field: "general", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.write("\n", "Scrawled on a rack is 'Cantor was here'");
            },
        },
        // At wine_racks east=3, north=3, show trapdoor text as description overlay.
        {
            name: "patch_wine_racks_trapdoor_desc",
            priority: 2,
            sourceIndex: nextIdx + 169,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_racks" },
                          { field: "east", op: "eq_const", value: 3 },
                          { field: "north", op: "eq_const", value: 3 },
                          { field: "general", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.write("\n", "There is a trap door on the floor, stuck open.");
                rt.write("\n", "Written on it is 'Only way out, Cantor'");
            },
        },
        // At wine_racks north >= 3, d reveals trap door → cheese_room.
        {
            name: "patch_wine_racks_d_trapdoor",
            priority: 2,
            sourceIndex: nextIdx + 171,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_racks" },
                          { field: "north", op: "cmp", cmp: ">=", value: 3 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "d" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "cheese_room", east: null, north: null });
            },
        },
        // climb racks → "You can't climb the wine racks."
        {
            name: "patch_wine_racks_climb",
            priority: 2,
            sourceIndex: nextIdx + 171.5,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "climb" },
                          { index: 1, op: "eq_const", value: "racks" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_racks" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You can't climb the wine racks.");
            },
        },
        // move/push racks → "The wine racks don't move."
        {
            name: "patch_wine_racks_move",
            priority: 2,
            sourceIndex: nextIdx + 171.6,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["move", "push"] },
                          { index: 1, op: "eq_const", value: "racks" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wine_racks" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The wine racks don't move.");
            },
        },
        // cheese_room description (first + subsequent visits)
        {
            name: "patch_cheese_room_desc",
            priority: 1,
            sourceIndex: nextIdx + 172,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_room" }] },
            ],
            action: async (m) => {
                const ghost = findObjectByName("ghost");
                rt.write("\n", "This is the cheese room. The only opening is a trap door");
                rt.write("\n", "above, too high to reach. The walls are made of cheese.");
                if (ghost && ghost.place === "cheese_room") {
                    rt.write("\n", "There is a ghost in the room.");
                    rt.write("\n", "Its nose is pink, I believe it has been drinking too much.");
                }
                const wallHole = findObjectByName("cheese_wall");
                if (wallHole && wallHole.state === "holed") {
                    rt.write("\n", "There is a hole in the west wall, with teeth marks around the edges.");
                }
            },
        },
        // Ghost blocks look in cheese_room — binary shows spirit text instead of room desc.
        {
            name: "patch_cheese_room_ghost_look",
            priority: 2,
            sourceIndex: nextIdx + 172.5,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "look" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_room" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ghost" },
                          { field: "place", op: "eq_const", value: "cheese_room" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                if (!rt._ghostIdx) rt._ghostIdx = 0;
                const adj = ["plastered", "potted", "sozzled", "ripped", "bombed",
                    "temulent", "strung out", "inebriated", "crapulous", "wasted"];
                const noun = ["wraith", "fiend", "apparition", "ghoul", "spectre",
                    "spirit", "ghost"];
                const verb = ["stops", "halts", "blocks", "stays", "arrests",
                    "prevents", "stymies"];
                const i = rt._ghostIdx++;
                const a = adj[i % adj.length];
                const n = noun[i % noun.length];
                const v = verb[i % verb.length];
                rt.write("\n", `Although ${a}, the ${n} ${v} your attempt to look`);
            },
        },
        // boo → scares ghost away.
        {
            name: "patch_cheese_room_boo",
            priority: 2,
            sourceIndex: nextIdx + 173,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_room" }] },
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "boo" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ghost" },
                          { field: "place", op: "eq_const", value: "cheese_room" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.modify(m.$3, { place: "gone" });
                rt.write("\n", "The ghost is scared to death and disappears.");
            },
        },
        // eat wall (in cheese_room, ghost gone) → makes west hole.
        {
            name: "patch_cheese_room_eat_wall",
            priority: 2,
            sourceIndex: nextIdx + 174,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_room" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "eat" },
                          { index: 1, op: "eq_const", value: "wall" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                const existingHole = findObjectByName("cheese_wall");
                if (!existingHole) {
                    rt.make("object", { name: "cheese_wall", state: "holed" });
                }
                rt.write("\n", "I really prefer my cheese in smaller pieces,");
                rt.write("\n", "but we can give it a try. CHOMP CHOMP..");
                rt.write("\n", "There is a hole in the west wall, with teeth marks around the edges.");
            },
        },
        // eat cheese in cheese_room → "The only cheese here is the walls."
        {
            name: "patch_cheese_room_eat_cheese",
            priority: 2,
            sourceIndex: nextIdx + 174.5,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_room" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "eat" },
                          { index: 1, op: "eq_const", value: "cheese" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "The only cheese here is the walls.");
            },
        },
        // w in cheese_room with wall holed → torture_chamber.
        {
            name: "patch_cheese_room_w",
            priority: 2,
            sourceIndex: nextIdx + 175,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_room" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_wall" },
                          { field: "state", op: "eq_const", value: "holed" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "torture_chamber" });
            },
        },
        // cheese_room blocked exits — binary probe 2026-04-18: cheese_eat.local.log
        {
            name: "patch_cheese_room_s",
            priority: 2,
            sourceIndex: nextIdx + 175.1,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_room" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "Watch where you're going!");
            },
        },
        {
            name: "patch_cheese_room_n",
            priority: 2,
            sourceIndex: nextIdx + 175.2,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_room" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "Not that way, you don't.");
            },
        },
        {
            name: "patch_cheese_room_e",
            priority: 2,
            sourceIndex: nextIdx + 175.3,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "cheese_room" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "Try another direction.");
            },
        },
        // torture_chamber description
        {
            name: "patch_torture_chamber_desc",
            priority: 1,
            sourceIndex: nextIdx + 176,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
            ],
            action: async (m) => {
                const damsel = findObjectByName("damsel");
                const rope = findObjectByName("rope");
                const status = rt.wm.first("status");
                const pref = (status && status.likes) || "none";
                rt.write("\n", "You are in the torture chamber.");
                rt.write("\n", "A steel door slammed shut when you entered.");
                rt.write("\n", "There are no other doors or windows.");
                if (damsel && damsel.alive === "t") {
                    if (damsel.tied === "t") {
                        rt.write("\n", "There is a good looking ", pref, " entrapped.");
                    } else {
                        rt.write("\n", "There is a sexy looking ", pref, " in here with you.");
                    }
                }
                if (rope && rope.tied === "noose" && rope.place !== "held") {
                    rt.write("\n", "There is rope in a noose here.");
                }
                const grill = findPortalByName("grill");
                if (grill && grill.door === "open") {
                    rt.write("\n", "The grill is open.");
                }
            },
        },
        // free <pref> → untie damsel. Matches "free redhead", "free woman",
        // or whatever the player's sex preference is.
        {
            name: "patch_free_redhead",
            priority: 2,
            sourceIndex: nextIdx + 177,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "free" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "damsel" },
                          { field: "tied", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { tied: null });
                const status = rt.wm.first("status");
                const pref = (status && status.likes) || "none";
                rt.write("\n", "The ", pref, " is free, and gives you a kiss.");
            },
        },
        // get rope in torture_chamber after damsel is freed.
        // Binary: "You now own rope ." (standard name64 pickup).
        // When damsel is still tied, `get rope` falls through to bad-input.
        {
            name: "patch_get_rope_torture",
            priority: 2,
            sourceIndex: nextIdx + 181,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "get" },
                          { index: 1, op: "eq_const", value: "rope" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "rope" },
                          { field: "tied", op: "eq_const", value: "noose" },
                          { field: "place", op: "neq_const", value: "held" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: true,
                  tests: [{ field: "name", op: "eq_const", value: "damsel" },
                          { field: "tied", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { place: "held" });
                rt.write("\n", "You now own rope .");
            },
        },
        // open grill at torture_chamber → grill opens → u to vents.
        {
            name: "patch_torture_open_grill",
            priority: 2,
            sourceIndex: nextIdx + 178,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "open" },
                          { index: 1, op: "eq_const", value: "grill" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "grill" },
                          { field: "door", op: "eq_const", value: "closed" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { door: "open" });
                rt.write("\n", "The grill swings away, leaving enough space for you to enter.");
            },
        },
        // u at torture_chamber with grill closed → blocked.
        {
            name: "patch_torture_u_grill_closed",
            priority: 2,
            sourceIndex: nextIdx + 178.5,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "u" }] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "grill" },
                          { field: "door", op: "eq_const", value: "closed" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "There is a grill over the ventilation duct.");
            },
        },
        // remove grill → hinges keep it on wall, but it opens.
        {
            name: "patch_torture_remove_grill",
            priority: 2,
            sourceIndex: nextIdx + 178.7,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "remove" },
                          { index: 1, op: "eq_const", value: "grill" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "grill" },
                          { field: "door", op: "eq_const", value: "closed" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { door: "open" });
                rt.write("\n", "The hinges of the grill keep it on the wall, but it swings open.");
            },
        },
        // close grill → stuck open (once opened, can't close).
        {
            name: "patch_torture_close_grill",
            priority: 2,
            sourceIndex: nextIdx + 178.6,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "close" },
                          { index: 1, op: "eq_const", value: "grill" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "grill" },
                          { field: "door", op: "eq_const", value: "open" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The grill has become stuck in the open position.");
            },
        },
        // close grill from vent_torture → "stuck open".
        {
            name: "patch_vent_close_grill",
            priority: 2,
            sourceIndex: nextIdx + 178.65,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "close" },
                          { index: 1, op: "eq_const", value: "grill" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "vent_torture" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The grill seems to be stuck open.");
            },
        },
        // u at torture_chamber with grill open → vent system.
        {
            name: "patch_torture_u_vent",
            priority: 2,
            sourceIndex: nextIdx + 179,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "torture_chamber" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "u" }] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "grill" },
                          { field: "door", op: "eq_const", value: "open" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "vent_torture" });
                rt.write("\n", "You're in the ventilation system.");
                rt.write("\n", "You can see down into the torture chamber.");
                rt.write("\n", "The ventilation duct goes off to the west into darkness.");
            },
        },
        // vent_torture → d back to torture_chamber (binary: `d` drops you out).
        {
            name: "patch_vent_torture_d",
            priority: 2,
            sourceIndex: nextIdx + 180,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "vent_torture" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "d" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "torture_chamber" });
                rt.write("\n", "The grill over the duct opens as you tumble out.");
            },
        },
        // === Vent maze: full graph ===
        // Topology: vent_torture → w → ew_shaft → w(x3) → corridor → n(x2) → ns_shaft → small_closet
        // Room descriptions from binary probes.
        {
            name: "patch_vent_torture_w",
            priority: 2,
            sourceIndex: nextIdx + 190,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "vent_torture" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "ew_shaft" });
            },
        },
        {
            name: "patch_ew_shaft_desc",
            priority: 1,
            sourceIndex: nextIdx + 191,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ew_shaft" }] },
            ],
            action: async () => {
                rt.write("\n", "You are in an east-west shaft.");
            },
        },
        {
            name: "patch_ew_shaft_e",
            priority: 2,
            sourceIndex: nextIdx + 192,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ew_shaft" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "vent_torture" });
            },
        },
        {
            name: "patch_ew_shaft_w",
            priority: 2,
            sourceIndex: nextIdx + 193,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ew_shaft" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_ew", east: 0 });
            },
        },
        // e/n/w corridor: 3 rooms (east=0,1,2). Description: "The duct work goes east, north, and west."
        {
            name: "patch_duct_ew_desc",
            priority: 1,
            sourceIndex: nextIdx + 194,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ew" }] },
            ],
            action: async () => {
                rt.write("\n", "The duct work goes east, north, and west.");
            },
        },
        {
            name: "patch_duct_ew_e",
            priority: 2,
            sourceIndex: nextIdx + 195,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ew" },
                          { field: "east", op: "eq_const", value: 0 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "ew_shaft", east: null });
            },
        },
        {
            name: "patch_duct_ew_e_inner",
            priority: 2,
            sourceIndex: nextIdx + 196,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ew" },
                          { field: "east", op: "neq_const", value: 0 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { east: rt.compute(m.$1.east, "-", 1) });
            },
        },
        {
            name: "patch_duct_ew_w",
            priority: 2,
            sourceIndex: nextIdx + 197,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ew" },
                          { field: "east", op: "neq_const", value: 2 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { east: rt.compute(m.$1.east, "+", 1) });
            },
        },
        {
            name: "patch_duct_ew_w_dead_end",
            priority: 2,
            sourceIndex: nextIdx + 198,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ew" },
                          { field: "east", op: "eq_const", value: 2 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_dead_end", east: null });
            },
        },
        // e/n/w north exits: east=0,1 → u/d/w/s junction; east=2 → ns chain to small_closet
        {
            name: "patch_duct_ew_n_junction",
            priority: 2,
            sourceIndex: nextIdx + 199,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ew" },
                          { field: "east", op: "neq_const", value: 2 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_udws", east: null });
            },
        },
        {
            name: "patch_duct_ew_n_chain",
            priority: 2,
            sourceIndex: nextIdx + 200,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ew" },
                          { field: "east", op: "eq_const", value: 2 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_ns", east: null, north: 0 });
            },
        },
        // DEAD END
        {
            name: "patch_duct_dead_end_desc",
            priority: 1,
            sourceIndex: nextIdx + 201,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_dead_end" }] },
            ],
            action: async () => {
                rt.write("\n", "DEAD END!");
            },
        },
        {
            name: "patch_duct_dead_end_e",
            priority: 2,
            sourceIndex: nextIdx + 202,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_dead_end" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_ew", east: 2 });
            },
        },
        // u/d/w/s junction (dead-end side branch)
        {
            name: "patch_duct_udws_desc",
            priority: 1,
            sourceIndex: nextIdx + 203,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_udws" }] },
            ],
            action: async () => {
                rt.write("\n", "The duct work goes up, down, west and south.");
            },
        },
        {
            name: "patch_duct_udws_s",
            priority: 2,
            sourceIndex: nextIdx + 204,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_udws" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_ew", east: 0 });
            },
        },
        {
            name: "patch_duct_udws_w",
            priority: 2,
            sourceIndex: nextIdx + 205,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_udws" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "w" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_ew", east: 0 });
            },
        },
        // e/n/s north chain: 2 rooms (north=0,1) leading to ns_shaft
        {
            name: "patch_duct_ns_desc",
            priority: 1,
            sourceIndex: nextIdx + 206,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ns" }] },
            ],
            action: async () => {
                rt.write("\n", "The duct work goes east, north, and south.");
            },
        },
        {
            name: "patch_duct_ns_s_0",
            priority: 2,
            sourceIndex: nextIdx + 207,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ns" },
                          { field: "north", op: "eq_const", value: 0 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_ew", north: null, east: 2 });
            },
        },
        {
            name: "patch_duct_ns_n",
            priority: 2,
            sourceIndex: nextIdx + 208,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ns" },
                          { field: "north", op: "neq_const", value: 1 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { north: rt.compute(m.$1.north, "+", 1) });
            },
        },
        {
            name: "patch_duct_ns_n_to_shaft",
            priority: 2,
            sourceIndex: nextIdx + 209,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ns" },
                          { field: "north", op: "eq_const", value: 1 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "ns_shaft", north: null });
            },
        },
        {
            name: "patch_duct_ns_s_1",
            priority: 2,
            sourceIndex: nextIdx + 210,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ns" },
                          { field: "north", op: "eq_const", value: 1 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { north: 0 });
            },
        },
        {
            name: "patch_duct_ns_e",
            priority: 2,
            sourceIndex: nextIdx + 210.1,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "duct_ns" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_udws", north: null });
            },
        },
        // ns_shaft south exit back into maze
        {
            name: "patch_ns_shaft_south",
            priority: 2,
            sourceIndex: nextIdx + 210.2,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ns_shaft" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "duct_ns", north: 1 });
            },
        },
        {
            name: "patch_bus_out",
            priority: 0,
            sourceIndex: nextIdx + 6,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "out" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "bus" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.modify(m.$2, { name: "lawn", side: "out", east: 5, north: 2 });
                rt.write("\n", "The bus drives off as you get off.");
            },
        },
        // pull speaker in bus → "'Hey, leave the speaker alone!'"
        // Binary-confirmed: p1_bus_speaker_probe local.log.
        {
            name: "patch_pull_bus_speaker",
            priority: 2,
            sourceIndex: nextIdx + 5.5,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "pull" },
                          { index: 1, op: "eq_const", value: "speaker" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "bus" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "'Hey, leave the speaker alone!'");
            },
        },
        // `bite token` fast start. Dissolves the token and enters the
        // gate question sequence (name, then sex for unknown names) before
        // POOFing to the driveway. No trivia. Dialog handled by
        // bite_await_name / bite_await_sex rules in gateEntryPatches.
        {
            name: "patch_bite_token_fast_start",
            priority: 5,
            sourceIndex: nextIdx + 7,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "bite" },
                          { index: 1, op: "in_set", set: ["token", "tokens"] }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "in_set", set: ["token", "tokens"] },
                          { field: "place", op: "eq_const", value: "held" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.remove(m.$2);
                rt.modify(m.$4, { gate_state: "bite_await_name" });
                rt.write("\n", "The token disolves in your mouth.");
                rt.write("\n", "Your mind fills with a question you MUST answer.");
                rt.write("\n", "'What is your name?'");
            },
        },
        // === East-gate entry: button + dialog + trivia (binary fidelity) ===
        // State lives in history.gate_state ("", "await_bus", "await_survive",
        // "await_want_in", "await_name", "await_sex", "await_trivia", "done").
        // Press count lives in history.gate_presses (nil → "1" → ... → "4").
        ...gateEntryPatches(rt, nextIdx),
        ...safePatches(rt, nextIdx),
        ...bathyspherePatches(rt, nextIdx),
        ...cursePatches(rt, nextIdx),
        ...badDirectionPatches(rt, nextIdx),
        ...silencePatches(rt, nextIdx),
        ...bareVerbPatches(rt, nextIdx),
        ...helpInsultPatches(rt, nextIdx),
        ...mooseAttackPatches(rt, nextIdx),
        ...ivyDeathPatches(rt, nextIdx),
        // Dwight Stones easter egg: jump wall → SPLAT text
        {
            name: "patch_jump_wall_splat",
            priority: 2,
            sourceIndex: nextIdx + 265,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "jump" },
                          { index: 1, op: "eq_const", value: "wall" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "player_name", op: "eq_const", value: "dwight stones" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You approach the wall.  Up, up you go.");
                rt.write("\n", "SPLAT!!! You hit the wall right at 8\".  That would");
                rt.write("\n", "be a new world's record.  Too bad the wall is ten feet tall.");
            },
        },
        {
            name: "patch_dhi_disabled",
            priority: 2,
            sourceIndex: nextIdx + 99,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "hi" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "out" },
                      { field: "east", op: "eq_const", value: 8 },
                      { field: "north", op: "eq_const", value: 5 },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "The speaker doesn't seem to respond to that. Try the button.");
            },
        },
        {
            name: "patch_south_gate_blocked_n",
            priority: 2,
            sourceIndex: nextIdx + 110,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "lawn" },
                      { field: "side", op: "eq_const", value: "out" },
                      { field: "east", op: "eq_const", value: 5 },
                      { field: "north", op: "eq_const", value: 2 },
                  ] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "The gate is decorative and inoperable; you can't open it.");
            },
        },
        {
            name: "patch_dull_room_description",
            priority: 1,
            sourceIndex: nextIdx + 121,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dull_room" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "dull_room" },
                      { field: "visited", op: "eq_const", value: "nil" },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.write("\n", "You have entered a non-descript room.");
                rt.write("\n", "There is a closet to the west.  A door exits to the south.");
                rt.write("\n", "There are no other windows or doors.");
                rt.write("\n", "The closet is open.  It is too far to see in, you'll have to");
                rt.write("\n", "enter it.");
            },
        },
        {
            name: "patch_dull_room_enter_closet",
            priority: 0,
            sourceIndex: nextIdx + 122,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dull_room" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "eq_const", value: "enter" },
                      { index: 1, op: "eq_const", value: "closet" },
                  ] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dull_room" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
                rt.modify(m.$1, { name: "small_closet" });
                rt.modify(m.$3, { visited: "t" });
            },
        },
        {
            name: "patch_small_closet_description",
            priority: 1,
            sourceIndex: nextIdx + 124,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "small_closet" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "small_closet" },
                      { field: "visited", op: "eq_const", value: "nil" },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.write("\n", "This is a tiny closet.  Against the wall is a skeleton.");
                rt.write("\n", "Scrawled on the wall, next to the skeleton is:");
                rt.write("\n", " ");
                rt.write("\n", "Dear Bas,");
                rt.write("\n", "So the mystery man finally decides to come home.");
                rt.write("\n", "Well you're a little late.");
                rt.write("\n", "I was never able to resurrect your mother,");
                rt.write("\n", "but I saw in the paper that you have a beautiful");
                rt.write("\n", "redheaded wife, and a lovely child.  I only hope");
                rt.write("\n", "she hasn't inherited our disease.");
                rt.write("\n", "I finally succumbed to the illness when I was unable");
                rt.write("\n", "to take care of the crop.");
                rt.write("\n", "Good luck,");
                rt.write("\n", "           Dad");
                rt.write("\n", " ");
                rt.write("\n", "To the south is a ventilation duct.");
                rt.write("\n", "To the east is a room.");
            },
        },
        {
            name: "patch_small_closet_east",
            priority: 0,
            sourceIndex: nextIdx + 128,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "small_closet" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "e" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "small_closet" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "dull_room" });
                rt.modify(m.$2, { going: null });
                rt.modify(m.$3, { visited: "t" });
            },
        },
        // any verb + skeleton at small_closet → "Come on now, let your father rest in peace."
        {
            name: "patch_skeleton_interact",
            priority: 2,
            sourceIndex: nextIdx + 128.5,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 1, op: "eq_const", value: "skeleton" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "small_closet" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Come on now, let your father rest in peace.");
            },
        },
        {
            name: "patch_dark_room_description",
            priority: 1,
            sourceIndex: nextIdx + 130,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "dark_room" },
                      { field: "visited", op: "eq_const", value: "nil" },
                  ] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "casket" },
                      { field: "door", op: "eq_var", var: "_state" },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.write("\n", "You have entered a room without lights. From the hall");
                rt.write("\n", "light you can see that there are no windows.");
                rt.write("\n", " ");
                rt.write("\n", "In the middle of the room is a large casket.");
                rt.write("\n", "The only exit is north, to the hall.");
                rt.write("\n", "The casket is " + m._state + ".");
            },
        },
        {
            name: "patch_dark_room_north",
            priority: 0,
            sourceIndex: nextIdx + 132,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "upper_hall" });
                rt.modify(m.$2, { going: null });
                rt.modify(m.$3, { visited: "t" });
            },
        },
        // Dracula cut-hand attack: opening casket with status.cut=t triggers
        // immediate snarling + mesmerized kill (binary probe 2026-04-18).
        {
            name: "patch_open_casket_dracula_cut",
            priority: 4,
            sourceIndex: nextIdx + 209,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "open" },
                          { index: 1, op: "eq_const", value: "casket" }] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "casket" },
                          { field: "door", op: "eq_const", value: "closed" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dracula" },
                          { field: "asleep", op: "eq_const", value: "t" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "cut", op: "eq_const", value: "t" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
                rt.modify(m.$3, { door: "closed" });
                rt.modify(m.$4, { asleep: "t" });
                rt.write("\n", "When you open the casket you notice that a well dressed man");
                rt.write("\n", "with pale skin is inside.  He appears dead.");
                rt.write("\n", "");
                rt.write("\n", "There is a huge diamond ring on his left hand.");
                rt.write("\n", "");
                rt.write("\n", "Suddenly his eyes blink open, you notice the irises are red.");
                rt.write("\n", "It is Dracula.  Oops.");
                rt.write("\n", "Dracula sees the cut on your hand and Snarls!");
                rt.write("\n", "You continue to stare into his eyes, and you can't move!");
                rt.write("\n", "Closer and closer he comes.");
                rt.write("\n", "Dracula grabs you around the neck, sinks his teeth in, and ...");
                rt.write("\n", "Well, looks like you're dead.");
                rt.write("\n", "But before the last neuron in your brain was destroyed, a");
                rt.write("\n", "10th level Cleric came by and waved his hand.");
                rt.modify(m.$1, { name: "foyer", visited: "t" });
            },
        },
        // Dracula mechanics in dark_room (probe: casket_wire.local.log).
        // open casket while closed + dracula asleep -> reveals dracula,
        // casket -> open, dracula -> awake, approaching.
        {
            name: "patch_open_casket_dracula",
            priority: 3,
            sourceIndex: nextIdx + 210,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "open" },
                          { index: 1, op: "eq_const", value: "casket" }] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "casket" },
                          { field: "door", op: "eq_const", value: "closed" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dracula" },
                          { field: "asleep", op: "eq_const", value: "t" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
                rt.modify(m.$3, { door: "open" });
                rt.modify(m.$4, { asleep: null });
                rt.write("\n", "When you open the casket you notice that a well dressed man");
                rt.write("\n", "with pale skin is inside. He appears dead.");
                rt.write("\n", "There is a huge diamond ring on his left hand.");
                rt.write("\n", "Suddenly his eyes blink open, you notice the irises are red.");
                rt.write("\n", "It is Dracula. Oops.");
                rt.write("\n", "The casket is open.");
                rt.write("\n", "Dracula has left his casket and is approaching you.");
            },
        },
        // Dracula awake + `n` → escape to upper_hall ("Dracula stays").
        // Matches input directly (priority 2 > kill's 1 > direction parser's 0).
        {
            name: "patch_dracula_escape_n",
            priority: 2,
            sourceIndex: nextIdx + 210.5,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dracula" },
                          { field: "place", op: "eq_const", value: "dark_room" },
                          { field: "asleep", op: "neq_const", value: "t" }] },
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "n" }] },
            ],
            action: async (m) => {
                rt.remove(m.$3);
                rt.write("\n", "Dracula stays in the dark room.");
                rt.modify(m.$1, { name: "upper_hall", visited: "t" });
            },
        },
        // Dracula awake + `get ring` → refused.
        {
            name: "patch_dracula_get_ring",
            priority: 2,
            sourceIndex: nextIdx + 210.6,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dracula" },
                          { field: "place", op: "eq_const", value: "dark_room" },
                          { field: "asleep", op: "neq_const", value: "t" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "get" },
                          { index: 1, op: "eq_const", value: "ring" }] },
            ],
            action: async (m) => {
                rt.remove(m.$3);
                rt.write("\n", "Dracula won't give it to you.");
            },
        },
        // Dracula awake in dark_room + any new player input -> grabs, kills,
        // cleric resurrects player at foyer. Casket closes, dracula resets.
        // `give` with Dracula present — candy-keep rule beats Dracula kill.
        // Binary probe 2026-04-17: `give candy` → "ain't gonna let you give
        // it away" even with Dracula awake. Priority 2 beats dracula_kills (1).
        {
            name: "patch_dracula_give_keep",
            priority: 2,
            sourceIndex: nextIdx + 234,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dracula" },
                          { field: "place", op: "eq_const", value: "dark_room" },
                          { field: "asleep", op: "neq_const", value: "t" }] },
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "give" }] },
            ],
            action: async (m) => {
                rt.remove(m.$3);
                rt.write("\n", "Hey, after we went through all the trouble to get ");
                rt.write("\n", "it, I ain't gonna let you give it away.");
            },
        },
        // "kill dracula" in dark_room → snarky refusal (binary: "Look turkey breath...")
        // Priority 2 so it fires before patch_dracula_kills (priority 1).
        {
            name: "patch_kill_dracula_refusal",
            priority: 2,
            sourceIndex: nextIdx + 236,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dracula" },
                          { field: "place", op: "eq_const", value: "dark_room" },
                          { field: "asleep", op: "neq_const", value: "t" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "kill" },
                          { index: 1, op: "eq_const", value: "dracula" }] },
            ],
            action: async (m) => {
                rt.remove(m.$3);
                rt.write("\n", "Look turkey breath, this guy isn't the jolly green giant.");
                rt.write("\n", "You'll never kill him in this room.");
            },
        },
        // "give X to dracula" in dark_room (generic) → "The dracula doesn't take X".
        // Priority 3 so it fires before patch_dracula_kills (1) and after
        // patch_dracula_give_keep (2) for bare "give" commands.
        {
            name: "patch_dracula_give_anything",
            priority: 3,
            sourceIndex: nextIdx + 237,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dracula" },
                          { field: "place", op: "eq_const", value: "dark_room" }] },
                { cls: "input", isPositional: true, prefixLength: 4, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "give" },
                          { index: 1, op: "eq_var", var: "_item" },
                          { index: 2, op: "eq_const", value: "to" },
                          { index: 3, op: "eq_const", value: "dracula" }] },
            ],
            action: async (m) => {
                rt.remove(m.$3);
                rt.write("\n", "The dracula doesn't take " + m._item);
            },
        },
        // If the player is wearing a wetsuit, Dracula rips it off first
        // (binary-gametext @0x08c820: "He overpowers you and rips off your suit").
        // Priority 1 so a frightened-by-cross rule (priority 2+) can pre-empt.
        {
            name: "patch_dracula_kills",
            priority: 1,
            sourceIndex: nextIdx + 211,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dracula" },
                          { field: "place", op: "eq_const", value: "dark_room" },
                          { field: "asleep", op: "neq_const", value: "t" }] },
                { cls: "input", isPositional: true, prefixLength: 0, negated: false, tests: [] },
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "casket" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
                const wetsuit = [...(rt.wm.classes.get("object")?.values() ?? [])]
                    .find(o => o.name === "wetsuit" && o.wears === "t");
                if (wetsuit) {
                    rt.write("\n", "He overpowers you and rips off your suit.");
                    rt.modify(wetsuit, { wears: null, place: "dark_room" });
                }
                rt.write("\n", "Dracula grabs you around the neck, sinks his teeth in, and ...");
                rt.write("\n", "The casket is closed.");
                rt.write("\n", "Well, looks like you're dead.");
                rt.write("\n", "But before the last neuron in your brain was destroyed, a");
                rt.write("\n", "10th level Cleric came by and waved his hand.");
                rt.modify(m.$1, { name: "foyer", visited: "t" });
                rt.modify(m.$2, { asleep: "t" });
                rt.modify(m.$4, { door: "closed" });
            },
        },
        // cross candlesticks / form cross with candlesticks held -> forms cross
        // (state=cross). Repels dracula in dark_room.
        {
            name: "patch_cross_candlesticks",
            priority: 3,
            sourceIndex: nextIdx + 212,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "cross" },
                          { index: 1, op: "eq_const", value: "candlesticks" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "candlesticks" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.modify(m.$2, { state: "cross" });
                rt.write("\n", "The candlesticks are in a cross.");
            },
        },
        // form cross without candlesticks -> failure message.
        {
            name: "patch_form_cross_nothing",
            priority: 2,
            sourceIndex: nextIdx + 213,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "form" },
                          { index: 1, op: "eq_const", value: "cross" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: true,
                  tests: [{ field: "name", op: "eq_const", value: "candlesticks" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "You have nothing to make a cross with, arms don't work.");
            },
        },
        {
            name: "patch_make_cross_nothing",
            priority: 2,
            sourceIndex: nextIdx + 213.1,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "make" },
                          { index: 1, op: "eq_const", value: "cross" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: true,
                  tests: [{ field: "name", op: "eq_const", value: "candlesticks" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "You have nothing to make a cross with, arms don't work.");
            },
        },
        // Cross repels dracula in dark_room -> turns into bat, flies away.
        // Higher priority than patch_dracula_kills so cross pre-empts grab.
        {
            name: "patch_cross_repels_dracula",
            priority: 3,
            sourceIndex: nextIdx + 214,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dark_room" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "dracula" },
                          { field: "place", op: "eq_const", value: "dark_room" },
                          { field: "asleep", op: "neq_const", value: "t" },
                          { field: "frightened", op: "neq_const", value: "t" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "candlesticks" },
                          { field: "state", op: "eq_const", value: "cross" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { frightened: "t" });
                rt.write("\n", "Dracula sees the cross and becomes frightened.");
                rt.write("\n", "He turns into a bat and flys toward the highest point.");
            },
        },
        {
            name: "patch_small_closet_south",
            priority: 0,
            sourceIndex: nextIdx + 125,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "small_closet" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "s" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "small_closet" }] },
            ],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { name: "ns_shaft" });
                rt.modify(m.$2, { going: null });
                rt.modify(m.$3, { visited: "t" });
            },
        },
        {
            name: "patch_ns_shaft_description",
            priority: 1,
            sourceIndex: nextIdx + 126,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ns_shaft" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [
                      { field: "name", op: "eq_const", value: "ns_shaft" },
                      { field: "visited", op: "eq_const", value: "nil" },
                  ] },
            ],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in a north-south shaft.");
            },
        },
        {
            name: "patch_ns_shaft_north",
            priority: 0,
            sourceIndex: nextIdx + 127,
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ns_shaft" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "going", op: "eq_const", value: "n" }] },
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ns_shaft" }] },
            ],
            action: async (m, wm, term) => {
                rt.write("\n", "You tumble out of the ventilation system.");
                rt.modify(m.$1, { name: "small_closet" });
                rt.modify(m.$2, { going: null });
                rt.modify(m.$3, { visited: "t" });
            },
        },
    ];
}

function cursePatches(rt, nextIdx) {
    return [
        {
            name: "patch_curse",
            priority: 2,
            sourceIndex: nextIdx + 250,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "curse" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "No way buster.");
            },
        },
    ];
}

function badDirectionPatches(rt, nextIdx) {
    return [
        {
            name: "patch_bad_direction_pool",
            priority: 1,
            sourceIndex: nextIdx + 251,
            conditions: [
                { cls: "x", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: 30 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "noway", op: "eq_const", value: "t" }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [] },
            ],
            action: async (m) => {
                const count = m.$3.bad_dir_count || 0;
                const pool = [
                    "Try another direction.",
                    "Not that way, you don't.",
                    "Watch where you're going!",
                    "Ain't no way you gonna go that way.",
                    "That direction is blocked.",
                ];
                rt.write("\n", pool[count % pool.length]);
                rt.modify(m.$3, { bad_dir_count: count + 1 });
                rt.modify(m.$2, { noway: null, going: null });
            },
        },
    ];
}

function silencePatches(rt, nextIdx) {
    let _silenceIdx = 0;
    const _silencePool = [
        "Keep trying, something might work.",
        "Talk! I need some attention.",
        "Come on, lets do something.",
        "Don't try the silent treatment on me.",
        "That's easy for you not to say.",
        "I didn't hear you.",
    ];
    return [
        {
            name: "patch_silence_pool",
            priority: 1,
            sourceIndex: nextIdx + 270,
            conditions: [
                { cls: "x", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: 0 }] },
                { cls: "current", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "type", op: "eq_const", value: "operator" },
                          { field: "name", op: "eq_const", value: "process" }] },
                { cls: "input", isPositional: true, prefixLength: 0, negated: false,
                  tests: [] },
            ],
            action: async (m) => {
                if (m.$3.tokens.length > 0) return;
                rt.write("\n", _silencePool[_silenceIdx % _silencePool.length]);
                _silenceIdx++;
                rt.remove(m.$3);
                rt.modify(m.$2, { name: "read" });
            },
        },
    ];
}

function bareVerbPatches(rt, nextIdx) {
    return [
        {
            name: "patch_bare_scream_shout_yell",
            priority: 2,
            sourceIndex: nextIdx + 260,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["scream", "shout", "yell"] }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "' !!!!'");
                rt.write("\n", "I don't think anybody is listening.");
            },
        },
        {
            name: "patch_bare_damn",
            priority: 2,
            sourceIndex: nextIdx + 261,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "damn" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "Clean up your act.");
            },
        },
        {
            name: "patch_quit_see_you_later",
            priority: 1,
            sourceIndex: nextIdx + 263,
            conditions: [
                { cls: "x", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: 30 }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false, tests: [] },
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "quit" }] },
            ],
            action: async (m) => {
                rt.remove(m.$3);
                rt.modify(m.$2, { quit: "t" });
                rt.write("\n", "See you later.");
            },
        },
        {
            name: "patch_bare_sit",
            priority: 2,
            sourceIndex: nextIdx + 262,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "sit" }] },
            ],
            action: async (m, wm, term) => {
                if (m.$1.tokens.length > 1) return;
                rt.remove(m.$1);
                rt.write("\n", "I don't know how to sit on it.");
            },
        },
        {
            name: "patch_bare_smell_sniff",
            priority: 2,
            sourceIndex: nextIdx + 325,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["smell", "sniff"] }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "Ah CHOOOO! There is alot of dust around here.");
            },
        },
    ];
}

function helpInsultPatches(rt, nextIdx) {
    const basePhrases = [
        "I don't feel like helping you",
        "First you have to prove you're worth it",
        "What have you ever done for me",
        "You don't deserve any help",
        "So the big bad ghost hunter needs help",
        "Help yourself",
        "I'm not the Salvation Army",
        "You got yourself into this mess",
    ];
    const adjectives = [
        "disgusting", "dirty", "lousy", "dim-witted", "degenerate",
        "nano-brain", "sexually depraved", "back-biting", "vile", "stupid",
        "hard-core", "flea-bitten", "moronic", "filthy", "poor excuse for a",
        "incompetent", "half-wit",
    ];
    const nouns = [
        "aardvark", "nauga", "heathen", "jerk", "Pittsburgher",
        "Pennsylvanian", "nerd", "vermin", "skunk", "hacker",
        "turkey", "flamer", "armadillo", "insect", "NIL hacker", "camel",
    ];
    let baseIdx = 0, adjIdx = 0, nounIdx = 0;
    function nextInsult() {
        const phrase = basePhrases[baseIdx % basePhrases.length]
            + ", you " + adjectives[adjIdx % adjectives.length]
            + " " + nouns[nounIdx % nouns.length];
        baseIdx += 3;
        adjIdx += 7;
        nounIdx += 11;
        return phrase;
    }
    return [
        {
            name: "patch_help_insult",
            priority: 2,
            sourceIndex: nextIdx + 155,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "help" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", nextInsult());
            },
        },
    ];
}

const EAST_GATE_LOC = { cls: "location", isPositional: false, prefixLength: null, negated: false,
    tests: [
        { field: "name", op: "eq_const", value: "lawn" },
        { field: "side", op: "eq_const", value: "out" },
        { field: "east", op: "eq_const", value: 8 },
        { field: "north", op: "eq_const", value: 5 },
    ] };

function kickToBusStop(rt, loc, hist, msg) {
    if (msg) rt.write("\n", msg);
    rt.modify(loc, { name: "bus_stop", side: null, east: null, north: null });
    rt.modify(hist, { gate_state: null, gate_presses: "nil", bus_stopped: "nil", gate_kicked: "t" });
    const hasToken = [...(rt.wm.classes.get("object")?.values() ?? [])]
        .some(o => (o.name === "token" || o.name === "tokens") && o.place === "held");
    if (!hasToken) rt.make("object", { name: "token", place: "held" });
}

function mooseAttackPatches(rt, nextIdx) {
    return [
        {
            name: "patch_sell_moose_attack",
            priority: 2,
            sourceIndex: nextIdx + 310,
            conditions: [
                { cls: "selldonate", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "sell" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "score", op: "eq_var", var: "x" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "Hmm.  I don't think your father would have approved.");
                rt.write("\n", "Oh my god! Out of the forest a moose comes charging at you.");
                rt.write("\n", "The moose is too fast for you, you get trampled.");
                rt.write("\n", "ARGHH! He gored you, but missed James Watt.");
                rt.write("\n", "You are dead, what a bummer after what you have been through.");
                rt.make("input", ["stop"].flat());
                rt.modify(m.$2, { "score": rt.compute(m.x, "-", 20) });
            },
        },
    ];
}

function safePatches(rt, nextIdx) {
    // Safe combination puzzle in dark_hall. Transcript: safe_combo.local.log.
    //   open safe -> prompt; portal safe.door goes closed -> awaiting_combo.
    //   "6 - 21 - 82" -> awaiting_combo -> open.
    //   reach in safe -> creates money (held) while safe.door = open.
    const inDarkHall = { cls: "location", isPositional: false, prefixLength: null, negated: false,
        tests: [{ field: "name", op: "eq_const", value: "dark_hall" }] };
    const unvisited = { cls: "place", isPositional: false, prefixLength: null, negated: false,
        tests: [{ field: "name", op: "eq_const", value: "dark_hall" },
                { field: "visited", op: "eq_const", value: "nil" }] };
    const safe = (door) => ({ cls: "portal", isPositional: false, prefixLength: null, negated: false,
        tests: [{ field: "name", op: "eq_const", value: "safe" },
                { field: "door", op: "eq_const", value: door }] });

    return [
        // Environmental: the safe is part of the room description.
        {
            name: "patch_safe_on_wall",
            priority: 1,
            sourceIndex: nextIdx + 200,
            conditions: [inDarkHall, unvisited],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a safe on the wall.");
            },
        },
        // Re-display "safe is open" banner before the room description.
        {
            name: "patch_safe_open_banner",
            priority: 2,
            sourceIndex: nextIdx + 201,
            conditions: [inDarkHall, unvisited, safe("open")],
            action: async (m, wm, term) => {
                rt.write("\n", "The safe is open.");
                rt.write("\n", "You'll have to reach in to get anything.");
            },
        },
        // "open safe" while closed -> prompt for combination.
        {
            name: "patch_open_safe_closed",
            priority: 2,
            sourceIndex: nextIdx + 202,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "open" },
                          { index: 1, op: "eq_const", value: "safe" }] },
                inDarkHall,
                safe("closed"),
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { door: "awaiting_combo" });
                rt.write("\n", "It is locked.  It is a combination lock.");
                rt.write("\n", "To open it you should tell me some numbers, all on the same line.");
                rt.write("\n", "eg. '10 - 10 - 10'");
            },
        },
        // Correct combination: "6 - 21 - 82".
        {
            name: "patch_safe_combo_right",
            priority: 3,
            sourceIndex: nextIdx + 203,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 5, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "6" },
                          { index: 1, op: "eq_const", value: "-" },
                          { index: 2, op: "eq_const", value: "21" },
                          { index: 3, op: "eq_const", value: "-" },
                          { index: 4, op: "eq_const", value: "82" }] },
                inDarkHall,
                safe("awaiting_combo"),
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { door: "open" });
                rt.write("\n", "You sure have a mind for numbers!");
                // patch_safe_open_banner follows up with the "safe is open" lines.
            },
        },
        // Any other input while awaiting_combo -> wrong, revert to closed.
        {
            name: "patch_safe_combo_wrong",
            priority: 2,
            sourceIndex: nextIdx + 204,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false, tests: [] },
                inDarkHall,
                safe("awaiting_combo"),
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { door: "closed" });
                rt.write("\n", "Well, I'll try it.");
                rt.write("\n", "That didn't work.");
                rt.write("\n", "The safe must be a new version.");
            },
        },
        // "reach in safe" after money already taken → "greedy SOB"
        {
            name: "patch_reach_in_safe_greedy",
            priority: 3,
            sourceIndex: nextIdx + 204.5,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 3, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "reach" },
                          { index: 1, op: "eq_const", value: "in" },
                          { index: 2, op: "eq_const", value: "safe" }] },
                inDarkHall,
                safe("open"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "money" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Stop.  You are a greedy SOB.");
                rt.write("\n", "No more for you.");
            },
        },
        // "reach in safe" while open -> money into held inventory.
        {
            name: "patch_reach_in_safe",
            priority: 2,
            sourceIndex: nextIdx + 205,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 3, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "reach" },
                          { index: 1, op: "eq_const", value: "in" },
                          { index: 2, op: "eq_const", value: "safe" }] },
                inDarkHall,
                safe("open"),
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                const existing = [...(wm.classes.get("object")?.values() ?? [])]
                    .find(o => o.name === "money");
                if (existing) {
                    rt.modify(existing, { place: "held" });
                } else {
                    rt.make("object", { name: "money", place: "held", treasure: "t" });
                }
                rt.write("\n", "You just got the money in the safe.");
            },
        },
        // "get safe" → binary: "The safe is embedded in the wall."
        {
            name: "patch_get_safe_embedded",
            priority: 2,
            sourceIndex: nextIdx + 209,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "get" },
                          { index: 1, op: "eq_const", value: "safe" }] },
                inDarkHall,
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The safe is embedded in the wall.");
            },
        },
    ];
}

function bathyspherePatches(rt, nextIdx) {
    // Elevator + bathysphere + ocean entry. Transcripts:
    //   bathysphere_airlock.local.log, ocean_entry.local.log, ocean_entry2.local.log.
    //
    // Topology: back_hall (press button -> elevator doors open) -> n -> elevator.
    // Elevator has a lit floor (object.elevator.place = "h" | "b" | "p"). Push b/h/p
    // closes doors, travels, opens doors, updates lit floor. s from elevator@b ->
    // bathysphere; n/s from elevator@h -> back_hall.
    // Bathysphere: press white -> back into elevator; press green -> "Nothing happens";
    // press red -> flood. With wetsuit: "Water rushes in and fills the chamber."
    // Without: drown sequence (rule #19/#12 in ref/binary-rules.txt) -> teleport to
    // dark_hall. open door -> wdoor opens. s with wdoor open -> ocean_exit -> s ->
    // ocean_bottom (weight-carried).
    const at = (name) => ({ cls: "location", isPositional: false, prefixLength: null, negated: false,
        tests: [{ field: "name", op: "eq_const", value: name }] });
    const unvisited = (name) => ({ cls: "place", isPositional: false, prefixLength: null, negated: false,
        tests: [{ field: "name", op: "eq_const", value: name }, { field: "visited", op: "eq_const", value: "nil" }] });
    const portal = (name, door) => ({ cls: "portal", isPositional: false, prefixLength: null, negated: false,
        tests: [{ field: "name", op: "eq_const", value: name }, { field: "door", op: "eq_const", value: door }] });
    const going = (dir) => ({ cls: "status", isPositional: false, prefixLength: null, negated: false,
        tests: [{ field: "going", op: "eq_const", value: dir }] });
    const input = (...tokens) => ({ cls: "input", isPositional: true, prefixLength: tokens.length, negated: false,
        tests: tokens.map((t, i) => ({ index: i, op: "eq_const", value: t })) });
    const inputSet = (index, set) => ({ cls: "input", isPositional: true, prefixLength: index + 1, negated: false,
        tests: [{ index, op: "in_set", set }] });

    let idx = nextIdx + 300;
    const next = () => idx++;

    // Pre-emptive "then" splitter for 2-token verbs. Runs at high priority so
    // it beats the generic verb-normalizer name384 (priority 0, input-first
    // stamp) on inputs like [push, b, then, push, halt]. Without it, name384
    // would rewrite the leading [push, b] to [press, b] and drop the tail,
    // because the engine's _testWme only enforces prefixLength as a minimum
    // (no exact-length check) and name384 has no "then" guard.
    //
    // Combined with neq_const "then" tests on my own multi-token verb rules,
    // this gives clean "<verb1 arg> then <verb2 arg>" chaining for the
    // walkthrough's "push b then push halt" sequence.
    const thenSplit = {
        name: "patch_then_split_2tok",
        priority: 10,
        sourceIndex: nextIdx + 299,
        conditions: [
            { cls: "input", isPositional: true, prefixLength: 3, negated: false,
              tests: [
                  { index: 0, op: "eq_var", var: "t0" },
                  { index: 1, op: "eq_var", var: "t1" },
                  { index: 2, op: "eq_const", value: "then" },
              ] },
        ],
        action: async (m) => {
            // substr from=5 skips [t0, t1, "then"] (OPS5 positions 2,3,4) and
            // yields just the tail starting at token index 3 — unlike name16
            // which uses from=4, leaves the "then" prefix on, and relies on
            // name19 to strip it on a later cycle. We can't wait for name19:
            // descend_b_complete (priority 1) would outrun it, completing the
            // descent before "push halt" is ready to fire.
            const rest = rt.substr(m.$1, 5, "inf");
            rt.remove(m.$1);
            rt.make("input", [m.t0, m.t1].flat());
            if (rest.length > 0) rt.make("input", rest);
        },
    };

    // Drown + Neptune sequence (not wearing wetsuit when the airlock floods).
    // Matches binary rule #12 (ref/binary-rules.txt): -20 score, teleport to
    // dark_hall, mark elevator broken, set DIED flag so a second drown doesn't
    // repeat the sequence.
    const drown = (m) => {
        rt.write("\n", "You lose the regulator on your wetsuit and can't get any air.");
        rt.write("\n", "The water fills your lungs, choke, cough!");
        const objs = rt.wm.classes.get("object");
        if (objs) {
            for (const o of objs.values()) {
                if (o.name === "cube" && o.place === "held") {
                    rt.write("\n", "The water dissolves the sugar cube.");
                    rt.remove(o);
                } else if (o.name === "candy" && o.place === "held") {
                    rt.write("\n", "The water dissolves the candy.");
                    rt.remove(o);
                }
            }
        }
        rt.write("\n", "Your life passes before your eyes.");
        rt.write("\n", "Maybe next time you'll remember to get a wetsuit.");
        rt.write("\n", "Neptune appears and blows new life in your body!");
        rt.write("\n", "You return to life but neptune doesn't want you back in his world again.");
        rt.modify(m.$2, { name: "dark_hall", side: null, east: null, north: null });
        const place = [...(rt.wm.classes.get("place")?.values() ?? [])]
            .find(p => p.name === "dark_hall");
        if (place) rt.modify(place, { visited: null });
        const status = rt.wm.first("status");
        if (status) rt.modify(status, {
            score: (status.score || 0) - 20,
            died: "t",
        });
        const elevator = [...(rt.wm.classes.get("object")?.values() ?? [])]
            .find(o => o.name === "elevator");
        if (elevator) rt.modify(elevator, { state: "broken" });
    };

    const wearingWetsuit = () => {
        const objs = rt.wm.classes.get("object");
        if (!objs) return false;
        for (const o of objs.values()) {
            if (o.name === "wetsuit" && o.wears === "t") return true;
        }
        return false;
    };

    return [
        thenSplit,
        // === back_hall: elevator environmental notes ===
        // Two variants: one for the first-visit description block (gated on
        // unvisited place so name2074's priority-1 back-hall description
        // comes first, then this fires right after); one for subsequent
        // entries (elevator-halted re-entry via `s` from between-floors)
        // where the place is already visited but the binary still prints the
        // elevator note (matches_lawn.local.log:230-231).
        //
        // Portal state is read inline so press-button (modifies portal only)
        // does NOT retrigger — refraction holds until location.name changes.
        {
            name: "patch_back_hall_elevator_note_first",
            priority: 0,
            sourceIndex: next(),
            conditions: [at("back_hall"), unvisited("back_hall")],
            action: async () => {
                const elev = [...(rt.wm.classes.get("portal")?.values() ?? [])]
                    .find(p => p.name === "elevator");
                if (elev && elev.door === "open") {
                    rt.write("\n", "The elevator doors are open.");
                } else {
                    rt.write("\n", "There is a closed elevator to the north.");
                }
                rt.write("\n", "There is a button on the north wall.");
            },
        },
        {
            name: "patch_back_hall_elevator_note_halted",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                at("back_hall"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "halted" }] },
            ],
            action: async () => {
                rt.write("\n", "The elevator doors are open.");
                rt.write("\n", "There is a button on the north wall.");
            },
        },
        // Halted-elevator overlay: fires when player is at back_hall with the
        // elevator stopped between floors (object.elevator.moving = "halted").
        // Writes the 3-line "stopped / machinery / climb on" hint — climb on
        // refers to `climb elevator` which reveals the Matter Transmission unit.
        {
            name: "patch_back_hall_halted_overlay",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                at("back_hall"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "halted" }] },
            ],
            action: async () => {
                rt.write("\n", "The elevator is stopped between floors.");
                rt.write("\n", "Above the elevator compartment is some strange machinery.");
                rt.write("\n", "In order to see more clearly, you should climb on.");
            },
        },
        // press button @ back_hall -> elevator doors open.
        {
            name: "patch_back_hall_press_button",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "button" }] },
                at("back_hall"),
                portal("elevator", "closed"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { door: "open" });
                rt.write("\n", "The elevator doors are open.");
            },
        },
        // press button @ back_hall when elevator is broken -> "The elevator is broken."
        {
            name: "patch_back_hall_press_button_broken",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "button" }] },
                at("back_hall"),
                portal("elevator", "broken"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The elevator is broken.");
            },
        },
        // n @ back_hall with elevator door open -> enter elevator location.
        // Also marks back_hall as visited so subsequent re-entries skip the
        // full description (match name2076/2077/2078's "leave this room"
        // convention that binds visited=t on exit).
        {
            name: "patch_back_hall_enter_elevator",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                at("back_hall"), going("n"), portal("elevator", "open"),
                { cls: "place", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "back_hall" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { name: "elevator" });
                rt.modify(m.$2, { going: null });
                rt.modify(m.$4, { visited: "t" });
            },
        },

        // === elevator: description + floor light ===
        {
            name: "patch_elevator_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [at("elevator"), unvisited("elevator")],
            action: async (m) => {
                rt.write("\n", "You are in the elevator.");
                rt.write("\n", "There are a bunch of buttons on the wall.");
                rt.write("\n", "They are labeled: P, H, B, HALT, OPEN DOOR.");
                rt.write("\n", "Scrawled on a wall is 'Homer kisses dead goats'");
                rt.write("\n", "and 'Homer turns my head'");
                rt.write("\n", "On the floor it says, 'L__t g_e_ _ere!'");
            },
        },
        {
            name: "patch_elevator_lit_h",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "place", op: "eq_const", value: "h" }] },
            ],
            action: async () => { rt.write("\n", "The H is lit."); },
        },
        {
            name: "patch_elevator_lit_b",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "place", op: "eq_const", value: "b" }] },
            ],
            action: async () => { rt.write("\n", "The B is lit."); },
        },
        {
            name: "patch_elevator_p_brick_wall",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "place", op: "eq_const", value: "p" }] },
            ],
            action: async () => {
                rt.write("\n", "The doors opened to reveal a brick wall.");
                rt.write("\n", "There is writing saying 'UNDER CONSTRUCTION'");
            },
        },
        {
            name: "patch_elevator_lit_p",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "place", op: "eq_const", value: "p" }] },
            ],
            action: async () => { rt.write("\n", "The P is lit."); },
        },
        // push b @ elevator: 2-phase so push-halt can interrupt mid-descent.
        //   Phase 1: set object.elevator.moving = "b", write "doors close BOOM!"
        //   Phase 2: auto-fire when moving="b" with no input — completes descent.
        // The halt rule below matches before phase 2 (higher priority) if a
        // "push halt" input follows in the same engine run.
        //
        // neq_const "then" at index 2 stops this rule from greedily matching
        // a "push b then ..." chain before name16 gets to split it. Engine
        // treats out-of-range token indices as nil, which passes neq_const.
        {
            name: "patch_elevator_push_b_start",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "b" },
                          { index: 2, op: "neq_const", value: "then" }] },
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "place", op: "neq_const", value: "b" },
                          { field: "moving", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { moving: "b" });
                rt.write("\n", "The elevator doors close.  BOOM!");
            },
        },
        {
            name: "patch_elevator_descend_b_complete",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "b" }] },
            ],
            action: async (m) => {
                rt.write("\n", "The elevator shakes and starts to move down.");
                rt.write("\n", "You feel like you are in free fall.");
                rt.write("\n", "You hit a bump, and start to slow down.");
                rt.write("\n", "You made it.  The elevator has stopped.");
                rt.write("\n", "The doors open.");
                rt.write("\n", "You can smell salt air, but your view of the outside");
                rt.write("\n", "is obscured.");
                rt.modify(m.$2, { place: "b", moving: null });
            },
        },
        // push h @ elevator from elsewhere -> same 2-phase pattern.
        {
            name: "patch_elevator_push_h_start",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "h" }] },
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "place", op: "neq_const", value: "h" },
                          { field: "moving", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { moving: "h" });
                rt.write("\n", "The elevator doors close.  BOOM!");
            },
        },
        {
            name: "patch_elevator_ascend_h_complete",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "h" }] },
            ],
            action: async (m) => {
                rt.write("\n", "The elevator bounces to a halt.  SCREEEECH!");
                rt.write("\n", "The doors open.");
                rt.modify(m.$2, { place: "h", moving: null });
            },
        },
        // push p @ elevator without WAY OUT → P-floor construction dead-end.
        // 2-phase like push B/H so HALT can interrupt mid-descent.
        {
            name: "patch_elevator_push_p_start",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "p" },
                          { index: 2, op: "neq_const", value: "then" }] },
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "place", op: "neq_const", value: "p" },
                          { field: "moving", op: "eq_const", value: "nil" },
                          { field: "way_out", op: "neq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { moving: "p" });
                rt.write("\n", "The elevator doors close.  BOOM!");
            },
        },
        {
            name: "patch_elevator_descend_p_complete",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "p" }] },
            ],
            action: async (m) => {
                rt.write("\n", "The elevator shakes and starts to move down.");
                rt.write("\n", "You feel like you are in free fall.");
                rt.write("\n", "You hit a bump, and start to slow down.");
                rt.write("\n", "You made it.  The elevator has stopped.");
                rt.write("\n", "The doors open.");
                rt.modify(m.$2, { place: "p", moving: null });
            },
        },
        // push halt: interrupts an in-flight descent. Wins conflict resolution
        // over the "complete" rule (priority 2 > 1) when a descent is moving.
        {
            name: "patch_elevator_push_halt",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "halt" }] },
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "in_set", set: ["b", "h", "p"] }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The elevator bounces to a halt.  SCREEEECH!");
                rt.modify(m.$3, { moving: "halted" });
            },
        },
        // press halt @ elevator when not moving -> "The elevator is not moving turkey."
        // Priority 0 so push_b_start (priority 2) fires before this when both
        // "push b" and "push halt" inputs are in WM simultaneously (push-b-then-halt chain).
        {
            name: "patch_elevator_halt_stationary",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "halt" }] },
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The elevator is not moving turkey.");
            },
        },
        // push open door @ halted elevator -> between-floors description.
        {
            name: "patch_elevator_push_open_door_halted",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 3, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "open" },
                          { index: 2, op: "eq_const", value: "door" }] },
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "halted" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You are between floors.");
                rt.write("\n", "You can see out through the top half of the elevator.");
            },
        },
        // s from elevator at B -> bathysphere (doors close "Swish...").
        {
            name: "patch_elevator_s_to_bathysphere",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                going("s"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "place", op: "eq_const", value: "b" }] },
            ],
            action: async (m) => {
                rt.write("\n", "The elevator doors close.  Swish...");
                rt.modify(m.$1, { name: "bathysphere" });
                rt.modify(m.$2, { going: null });
            },
        },
        // s from elevator at H -> back to back_hall.
        {
            name: "patch_elevator_s_to_back_hall",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                going("s"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "place", op: "eq_const", value: "h" }] },
            ],
            action: async (m) => {
                rt.write("\n", "The elevator doors close.  Swish...");
                rt.modify(m.$1, { name: "back_hall" });
                rt.modify(m.$2, { going: null });
            },
        },

        // s from halted elevator -> back_hall without the "doors close Swish..." text
        // (doors are already open from push open door). Priority 3 beats the normal
        // elevator_s_to_back_hall (priority 2) and elevator_s_to_bathysphere (priority 2).
        // Keeps elevator.moving=halted so the back_hall overlay keeps firing.
        {
            name: "patch_elevator_s_halted",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                at("elevator"),
                going("s"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "halted" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { name: "back_hall" });
                rt.modify(m.$2, { going: null });
            },
        },
        // climb elevator @ back_hall with elevator halted. Fails if carrying
        // anything ("The opening is too small..."). Transcript: matches_lawn.log
        // shows "carrying watch" forces drop-all before climbing.
        {
            name: "patch_climb_elevator_held",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "climb" },
                          { index: 1, op: "eq_const", value: "elevator" }] },
                at("back_hall"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "halted" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_var", var: "heldname" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The opening is to small for you to fit carrying", m.heldname);
            },
        },
        // climb elevator, empty-handed -> atop_elevator (BZM flavor line).
        {
            name: "patch_climb_elevator_empty",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "climb" },
                          { index: 1, op: "eq_const", value: "elevator" }] },
                at("back_hall"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "moving", op: "eq_const", value: "halted" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: true,
                  tests: [{ field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "BZM would be proud.");
                rt.modify(m.$2, { name: "atop_elevator" });
            },
        },
        // atop_elevator description: decal + NORMAL/WAY OUT buttons.
        {
            name: "patch_atop_elevator_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [at("atop_elevator"), unvisited("atop_elevator")],
            action: async () => {
                rt.write("\n", "You are atop the elevator.  The machinery is of alien creation.");
                rt.write("\n", "On the side of it is a small decal.");
                rt.write("\n", "The decal reads 'afihYwn Matter Transmission, Inc'");
                rt.write("\n", "There are two buttons on the machine, one says NORMAL.");
                rt.write("\n", "The other says WAY OUT.");
            },
        },
        // push way out @ atop_elevator -> lights WAY OUT (stored as elevator.way_out=t).
        {
            name: "patch_push_way_out",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 3, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "way" },
                          { index: 2, op: "eq_const", value: "out" }] },
                at("atop_elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { way_out: "t" });
                rt.write("\n", "The WAY OUT light is lit.");
            },
        },
        // push normal @ atop_elevator -> break the MT machine (one-shot).
        // Binary probe: machine_color2.local.log line 254-257.
        {
            name: "patch_push_normal_mt",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "normal" }] },
                at("atop_elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "normal_broken", op: "neq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The elevator shaft starts to shake.");
                rt.write("\n", "The machine starts to change color.  Steam spews out!!");
                rt.write("\n", "The light goes out on the NORMAL button.");
                rt.write("\n", "The shaking stops.  (I think you broke it)");
                rt.modify(m.$3, { normal_broken: "t" });
            },
        },
        // push normal/way out @ atop_elevator after machine is broken.
        {
            name: "patch_push_normal_mt_broken",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "in_set", set: ["normal", "way"] }] },
                at("atop_elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "normal_broken", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Nothing happens, you did break it.");
            },
        },
        // d @ atop_elevator -> back_hall (back into the halted-elevator zone).
        {
            name: "patch_atop_elevator_d",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("atop_elevator"), going("d")],
            action: async (m) => {
                rt.modify(m.$1, { name: "back_hall" });
                rt.modify(m.$2, { going: null });
            },
        },
        // Matter transmission: push p with WAY OUT lit triggers the teleport.
        // Full descent text first (normal P travel), then dematerialize, drop
        // all held objects at the destination, then POOF to the front walk
        // (lawn, side=in, east=5, north=3 — matches name1095).
        {
            name: "patch_elevator_matter_transmit",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "p" }] },
                at("elevator"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "elevator" },
                          { field: "way_out", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The doors squeek close.");
                rt.write("\n", "The elevator shakes and starts to move down.");
                rt.write("\n", "You feel like you are in free fall.");
                rt.write("\n", "You hit a bump, and start to slow down.");
                rt.write("\n", "You made it.  The elevator has stopped.");
                rt.write("\n", "The doors open.");
                // Drop held items at front_door (east=5, north=4) — confirmed via
                // binary probe (tests/transcripts/matches_horn.local.log:382-386
                // shows bottle/chair/wetsuit/watch at (5,4) after matter
                // transmit). Player separately teleports to front_walk (5,3).
                // This two-tile split is what makes the walkthrough's
                // "PUSH P / N / GET BOTTLE" pattern work — the N walks player
                // from their landing spot up to the item pile.
                const held = [...(rt.wm.classes.get("object")?.values() ?? [])]
                    .filter(o => o.place === "held");
                if (held.length > 0) {
                    rt.write("\n", "You suddenly feel very ill.  Your body seems to be dematerializing.");
                    rt.write("\n", "You can't hold on to the stuff you were carrying.");
                    for (const obj of held) {
                        rt.modify(obj, { place: "lawn", side: "in", east: 5, north: 4 });
                    }
                    rt.write("\n", "All dropped.");
                }
                rt.write("\n", "POOF!!!");
                for (let i = 0; i < held.length; i++) {
                    rt.write("\n", "Poof!");
                }
                rt.modify(m.$2, { name: "lawn", side: "in", east: 5, north: 3 });
                // Reset matter-transmission state so pressing P again doesn't re-teleport.
                rt.modify(m.$3, { way_out: null, place: "p", moving: null });
            },
        },

        // === bathysphere: description + buttons + flood + exit ===
        // name1 (the generic place-creation rule) auto-makes place.bathysphere on entry.
        {
            name: "patch_bathysphere_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [at("bathysphere"), unvisited("bathysphere")],
            action: async () => {
                rt.write("\n", "You are in the airlock of a bathysphere.  To the south is a");
                rt.write("\n", "large water tight door.  There are a green and red buttons near the door.");
                rt.write("\n", "There is the elevator to the north, with its white button.");
                rt.write("\n", "Through a window you can see the murky depths.");
            },
        },
        // press white when flooded -> water floods elevator, death sequence.
        {
            name: "patch_bathysphere_press_white_flooded",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "white" }] },
                at("bathysphere"),
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wdoor" },
                          { field: "state", op: "eq_const", value: "flooded" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The elevator door opens.");
                rt.write("\n", "The water rushes into the elevator.");
                rt.write("\n", "As it fills with water, the elevator begins to shake.");
                rt.write("\n", "Suddenly the elevator car disappears down the shaft and the");
                rt.write("\n", "rushing water pushes you down the shaft to your death.");
                rt.write("\n", "");
                rt.write("\n", "Neptune appears and blows new life in your body!");
                rt.write("\n", "You return to life but neptune doesn't want you back in his world again.");
                rt.modify(m.$2, { name: "dark_hall", side: null, east: null, north: null });
                const place = [...(rt.wm.classes.get("place")?.values() ?? [])]
                    .find(p => p.name === "dark_hall");
                if (place) rt.modify(place, { visited: null });
                const status = rt.wm.first("status");
                if (status) rt.modify(status, {
                    score: (status.score || 0) - 20,
                    died: "t",
                });
                const elevator = [...(rt.wm.classes.get("object")?.values() ?? [])]
                    .find(o => o.name === "elevator");
                if (elevator) rt.modify(elevator, { state: "broken" });
            },
        },
        // press white button -> elevator door opens (return path).
        {
            name: "patch_bathysphere_press_white",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "white" }] },
                at("bathysphere"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The elevator doors are open.");
            },
        },
        // press green -> nothing.
        {
            name: "patch_bathysphere_press_green",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "green" }] },
                at("bathysphere"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Nothing happens.");
            },
        },
        // press red -> flood. If wetsuit, open wdoor & survive; else drown.
        {
            name: "patch_bathysphere_press_red",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["press", "push"] },
                          { index: 1, op: "eq_const", value: "red" }] },
                at("bathysphere"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Water rushes in and fills the chamber.");
                if (wearingWetsuit()) {
                    // Mark airlock flooded so "open door" works. Use wdoor state=flooded
                    // as a hint (still closed but ready to open).
                    const wdoor = [...(rt.wm.classes.get("portal")?.values() ?? [])]
                        .find(p => p.name === "wdoor");
                    if (wdoor) rt.modify(wdoor, { state: "flooded" });
                } else {
                    drown(m);
                }
            },
        },
        // open door / open wdoor @ bathysphere when flooded -> wdoor opens.
        {
            name: "patch_bathysphere_open_door",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "open" },
                          { index: 1, op: "in_set", set: ["door", "wdoor"] }] },
                at("bathysphere"),
                { cls: "portal", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wdoor" },
                          { field: "state", op: "eq_const", value: "flooded" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { door: "open" });
                rt.write("\n", "The water tight door opens.");
            },
        },
        // open door @ bathysphere when NOT flooded → "The door won't open."
        {
            name: "patch_bathysphere_open_door_locked",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "open" },
                          { index: 1, op: "in_set", set: ["door", "wdoor"] }] },
                at("bathysphere"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The door won't open.");
            },
        },
        // s from bathysphere with wdoor open -> ocean bottom @ east=0 up=0.
        {
            name: "patch_bathysphere_s_to_ocean",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("bathysphere"), going("s"), portal("wdoor", "open")],
            action: async (m) => {
                rt.modify(m.$1, { name: "ocean", east: 0, up: 0 });
                rt.modify(m.$2, { going: null });
            },
        },
        // s from bathysphere with wdoor closed -> "The water tight door is closed."
        {
            name: "patch_bathysphere_s_wdoor_closed",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("bathysphere"), going("s"), portal("wdoor", "closed")],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "The water tight door is closed.");
            },
        },
        // n from bathysphere -> board elevator (doors must open first via white).
        {
            name: "patch_bathysphere_n_to_elevator",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("bathysphere"), going("n")],
            action: async (m) => {
                rt.modify(m.$1, { name: "elevator" });
                rt.modify(m.$2, { going: null });
            },
        },

        // get speargun at bathysphere — generic name64 refuses items with
        // state != nil; speargun is spawned with state="loaded" so it'd be
        // permanently immovable without this override.
        {
            name: "patch_bathysphere_get_speargun",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "get" },
                          { index: 1, op: "eq_const", value: "speargun" }] },
                at("bathysphere"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "speargun" },
                          { field: "place", op: "eq_const", value: "bathysphere" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { place: "held" });
                rt.write("\n", "You just got speargun.");
            },
        },

        // wetsuit room description: add "I'm afraid you aren't going to survive
        // underwater" warning before standard wetsuit text (binary 0x052a9e).
        // Fires at priority 1 so it appears before name371's wetsuit text.
        {
            name: "patch_wetsuit_survive_hint",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_var", var: "x" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "wetsuit" },
                          { field: "place", op: "eq_var", var: "x" }] },
            ],
            action: async (m) => {
                rt.write("\n", "I'm afraid you aren't going to survive underwater.");
            },
        },

        // ============================================================
        // === Ocean grid (3D: east 0..3, up {0=bottom, 5=surface}) ===
        // ============================================================
        //
        // The OPS5 source addresses ocean tiles with (south east up) but the
        // truncated-source port only reaches (s=0) tiles — the south passage
        // is blocked by seaweed "too thick to penetrate" until the player
        // finds matches (location unknown, task #3). So we model a 2D slice:
        //   bottom: ocean (east 0..3, up=0), seaweed layer, all-south blocked
        //   surface: ocean (east 0..3, up=5), sea monster present until shot
        // East=3 bottom has a hole → cave. Surface `n` leads to beach (once
        // monster dead). Descent `d` from surface returns to bottom at same
        // east column.
        //
        // Weight check: coins in inventory prevent `u` ascent ("you weigh
        // too much"). Speargun is light. This matches probe findings.
        ...oceanCavePatches(rt, next),
    ];
}

// Ocean + cave + beach + Cecil + sea monster + conch.
// Called from bathyspherePatches — shares its `next()` counter.
// Probe transcripts: ocean_entry, ocean_nav, ocean_surface, surface_explore,
// shoot_monster, beach_conch, cecil_summon, cave_nav, cave_full, eel_defeat,
// hot_spring, diamonds_grab. See CLOSED_DIVERGENCES.md "SOLVED — Elevator
// + bathysphere + ocean + cave entry (2026-04-16)" probe block.
function oceanCavePatches(rt, next) {
    const at = (name) => ({ cls: "location", isPositional: false, prefixLength: null, negated: false,
        tests: [{ field: "name", op: "eq_const", value: name }] });
    const going = (dir) => ({ cls: "status", isPositional: false, prefixLength: null, negated: false,
        tests: [{ field: "going", op: "eq_const", value: dir }] });
    const input = (...tokens) => ({ cls: "input", isPositional: true, prefixLength: tokens.length, negated: false,
        tests: tokens.map((t, i) => ({ index: i, op: "eq_const", value: t })) });
    const atOcean = (east, up) => ({ cls: "location", isPositional: false, prefixLength: null, negated: false,
        tests: [
            { field: "name", op: "eq_const", value: "ocean" },
            { field: "east", op: "eq_const", value: east },
            { field: "up", op: "eq_const", value: up },
        ] });
    const atOceanUp = (up) => ({ cls: "location", isPositional: false, prefixLength: null, negated: false,
        tests: [
            { field: "name", op: "eq_const", value: "ocean" },
            { field: "up", op: "eq_const", value: up },
        ] });

    const coinsHeld = () => {
        for (const o of (rt.wm.classes.get("object")?.values() ?? [])) {
            if (o.name === "coins" && o.place === "held") return true;
        }
        return false;
    };
    const seamonster = () => {
        for (const o of (rt.wm.classes.get("object")?.values() ?? [])) {
            if (o.name === "seamonster") return o;
        }
        return null;
    };
    const findObj = (name) => {
        for (const o of (rt.wm.classes.get("object")?.values() ?? [])) {
            if (o.name === name) return o;
        }
        return null;
    };
    const findPortal = (name) => {
        for (const p of (rt.wm.classes.get("portal")?.values() ?? [])) {
            if (p.name === name) return p;
        }
        return null;
    };

    // Shared drown path for ocean-side deaths (eel, sea monster eats).
    // Matches binary rule #12: -20 score, DIED flag, elevator broken.
    const drownToDarkHall = (loc) => {
        rt.write("\n", "You lose the regulator on your wetsuit and can't get any air.");
        rt.write("\n", "The water fills your lungs, choke, cough!");
        rt.write("\n", "Your life passes before your eyes.");
        rt.write("\n", "Neptune appears and blows new life in your body!");
        rt.write("\n", "You return to life but neptune doesn't want you back in his world again.");
        rt.modify(loc, { name: "dark_hall", side: null, east: null, north: null, up: null });
        const place = [...(rt.wm.classes.get("place")?.values() ?? [])]
            .find(p => p.name === "dark_hall");
        if (place) rt.modify(place, { visited: null });
        const status = rt.wm.first("status");
        if (status) rt.modify(status, {
            score: (status.score || 0) - 20,
            died: "t",
        });
        const elevator = [...(rt.wm.classes.get("object")?.values() ?? [])]
            .find(o => o.name === "elevator");
        if (elevator) rt.modify(elevator, { state: "broken" });
    };

    return [
        // ================= Ocean bottom description =================
        // Fires on every location-stamp change (east shift, up shift,
        // name shift). No visited-gate so every tile prints.
        {
            name: "patch_ocean_bottom_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [atOceanUp(0)],
            action: async () => {
                rt.write("\n", "The weight of something you're carrying has pulled you to the bottom.");
                rt.write("\n", "There is seaweed around here.");
                rt.write("\n", "You are at the bottom of the ocean.");
                rt.write("\n", "You are in sea water.");
            },
        },
        // East=3 column: overlay "rock cliff to the east" at non-surface levels (up 0-4).
        // Binary shows this at up=0, up=1, up=2, up=3 when at e=3.
        {
            name: "patch_ocean_e3_cliff",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" },
                          { field: "east", op: "eq_const", value: 3 },
                          { field: "up", op: "neq_const", value: 5 }] },
            ],
            action: async () => {
                rt.write("\n", "There is a rock cliff to the east.");
            },
        },
        // East=3, up=3: hot water area with hole in east wall leading to cave_entry.
        // Binary: "The water is hot in this area." + "There is a hole in the east wall."
        // fires at ocean(e=3, up=3) — one level below cave_entry.
        {
            name: "patch_ocean_up3_e3_hot",
            priority: 0,
            sourceIndex: next(),
            conditions: [atOcean(3, 3)],
            action: async () => {
                rt.write("\n", "The water is hot in this area.");
                rt.write("\n", "There is a hole in the east wall.");
            },
        },

        // ================= Ocean surface description =================
        {
            name: "patch_ocean_surface_desc_monster",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                atOceanUp(5),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "seamonster" },
                          { field: "alive", op: "eq_const", value: "t" }] },
            ],
            action: async () => {
                rt.write("\n", "There is a angry ugly sea monster trying to eat you.");
                rt.write("\n", "He is right on top of you!!!  He runs right full speed straight at you!!!");
                rt.write("\n", "The waves are very choppy, making it difficult to see very far.");
                rt.write("\n", "Looking overhead you see that you are still underground.");
                rt.write("\n", "There is a rock ceiling 500 feet above.");
                rt.write("\n", "There is seaweed around here.");
                rt.write("\n", "You are on the surface.");
                rt.write("\n", "You are in sea water.");
            },
        },
        {
            name: "patch_ocean_surface_desc_calm",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                atOceanUp(5),
                { cls: "object", isPositional: false, prefixLength: null, negated: true,
                  tests: [{ field: "name", op: "eq_const", value: "seamonster" },
                          { field: "alive", op: "eq_const", value: "t" }] },
            ],
            action: async () => {
                rt.write("\n", "You are on the surface.");
                rt.write("\n", "The water is calm now.");
                rt.write("\n", "To the north you can see a sandy beach.");
                rt.write("\n", "You are in sea water.");
            },
        },

        // ================= Mid-ocean description =================
        {
            name: "patch_ocean_mid_desc_1",
            priority: 1,
            sourceIndex: next(),
            conditions: [atOceanUp(1)],
            action: async () => {
                rt.write("\n", "You seem to be in a warm current of water, near the ground.");
                rt.write("\n", "There is seaweed around here.");
                rt.write("\n", "You are in sea water.");
            },
        },
        {
            name: "patch_ocean_mid_desc_2",
            priority: 1,
            sourceIndex: next(),
            conditions: [atOceanUp(2)],
            action: async () => {
                rt.write("\n", "There is seaweed around here.");
                rt.write("\n", "You are in sea water.");
            },
        },
        {
            name: "patch_ocean_mid_desc_3",
            priority: 1,
            sourceIndex: next(),
            conditions: [atOceanUp(3)],
            action: async () => {
                rt.write("\n", "There is seaweed around here.");
                rt.write("\n", "You are in sea water.");
            },
        },
        {
            name: "patch_ocean_mid_desc_4",
            priority: 1,
            sourceIndex: next(),
            conditions: [atOceanUp(4)],
            action: async () => {
                rt.write("\n", "There is seaweed around here.");
                rt.write("\n", "You are in sea water.");
            },
        },

        // ================= "Below you is an object" hint =================
        {
            name: "patch_ocean_below_object",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" }] },
            ],
            action: async (m) => {
                const loc = m.$1;
                const up = loc.up || 0;
                if (up <= 0 || up >= 5) return;
                const objs = rt.wm.classes.get("object");
                if (!objs) return;
                for (const o of objs.values()) {
                    if (o.place === "ocean" && (o.east || 0) === (loc.east || 0) && (o.up || 0) < up) {
                        rt.write("\n", "Below you is an object.");
                        return;
                    }
                }
            },
        },

        // ================= Ocean navigation =================
        // East within bottom row, cap at 3 (e=3 → cave hole east).
        {
            name: "patch_ocean_e_within_bottom",
            priority: 2,
            sourceIndex: next(),
            conditions: [atOceanUp(0), going("e"),
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" },
                          { field: "east", op: "eq_var", var: "e0" }] }],
            action: async (m) => {
                const cur = m.e0;
                rt.modify(m.$2, { going: null });
                if (cur >= 3) {
                    // At e=3 bottom: `e` enters cave_entry tunnel.
                    rt.modify(m.$1, { name: "cave_entry", east: null, up: null });
                } else {
                    rt.modify(m.$1, { east: cur + 1 });
                }
            },
        },
        // West — decrement east, floor at 0 (blocked at e=0 west).
        {
            name: "patch_ocean_w_within_bottom",
            priority: 2,
            sourceIndex: next(),
            conditions: [atOceanUp(0), going("w"),
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" },
                          { field: "east", op: "eq_var", var: "e0" }] }],
            action: async (m) => {
                const cur = m.e0;
                rt.modify(m.$2, { going: null });
                if (cur <= 0) {
                    rt.write("\n", "You run into the rock wall.");
                } else {
                    rt.modify(m.$1, { east: cur - 1 });
                }
            },
        },
        {
            name: "patch_get_seaweed",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                at("ocean"),
                input("get", "seaweed"),
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "The seaweed is too strong, and you can't break off a piece.");
            },
        },
        {
            name: "patch_eat_seaweed",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                at("ocean"),
                input("eat", "seaweed"),
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "Chomp! Blaaachk! The seaweed is terrible.");
            },
        },
        {
            name: "patch_get_sand_ocean",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "in_set", set: ["ocean", "beach"] }] },
                input("get", "sand"),
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "The sand falls through your fingers.");
            },
        },
        {
            name: "patch_dig_ocean",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                at("ocean"),
                input("dig"),
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "The sea bed is too hard.");
            },
        },
        // Burn seaweed with matches at ocean east=2 → opens south passage.
        // Flag stored on ocean location as `seaweed_burned: "t"`. Each ocean
        // tile's east=2 column gets its own flag via seamonster global, but
        // for simplicity we set history.seaweed_burned once — south passage
        // then open at any east=2 ocean tile. Binary likely has per-column
        // state; this is a simplification.
        {
            name: "patch_ocean_burn_seaweed",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                at("ocean"),
                input("burn", "seaweed"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "matches" },
                          { field: "place", op: "eq_const", value: "held" }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "seaweed_burned", op: "neq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.remove(m.$3);
                rt.modify(m.$4, { seaweed_burned: "t" });
                rt.write("\n", "The matches flare briefly and the seaweed burns back.");
                rt.write("\n", "A passage opens to the south.");
            },
        },
        // South — blocked by seaweed unless burned. After burn, passage opens.
        // With seaweed burned, s at east=2 ocean bottom → chest tile.
        {
            name: "patch_ocean_s_to_chest",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                atOcean(2, 0),
                going("s"),
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "seaweed_burned", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { name: "chest_tile", east: null, up: null });
            },
        },
        // South — always blocked by seaweed (matches needed to burn through).
        {
            name: "patch_ocean_s_seaweed",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("ocean"), going("s")],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "The seaweed is very thick now.");
                rt.write("\n", "The seaweed is too thick to penetrate.");
            },
        },
        // Chest tile — where octopus guards the treasure.
        {
            name: "patch_chest_tile_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [at("chest_tile")],
            action: async (m) => {
                const oct = findObj("octopus");
                const chest = findObj("chest");
                if (oct && oct.alive === "t") {
                    rt.write("\n", "A giant octopus guards a chest of treasure.");
                    rt.write("\n", "Its tentacles wave threateningly.");
                } else if (chest && chest.place === "chest_tile") {
                    rt.write("\n", "The defeated octopus drifts limply.");
                    rt.write("\n", "There is a chest of treasure!!!");
                } else {
                    rt.write("\n", "The defeated octopus drifts limply.");
                }
                rt.write("\n", "The water is very cold.");
                rt.write("\n", "You are at the south-most ocean cavern.");
            },
        },
        // Return north from chest tile → ocean (2, 0).
        {
            name: "patch_chest_tile_n",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("chest_tile"), going("n")],
            action: async (m) => {
                rt.modify(m.$1, { name: "ocean", east: 2, up: 0 });
                rt.modify(m.$2, { going: null });
            },
        },
        // Wrestle octopus at chest tile (or anywhere octopus alive) → kill it.
        {
            name: "patch_wrestle_octopus",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                input("wrestle", "octopus"),
                at("chest_tile"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "octopus" },
                          { field: "alive", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { alive: null });
                rt.write("\n", "You grab arm 1.  He gets you in a body hold.  You grab arm2.");
                rt.write("\n", "He gets you in a head hold.  You tie arm1 to arm2.");
                rt.write("\n", "With his remaining SIX arms he throws you straight up.");
                rt.write("\n", "You clear the water and notice the fine bathing beach to");
                rt.write("\n", "the north.  But you don't give up.  Down you go, deeper, deeper.");
                rt.write("\n", "You sight him again and sneak up while he is attemping to untie his legs.");
                rt.write("\n", "Quickly you try the Vulcan death grip.  Unfortunately, there is no");
                rt.write("\n", "Vulcan death grip, but that does not stop you.");
                rt.write("\n", "He is about to turn on you and squeeze you to death when you");
                rt.write("\n", "remember the overhand octopus knot, and tie up arms 3 4 5 6 7 and 8.");
                rt.write("\n", "He appears disgruntled and swims away.");
            },
        },
        // help Cecil help at chest_tile with octopus alive → Cecil refuses.
        // Binary: "Cecil doesn't mess with octopus, you're going to have to handle it yourself."
        {
            name: "patch_chest_help_cecil_octopus",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 3, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "help" },
                          { index: 1, op: "eq_const", value: "cecil" },
                          { index: 2, op: "eq_const", value: "help" }] },
                at("chest_tile"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "octopus" },
                          { field: "alive", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Cecil doesn't mess with octopus, you're going to have to handle it yourself.");
            },
        },
        // Spawn chest object at chest_tile when player arrives (so generic
        // get-rule can see it). Fire once per visit.
        {
            name: "patch_chest_move_to_tile",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                at("chest_tile"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "chest" },
                          { field: "place", op: "eq_const", value: "ocean" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { place: "chest_tile", side: null, east: null, north: null, up: null, south: null });
            },
        },
        // tie rope to chest at chest_tile with octopus dead + rope held + chest at chest_tile.
        {
            name: "patch_tie_rope_chest_ok",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                input("tie", "rope", "to", "chest"),
                at("chest_tile"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "rope" },
                          { field: "place", op: "eq_const", value: "held" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "chest" },
                          { field: "place", op: "neq_const", value: "held" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "octopus" },
                          { field: "alive", op: "neq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { tied: "chest" });
                rt.write("\n", "You tie the rope tightly around the chest.");
            },
        },
        // pull rope at bathysphere: hauls chest up from ocean/chest_tile to bathysphere.
        {
            name: "patch_pull_rope_chest",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                at("bathysphere"),
                input("pull", "rope"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "rope" },
                          { field: "place", op: "eq_const", value: "held" },
                          { field: "tied", op: "eq_const", value: "chest" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "chest" },
                          { field: "place", op: "in_set", set: ["chest_tile", "ocean"] }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.modify(m.$4, { place: "bathysphere", side: null, east: null, north: null, up: null, south: null });
                rt.write("\n", "You pull the rope and haul the chest through the water.");
                rt.write("\n", "The chest arrives at the bathysphere airlock.");
            },
        },
        // Up — ascend from bottom if no coins (weight). Always lands at surface u=5.
        {
            name: "patch_ocean_u_from_bottom",
            priority: 2,
            sourceIndex: next(),
            conditions: [atOceanUp(0), going("u")],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                if (coinsHeld()) {
                    rt.write("\n", "You weigh too much, you drop back to the bottom.");
                } else {
                    rt.modify(m.$1, { up: 5 });
                }
            },
        },
        // Down from surface → bottom (same east column).
        {
            name: "patch_ocean_d_from_surface",
            priority: 2,
            sourceIndex: next(),
            conditions: [atOceanUp(5), going("d")],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.modify(m.$1, { up: 0 });
            },
        },
        // Down at bottom → "already at bottom".
        {
            name: "patch_ocean_d_at_bottom",
            priority: 1,
            sourceIndex: next(),
            conditions: [atOceanUp(0), going("d")],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "You can't go through the sea floor");
            },
        },
        // Up from surface → "already at surface".
        {
            name: "patch_ocean_u_at_surface",
            priority: 1,
            sourceIndex: next(),
            conditions: [atOceanUp(5), going("u")],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "You can't go any higher, you're at the surface.");
            },
        },
        // n from bottom @ (e=0, u=0) → back into bathysphere. Elsewhere blocked.
        {
            name: "patch_ocean_n_to_bathysphere",
            priority: 3,
            sourceIndex: next(),
            conditions: [atOcean(0, 0), going("n")],
            action: async (m) => {
                rt.modify(m.$1, { name: "bathysphere", east: null, up: null });
                rt.modify(m.$2, { going: null });
            },
        },
        // n from any other bottom tile → nothing (no movement).
        {
            name: "patch_ocean_n_bottom_blocked",
            priority: 2,
            sourceIndex: next(),
            conditions: [atOceanUp(0), going("n")],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "You can't go that way.");
            },
        },
        // n from surface @ e=3 (with monster dead) → beach entry @ east=3.
        {
            name: "patch_ocean_surface_n_to_beach",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                atOcean(3, 5), going("n"),
                { cls: "object", isPositional: false, prefixLength: null, negated: true,
                  tests: [{ field: "name", op: "eq_const", value: "seamonster" },
                          { field: "alive", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { name: "beach", east: 3, up: null });
                rt.modify(m.$2, { going: null });
            },
        },
        // n from surface with monster alive → eaten → drown sequence.
        {
            name: "patch_ocean_surface_n_monster_eats",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                atOceanUp(5), going("n"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "seamonster" },
                          { field: "alive", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                rt.write("\n", "As you try and flee, you chicken, the sea monster eats you.  Yum yum.");
                drownToDarkHall(m.$1);
            },
        },

        // ================= shoot monster =================
        // Requires: at ocean surface, input "shoot monster", speargun held.
        {
            name: "patch_ocean_shoot_monster",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                input("shoot", "monster"),
                atOceanUp(5),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "seamonster" },
                          { field: "alive", op: "eq_const", value: "t" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "speargun" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { alive: "nil" });
                rt.modify(m.$4, { state: "unloaded" });
                rt.write("\n", "You slay the monster.");
            },
        },
        // shoot monster without speargun.
        {
            name: "patch_ocean_shoot_monster_unarmed",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                input("shoot", "monster"),
                atOceanUp(5),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You have nothing to shoot it with.");
            },
        },

        // shoot speargun in ocean (miss) — no specific target.
        {
            name: "patch_ocean_shoot_speargun_miss",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "shoot" },
                          { index: 1, op: "eq_const", value: "speargun" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "speargun" },
                          { field: "place", op: "eq_const", value: "held" },
                          { field: "state", op: "eq_const", value: "loaded" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You missed whatever you shot at.");
            },
        },

        // Non-combat action with monster → monster eats a held item.
        {
            name: "patch_ocean_monster_wastes_time",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_var", var: "verb" },
                          { index: 1, op: "eq_const", value: "monster" }] },
                atOceanUp(5),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "seamonster" },
                          { field: "alive", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                const held = rt.wm.all("object").filter(o => o.place === "held" && o.name !== "wetsuit");
                if (held.length > 0) {
                    const victim = held[0];
                    rt.remove(victim);
                    rt.write("\n", "While you were wasting your time trying to " + m.verb + " the seamonster, he attacked!");
                    rt.write("\n", "You avoided him, but he ate your " + victim.name + ".");
                    rt.write("\n", "You better come up with another idea.");
                } else {
                    rt.write("\n", "While you were wasting your time trying to " + m.verb + " the seamonster, he attacked!");
                    rt.write("\n", "You avoided him, but you better come up with another idea.");
                }
            },
        },

        // ================= Items float away in water =================
        {
            name: "patch_ocean_drop_bottle",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                input("drop", "bottle"),
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "bottle" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.remove(m.$3);
                rt.write("\n", "The bottle disappears as it floats away.");
            },
        },
        {
            name: "patch_ocean_drop_football",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                input("drop", "football"),
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "football" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.remove(m.$3);
                rt.write("\n", "The football disappears as it floats away.");
            },
        },

        // drop stool in ocean → floats away (buoyant).
        {
            name: "patch_ocean_drop_stool",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                input("drop", "stool"),
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "stool" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.remove(m.$3);
                rt.write("\n", "The stool floats up and away.");
            },
        },

        // ================= Items destroyed by water =================
        {
            name: "patch_ocean_painting_destroyed",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "painting" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "The water destroys the painting, it disappears.");
            },
        },

        {
            name: "patch_ocean_soap_dissolves",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "ocean" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "soap" },
                          { field: "place", op: "eq_const", value: "held" }] },
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "The soap dissolves in the water.");
                rt.write("\n", "You are left with a gem.");
                rt.make("object", { name: "gem", place: "held", treasure: "t" });
            },
        },

        // ================= Cave entry =================
        {
            name: "patch_cave_entry_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [at("cave_entry")],
            action: async () => {
                rt.write("\n", "You are in a small tunnel in the rock wall.");
                rt.write("\n", "It is very hot, but you are protected by your magic wetsuit.");
                rt.write("\n", "It is too dark to see, so you must guess at directions.");
            },
        },
        {
            name: "patch_cave_entry_w",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("cave_entry"), going("w")],
            action: async (m) => {
                rt.modify(m.$1, { name: "ocean", east: 3, up: 0 });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_cave_entry_d",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("cave_entry"), going("d")],
            action: async (m) => {
                rt.modify(m.$1, { name: "black_water" });
                rt.modify(m.$2, { going: null });
            },
        },

        // ================= Black water =================
        {
            name: "patch_black_water_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [at("black_water")],
            action: async () => {
                rt.write("\n", "You are in water that is completely black.");
            },
        },
        {
            name: "patch_black_water_u",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("black_water"), going("u")],
            action: async (m) => {
                rt.modify(m.$1, { name: "cave_entry" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_black_water_w",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("black_water"), going("w")],
            action: async (m) => {
                rt.modify(m.$1, { name: "toasty_cave" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_black_water_e",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("black_water"), going("e")],
            action: async (m) => {
                rt.modify(m.$1, { name: "eel_chamber" });
                rt.modify(m.$2, { going: null });
                // Eel snatches speargun on entry.
                const sp = findObj("speargun");
                if (sp && sp.place === "held") {
                    rt.modify(sp, { place: "lost" });
                    rt.write("\n", "Something grabs the speargun from you and tosses it away.");
                }
            },
        },

        // ================= Toasty cave =================
        {
            name: "patch_toasty_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [at("toasty_cave")],
            action: async () => {
                rt.write("\n", "It's quite toasty here.");
                rt.write("\n", "The water is very warm here.");
            },
        },
        {
            name: "patch_toasty_e",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("toasty_cave"), going("e")],
            action: async (m) => {
                rt.modify(m.$1, { name: "black_water" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_toasty_n",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("toasty_cave"), going("n")],
            action: async (m) => {
                rt.modify(m.$1, { name: "hot_spring" });
                rt.modify(m.$2, { going: null });
            },
        },

        // ================= Hot spring =================
        {
            name: "patch_hot_spring_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [at("hot_spring")],
            action: async () => {
                rt.write("\n", "You are in the middle of a hot spring.");
                rt.write("\n", "Above you is light.");
            },
        },
        {
            name: "patch_hot_spring_s",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("hot_spring"), going("s")],
            action: async (m) => {
                rt.modify(m.$1, { name: "toasty_cave" });
                rt.modify(m.$2, { going: null });
            },
        },
        {
            name: "patch_hot_spring_u",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("hot_spring"), going("u")],
            action: async (m) => {
                rt.modify(m.$1, { name: "warm_cave" });
                rt.modify(m.$2, { going: null });
                // Move diamonds into warm_cave on first visit. (rules.generated.js
                // spawns them at the placeholder "cave" — relocate here.)
                const d = findObj("diamonds");
                if (d && d.place !== "warm_cave" && d.place !== "held") {
                    rt.modify(d, { place: "warm_cave" });
                } else if (!d) {
                    rt.make("object", { name: "diamonds", place: "warm_cave", treasure: "t" });
                }
            },
        },

        // ================= Warm cave =================
        {
            name: "patch_warm_cave_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [at("warm_cave")],
            action: async () => {
                rt.write("\n", "You are in a warm cave. There is a hot spring down below.");
                rt.write("\n", "The PLACE is lit with luminous moss. The only way out is by");
                rt.write("\n", "the spring. There is a rusted old diving helmet on the ground");
                rt.write("\n", "that is immovable. Next to it is a skeleton and a note scrawled");
                rt.write("\n", "on the wall.");
                rt.write("\n", "Dear B___ie,");
                rt.write("\n", "I ran out of air and had to come here. The moss isn't");
                rt.write("\n", "nutritious enough to survive on. I hope you can use the diamonds.");
                rt.write("\n", "Take care of _ec_l and he will take care up you.");
                rt.write("\n", "Diver Dan");
            },
        },
        {
            name: "patch_warm_cave_d",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("warm_cave"), going("d")],
            action: async (m) => {
                rt.modify(m.$1, { name: "hot_spring" });
                rt.modify(m.$2, { going: null });
            },
        },

        // ================= Eel chamber =================
        // On entry: speargun auto-stripped (done in black_water_e). Player
        // has ONE input to say `help cecil help`, else eel eats them.
        // Cecil must already be summoned (blow conch at beach) to be
        // available. Without Cecil, `help cecil help` still works per probe
        // — the summoning via conch is a prerequisite for beach puzzle but
        // the cecil_summoned flag makes it available globally.
        {
            name: "patch_eel_chamber_desc",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                at("eel_chamber"),
            ],
            action: async () => {
                const eel = findObj("eel");
                const hist = rt.wm.first("history");
                const cecilHere = hist && hist.cecil_at_eel === "t";
                if (!eel || eel.alive === "t") {
                    if (!eel) {
                        rt.make("object", { name: "eel", alive: "t", place: "eel_chamber" });
                    }
                    rt.write("\n", "The water is a little cooler here.");
                    rt.write("\n", "There is a vicious eel here. He grabs you and starts squeezing.");
                    rt.write("\n", "You have time for one last request.");
                } else if (cecilHere) {
                    rt.write("\n", "The water is a little cooler here.");
                    rt.write("\n", "There is a large sea serpent here. He looks friendly");
                    rt.write("\n", "and he 'slurp!' licks your face.");
                }
            },
        },
        // help cecil help (Cecil summoned) — rescue.
        {
            name: "patch_eel_help_cecil_rescue",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 3, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "help" },
                          { index: 1, op: "eq_const", value: "cecil" },
                          { index: 2, op: "eq_const", value: "help" }] },
                at("eel_chamber"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "eel" },
                          { field: "alive", op: "eq_const", value: "t" }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "cecil_summoned", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { alive: "nil", place: "lost" });
                rt.write("\n", "'I'm coming Beanie boy!'");
                rt.write("\n", "Cecil grabs the eel by the neck and hurls it away.");
                rt.write("\n", "There is a large sea serpent here. He looks friendly");
                rt.write("\n", "and he 'slurp!' licks your face.");
                if (!findObj("pearls")) {
                    rt.make("object", { name: "pearls", place: "eel_chamber", treasure: "t" });
                }
                const hist = rt.wm.first("history");
                if (hist) rt.modify(hist, { cecil_at_eel: "t" });
            },
        },
        // help Cecil help after Cecil already killed the eel → "Cecil is already here."
        {
            name: "patch_eel_help_cecil_already_here",
            priority: 4,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 3, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "help" },
                          { index: 1, op: "eq_const", value: "cecil" },
                          { index: 2, op: "eq_const", value: "help" }] },
                at("eel_chamber"),
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "cecil_at_eel", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Cecil is already here.");
            },
        },
        // help cecil help without summoning → "i don't feel like helping you."
        {
            name: "patch_eel_help_cecil_unsummoned",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 3, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "help" },
                          { index: 1, op: "eq_const", value: "cecil" },
                          { index: 2, op: "eq_const", value: "help" }] },
                at("eel_chamber"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "'I don't feel like helping you.'");
                // Fall through to eel-kills next cycle via blocked-input rule.
            },
        },
        // Any input at eel_chamber with eel alive → eaten (after a chance
        // for rescue has passed). Priority 1 so rescue (3) beats it.
        {
            name: "patch_eel_chamber_eaten",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 1, negated: false,
                  tests: [{ index: 0, op: "eq_var", var: "_tok0" }] },
                at("eel_chamber"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "eel" },
                          { field: "alive", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You feel his teeth sink in and you hear a crunch.");
                drownToDarkHall(m.$2);
            },
        },
        // After Cecil kills the eel: nav.
        {
            name: "patch_eel_chamber_w",
            priority: 2,
            sourceIndex: next(),
            conditions: [at("eel_chamber"), going("w"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "eel" },
                          { field: "alive", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.modify(m.$1, { name: "black_water" });
                rt.modify(m.$2, { going: null });
            },
        },

        // ================= Beach =================
        {
            name: "patch_beach_desc_e3",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_const", value: 3 }] },
            ],
            action: async () => {
                rt.write("\n", "You are on the white sands of a beautiful beach that runs east west.");
                rt.write("\n", "To the north are unclimbable cliffs.");
                rt.write("\n", "You have come to a hard stone cliff.");
                rt.write("\n", "There is cool sand beneath your feet.");
            },
        },
        {
            name: "patch_beach_desc_e2",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_const", value: 2 }] },
            ],
            action: async () => {
                rt.write("\n", "You are on the white sands of a beautiful beach that runs east west.");
                rt.write("\n", "To the north are unclimbable cliffs.");
                rt.write("\n", "There is cool sand beneath your feet.");
            },
        },
        {
            name: "patch_beach_desc_e1",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_const", value: 1 }] },
            ],
            action: async () => {
                rt.write("\n", "There is cool sand beneath your feet.");
            },
        },
        {
            name: "patch_beach_desc_e0",
            priority: 1,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_const", value: 0 }] },
            ],
            action: async () => {
                rt.write("\n", "You have come across a pool of water.");
                rt.write("\n", "There are words saying 'unta o out' on the side.");
                rt.write("\n", "There is cool sand beneath your feet.");
            },
        },
        // Fountain of Youth death trap: bare `drink` at beach east=0.
        {
            name: "patch_fountain_drink_death",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_const", value: 0 }] },
                input("drink"),
            ],
            action: async (m) => {
                rt.remove(m.$2);
                rt.write("\n", "The water tastes cool and refreshing.");
                rt.write("\n", "I like to drink wa wa. Um Um. goo goo poo touh goo moo.");
                rt.write("\n", "(I think you're a little too young to continue this adventure.)");
                rt.write("\n", "Neptune appears and blows new life in your body!");
                rt.write("\n", "You return to life but neptune doesn't want you back in his world again.");
                rt.modify(m.$1, { name: "dark_hall", side: null, east: null, north: null, up: null });
                const place = [...(rt.wm.classes.get("place")?.values() ?? [])]
                    .find(p => p.name === "dark_hall");
                if (place) rt.modify(place, { visited: null });
                const status = rt.wm.first("status");
                if (status) rt.modify(status, {
                    score: (status.score || 0) - 20,
                    died: "t",
                });
                const elevator = [...(rt.wm.classes.get("object")?.values() ?? [])]
                    .find(o => o.name === "elevator");
                if (elevator) rt.modify(elevator, { state: "broken" });
            },
        },
        // Beach nav: east-west, with `s` at e=3 returning to ocean surface.
        {
            name: "patch_beach_e",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_var", var: "e0" }] },
                going("e"),
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                if (m.e0 >= 3) {
                    rt.write("\n", "You run into the rock cliff.");
                } else {
                    rt.modify(m.$1, { east: m.e0 + 1 });
                }
            },
        },
        {
            name: "patch_beach_w",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_var", var: "e0" }] },
                going("w"),
            ],
            action: async (m) => {
                rt.modify(m.$2, { going: null });
                if (m.e0 <= 0) {
                    rt.write("\n", "You lose, the way is blocked.");
                } else {
                    rt.modify(m.$1, { east: m.e0 - 1 });
                }
            },
        },
        {
            name: "patch_beach_s_to_surface",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_const", value: 3 }] },
                going("s"),
            ],
            action: async (m) => {
                rt.modify(m.$1, { name: "ocean", east: 3, up: 5 });
                rt.modify(m.$2, { going: null });
            },
        },

        // ================= Fountain of Youth water =================
        // Binary name225 (OPS4) fires at beach east=3 with empty bottle held
        // and input `fill bottle X` (3 tokens). In our MEA conflict
        // resolver, the generated rule loses to the fallback name231
        // because name231's non-x first condition matches a newer WME.
        // This patch asserts priority so the fountain always wins at
        // beach east=3. Accepts both `fill bottle` and `fill bottle X`.
        {
            name: "patch_fountain_fill",
            priority: 4,
            sourceIndex: next(),
            conditions: [
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_const", value: 3 }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "bottle" },
                          { field: "place", op: "eq_const", value: "held" }] },
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "fill" },
                          { index: 1, op: "eq_const", value: "bottle" }] },
                { cls: "object", isPositional: false, prefixLength: null, negated: true,
                  tests: [{ field: "inside", op: "eq_const", value: "bottle" }] },
            ],
            action: async (m) => {
                rt.remove(m.$3);
                rt.make("object", { name: "water", inside: "bottle", xscore: "nil" });
                rt.write("\n", "The bottle is full of sparkling water.");
                // Award +15 find bonus explicitly (water is a treasure per casa walkthrough
                // but scored via the special bottle+water rule instead of via name0320).
                const status = rt.wm.first("status");
                if (status) rt.modify(status, { score: (status.score || 0) + 15 });
            },
        },

        // ================= Dig → conch =================
        {
            name: "patch_beach_dig_e2",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                input("dig"),
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" },
                          { field: "east", op: "eq_const", value: 2 }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                const conch = findObj("conch");
                if (!conch) {
                    rt.make("object", { name: "conch", place: "beach", east: 2, treasure: "t" });
                } else {
                    rt.write("\n", "You just dig up more sand.");
                }
            },
        },
        {
            name: "patch_beach_dig_other",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                input("dig"),
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "beach" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "You just dig up more sand.");
            },
        },

        // ================= Sandcastle build/destroy =================
        {
            name: "patch_build_sandcastle",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                input("build", "sandcastle"),
                at("beach"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "There is an elegant sandcastle on the beach.");
                rt.write("\n", "You don't find anything under the sand.");
            },
        },
        {
            name: "patch_make_sandcastle",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                input("make", "sandcastle"),
                at("beach"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The sandcastle is destroyed. There is only sand.");
            },
        },

        // ================= Blow conch in ocean → "Blaaat!" =================
        {
            name: "patch_blow_conch_ocean",
            priority: 4,
            sourceIndex: next(),
            conditions: [
                input("blow", "conch"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "conch" },
                          { field: "place", op: "eq_const", value: "held" }] },
                at("ocean"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Blaaat! You are in the ocean, and can't blow it well.");
            },
        },
        // ================= Blow conch at beach → summon Cecil =================
        {
            name: "patch_blow_conch",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                input("blow", "conch"),
                { cls: "object", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "conch" },
                          { field: "place", op: "eq_const", value: "held" }] },
                at("beach"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                const hist = rt.wm.first("history");
                const summoned = hist && hist.cecil_summoned === "t";
                rt.write("\n", "'Toot!! Toot!!'");
                if (!summoned) {
                    rt.write("\n", "The water near the beach begins to bubble.");
                    rt.write("\n", "A large form emerges from the foam.");
                    rt.write("\n", "There is a large sea serpent here.");
                    rt.write("\n", "He looks friendly and he 'slurp!' licks your face.");
                    if (hist) rt.modify(hist, { cecil_summoned: "t" });
                    else rt.make("history", { cecil_summoned: "t" });
                } else {
                    rt.write("\n", "The water near the beach begins to bubble.");
                    rt.write("\n", "A large form emerges from the foam.");
                }
            },
        },
        // blow conch without holding it.
        {
            name: "patch_blow_conch_missing",
            priority: 2,
            sourceIndex: next(),
            conditions: [input("blow", "conch")],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Whoooooosh!");
            },
        },
        // Cecil is present at beach after summoning — show him.
        {
            name: "patch_beach_cecil_present",
            priority: 0,
            sourceIndex: next(),
            conditions: [
                at("beach"),
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "cecil_summoned", op: "eq_const", value: "t" }] },
            ],
            action: async () => {
                rt.write("\n", "There is a large sea serpent here.");
                rt.write("\n", "He looks friendly and he 'slurp!' licks your face.");
            },
        },

        // ================= pet cecil =================
        {
            name: "patch_pet_cecil",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "pet" },
                          { index: 1, op: "eq_const", value: "cecil" }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "cecil_summoned", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "'Hi Beanie Boy.'");
            },
        },
        // get cecil → "free spirit"
        {
            name: "patch_get_cecil",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "in_set", set: ["get", "take"] },
                          { index: 1, op: "eq_const", value: "cecil" }] },
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "cecil_summoned", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Cecil is a free spirit.  He doesn't come with you.");
            },
        },
        {
            name: "patch_serpent_wrong_name",
            priority: 3,
            sourceIndex: next(),
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 1, op: "eq_const", value: "serpent" }] },
                at("beach"),
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "cecil_summoned", op: "eq_const", value: "t" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "The sea serpent should be address by its real name.");
            },
        },
        {
            name: "patch_ocean_swim_no_direction",
            priority: 2,
            sourceIndex: next(),
            conditions: [
                input("swim"),
                at("ocean"),
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.write("\n", "Just give me a direction and we will swim that way.");
            },
        },
    ];
}

function gateEntryPatches(rt, nextIdx) {
    const pressRule = (n, prevPresses, text, stateUpdate = {}) => ({
        name: `patch_gate_press_${n}`,
        priority: 5,
        sourceIndex: nextIdx + 80 + n,
        conditions: [
            { cls: "input", isPositional: true, prefixLength: 2, negated: false,
              tests: [
                  { index: 0, op: "in_set", set: ["press", "push"] },
                  { index: 1, op: "eq_const", value: "button" },
              ] },
            EAST_GATE_LOC,
            { cls: "history", isPositional: false, prefixLength: null, negated: false,
              tests: [{ field: "gate_presses", op: "eq_const", value: prevPresses }] },
        ],
        action: async (m, wm, term) => {
            rt.remove(m.$1);
            rt.modify(m.$3, { gate_presses: String(n), ...stateUpdate });
            for (const line of text) rt.write("\n", line);
        },
    });

    const dialogRule = (name, stateWhen, inputTest, action) => ({
        name: `patch_gate_${name}`,
        priority: 5,
        sourceIndex: nextIdx + 90 + name.charCodeAt(0),
        conditions: [
            inputTest,
            { cls: "history", isPositional: false, prefixLength: null, negated: false,
              tests: [{ field: "gate_state", op: "eq_const", value: stateWhen }] },
            { cls: "location", isPositional: false, prefixLength: null, negated: false,
              tests: [{ field: "name", op: "eq_var", var: "__loc" }] },
        ],
        action,
    });

    const yesInput = { cls: "input", isPositional: true, prefixLength: 1, negated: false,
        tests: [{ index: 0, op: "in_set", set: ["yes", "y"] }] };
    const noInput = { cls: "input", isPositional: true, prefixLength: 1, negated: false,
        tests: [{ index: 0, op: "in_set", set: ["no", "n"] }] };
    const anyInput = { cls: "input", isPositional: true, prefixLength: 1, negated: false, tests: [] };

    const KNOWN_NAMES = new Set([
        "abby", "adam", "alan", "alex", "alfred", "allan", "allen", "andrew",
        "andy", "anita", "anne", "annie", "anoop", "april", "arnold", "arthur",
        "audrey", "babs", "barbara", "basil", "becky", "benjamin", "bert",
        "bess", "beth", "betsy", "betty", "bill", "bob", "bonnie", "brenda",
        "bridget", "bunny", "burt", "carl", "carol", "carole", "carrie",
        "cathy", "cheryl", "christine", "cindy", "claudine", "cleopatra",
        "connie", "cynthia", "dan", "danny", "dave", "david", "dawn", "dean",
        "debby", "deborah", "dick", "donal", "dorothy", "dotty", "doug",
        "douglas", "drew", "dwight", "edward", "elaine", "elizabeth", "emily",
        "ernie", "eunice", "frank", "fred", "gail", "gene", "gerry", "gloria",
        "greg", "harold", "harry", "harvey", "heather", "helen", "henry",
        "howard", "hugh", "jack", "jackie", "jacqueline", "jade", "james",
        "jane", "janet", "janice", "jean", "jeff", "jennifer", "jenny",
        "jerry", "jessica", "jessie", "jill", "joan", "jody", "john",
        "joseph", "josephine", "joyce", "judith", "judy", "julie", "kady",
        "karen", "karol", "kate", "katherine", "kathy", "kay", "kenneth",
        "kirk", "kitty", "larry", "laura", "laverne", "leroy", "lester",
        "linda", "lisa", "liza", "lois", "loretta", "lou", "louis", "louise",
        "lucille", "lyle", "mable", "mack", "maggie", "margaret", "marcia",
        "marge", "marie", "marilyn", "marjorie", "mark", "marvin", "mary",
        "mathew", "matt", "maud", "melissa", "michael", "michelle", "mickey",
        "mike", "mildred", "miles", "mindy", "mitch", "mitchell", "molly",
        "monica", "morris", "nancy", "nathaniel", "nick", "pamela", "patricia",
        "patty", "paul", "paula", "pauline", "pedro", "peggy", "penny", "pete",
        "peter", "phil", "philip", "phillip", "rachel", "ralph", "raoul",
        "raymond", "rebecca", "rich", "richard", "rick", "robin", "robert",
        "roberta", "rodney", "roger", "roman", "rosie", "ross", "roxanne",
        "russell", "rusty", "ruth", "sally", "sandra", "sarah", "satish",
        "sharon", "sheila", "sherry", "sheryl", "shirley", "stephanie",
        "steven", "stuart", "sue", "susan", "suzanne", "sylvia", "thomas",
        "timothy", "tom", "tommy", "tony", "trudy", "victor", "vicky",
        "violet", "virginia", "wally", "walter", "vincent", "william",
    ]);

    const TRIVIA_POOL = [
        { q: "'What was the first production system with more than 1500 productions?'", a: "haunt" },
        { q: "'What is the capital of Assyria?'", a: "nineveh" },
        { q: "'What shipping lines owned the Titanic?'", a: "white" },
        { q: "'What is the full name (first middle and last) of the first test-tube baby?'", a: "louise" },
        { q: "'What will permanently rob Superman of his powers?'", a: "kryptonite" },
    ];

    function pickAndAskTrivia(history) {
        const visits = parseInt(history.trivia_visits || "0", 10);
        const idx = visits % TRIVIA_POOL.length;
        rt.modify(history, { trivia_q: String(idx), trivia_visits: String(visits + 1) });
        rt.write("\n", TRIVIA_POOL[idx].q);
    }

    return [
        // --- Press 1..3: progressive wake-up sounds ---
        pressRule(1, "nil", ["'ZZZZZZZ CracKLe ZZZZZZZZZ'"]),
        pressRule(2, "1", ["'ZZZZZZZZ, snort snort ZZZZZZZ'"]),
        pressRule(3, "2", ["'Meep, ZZzz, Go AWAY!!  Leave me alone!, ZZZT'"]),
        // --- Press 4: attendant wakes and opens dialog ---
        pressRule(4, "3", [
            "'Alright, alright.  Stop pressing that damn buzzer!'",
            "'There is a microphone there so I can hear anything you say.'",
            "'How did you get here, on that stupid bus?'",
        ], { gate_state: "await_bus" }),
        // --- Press 5: punishment — teleport to bus stop ---
        {
            name: "patch_gate_press_5",
            priority: 5,
            sourceIndex: nextIdx + 86,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "in_set", set: ["press", "push"] },
                      { index: 1, op: "eq_const", value: "button" },
                  ] },
                EAST_GATE_LOC,
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "gate_presses", op: "eq_const", value: "4" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "'That's it!! You've pressed my buzzer once too often.'");
                rt.write("\n", "'I guess you must love that bus stop.'");
                kickToBusStop(rt, m.$2, m.$3);
            },
        },
        // --- Dialog Q1: "got here by bus?" ---
        dialogRule("q1_yes", "await_bus", yesInput, async (m) => {
            rt.remove(m.$1);
            rt.modify(m.$2, { gate_state: "await_survive" });
            rt.write("\n", "'I thought so. Mumble. I suppose you think you can survive");
            rt.write("\n", "in Chez Moose for a night without going crazy and find mucho treasure?'");
        }),
        dialogRule("q1_no", "await_bus", noInput, async (m) => {
            rt.remove(m.$1);
            kickToBusStop(rt, m.$3, m.$2, "'Then how did you get here? Bah! Go away.'");
        }),
        // --- Dialog Q2: "survive Chez Moose?" ---
        dialogRule("q2_yes", "await_survive", yesInput, async (m) => {
            rt.remove(m.$1);
            rt.modify(m.$2, { gate_state: "await_want_in" });
            rt.write("\n", "'So I guess you want to come in the gate, don't you?'");
        }),
        dialogRule("q2_no", "await_survive", noInput, async (m) => {
            rt.remove(m.$1);
            kickToBusStop(rt, m.$3, m.$2, "'Smart turkey. Go home.'");
        }),
        // --- Dialog Q3: "want to come in?" ---
        dialogRule("q3_yes", "await_want_in", yesInput, async (m) => {
            rt.remove(m.$1);
            rt.modify(m.$2, { gate_state: "await_name" });
            rt.write("\n", "'In order for you to enter you must first answer three questions!'");
            rt.write("\n", "'First, what is your name?'");
        }),
        dialogRule("q3_no", "await_want_in", noInput, async (m) => {
            rt.remove(m.$1);
            kickToBusStop(rt, m.$3, m.$2,
                "'Then leave me alone, you turkey.  Good night!!  Enjoy the bus stop.'");
        }),
        // --- Admission Q1: name (any input accepted) ---
        dialogRule("q_name", "await_name", anyInput, async (m) => {
            const nameTokens = m.$1.tokens || [];
            rt.remove(m.$1);
            const status = rt.wm.first("status");
            if (status) rt.modify(status, { player_name: nameTokens.join(" ") });
            const firstName = (nameTokens[0] || "").toLowerCase();
            if (KNOWN_NAMES.has(firstName)) {
                rt.modify(m.$2, { gate_state: "await_quest_v1" });
                rt.write("\n", "'Second, what is your quest?'");
            } else {
                rt.modify(m.$2, { gate_state: "await_sex" });
                rt.write("\n", "'Second, which sex (male, female, ...) interests you sexually'");
            }
        }),
        // --- Admission Q2a: quest (for recognized names) ---
        dialogRule("q_quest_v1", "await_quest_v1", anyInput, async (m) => {
            rt.remove(m.$1);
            const tokens = m.$1.tokens || [];
            const answer = tokens.join(" ");
            let response;
            if (answer.includes("holy") && answer.includes("grail") && answer.includes("seek")) {
                response = "'I always wanted to do that. I hope you don't go insane trying.'";
            } else if (answer.includes("holy") && answer.includes("grail")) {
                response = "'Well, I can assure you that you won't find it here.'\n'But you're welcome to try, if you don't go insane first.'";
            } else if (answer.includes("grail")) {
                response = "'I always wanted to do that. I hope you don't go insane trying.'";
            } else if (answer.includes("treasure")) {
                response = "'There's lots of that around, all you have to do is find it.'";
            } else {
                response = "'I always wanted to do that. I hope you don't go insane trying.'";
            }
            for (const line of response.split("\n")) rt.write("\n", line);
            rt.modify(m.$2, { gate_state: "await_trivia" });
            pickAndAskTrivia(m.$2);
        }),
        // --- Admission Q2: sex (any input) ---
        dialogRule("q_sex", "await_sex", anyInput, async (m) => {
            const answer = (m.$1.tokens && m.$1.tokens[0]) || "none";
            rt.remove(m.$1);
            const status = rt.wm.first("status");
            if (answer === "both") {
                rt.write("\n", "'A little AC-DC huh? OK, but for this adventure pick one.'");
                rt.write("\n", "'Second, which sex (male, female, ...) interests you sexually'");
                return;
            }
            rt.modify(m.$2, { gate_state: "await_trivia" });
            let likes = answer;
            let sexLine;
            if (answer === "male") {
                likes = "male";
                sexLine = "'I assume that is a human male.'";
            } else if (answer === "boy") {
                likes = "male";
                sexLine = "'Can't handle a man I guess.'";
            } else if (answer === "girl") {
                likes = "female";
                sexLine = "'Can't handle a woman!'";
            } else if (answer === "moose") {
                likes = "moose";
                sexLine = "'Hmm, so you like a mate with a good rack.'";
            } else {
                sexLine = "'Your mother would faint if she knew that.'";
            }
            if (status) rt.modify(status, { likes });
            rt.write("\n", sexLine);
            pickAndAskTrivia(m.$2);
        }),
        // --- Bite-token name answer ---
        dialogRule("bite_name", "bite_await_name", anyInput, async (m) => {
            const nameTokens = m.$1.tokens || [];
            rt.remove(m.$1);
            const status = rt.wm.first("status");
            if (status) rt.modify(status, { player_name: nameTokens.join(" ") });
            const firstName = (nameTokens[0] || "").toLowerCase();
            if (KNOWN_NAMES.has(firstName)) {
                rt.modify(m.$2, { gate_state: "done" });
                rt.modify(m.$3, { name: "lawn", side: "in", east: 8, north: 5 });
                rt.write("\n", "'POOF!'");
            } else {
                rt.modify(m.$2, { gate_state: "bite_await_sex" });
                rt.write("\n", "'Second, which sex (male, female, ...) interests you sexually'");
            }
        }),
        // --- Bite-token sex answer ---
        dialogRule("bite_sex", "bite_await_sex", anyInput, async (m) => {
            const answer = (m.$1.tokens && m.$1.tokens[0]) || "none";
            rt.remove(m.$1);
            const status = rt.wm.first("status");
            if (answer === "both") {
                rt.write("\n", "'A little AC-DC huh? OK, but for this adventure pick one.'");
                rt.write("\n", "'Second, which sex (male, female, ...) interests you sexually'");
                return;
            }
            let likes = answer;
            let sexLine;
            if (answer === "male") {
                likes = "male";
                sexLine = "'I assume that is a human male.'";
            } else if (answer === "boy") {
                likes = "male";
                sexLine = "'Can't handle a man I guess.'";
            } else if (answer === "girl") {
                likes = "female";
                sexLine = "'Can't handle a woman!'";
            } else if (answer === "moose") {
                likes = "moose";
                sexLine = "'Hmm, so you like a mate with a good rack.'";
            } else {
                sexLine = "'Your mother would faint if she knew that.'";
            }
            if (status) rt.modify(status, { likes });
            rt.write("\n", sexLine);
            rt.modify(m.$2, { gate_state: "done" });
            rt.modify(m.$3, { name: "lawn", side: "in", east: 8, north: 5 });
            rt.write("\n", "'POOF!'");
        }),
        // --- Admission Q3: trivia (question pool) ---
        {
            name: "patch_gate_trivia_answer",
            priority: 6,
            sourceIndex: nextIdx + 100,
            conditions: [
                anyInput,
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "gate_state", op: "eq_const", value: "await_trivia" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "lawn" }] },
            ],
            action: async (m, wm, term) => {
                const answer = (m.$1.tokens && m.$1.tokens[0]) || "";
                rt.remove(m.$1);
                const qIdx = parseInt(m.$2.trivia_q || "0", 10);
                const expected = TRIVIA_POOL[qIdx]?.a || "haunt";
                if (answer === expected) {
                    rt.modify(m.$2, { gate_state: "done" });
                    rt.modify(m.$3, { side: "in" });
                    if (qIdx > 0) {
                        const quips = [
                            "'Oops, darn, I hit the wrong button.'",
                            "'I used to know that.'",
                        ];
                        rt.write("\n", quips[qIdx % quips.length]);
                    }
                    rt.write("\n", "Correct!!");
                    rt.write("\n", "The gate opens.  You rush in and then it closes behind you.");
                    rt.write("\n", "Out of the speaker you hear, 'Now you are in, but will you ever get out?'");
                    const tokens = [...(wm.classes.get("object")?.values() ?? [])]
                        .filter(o => (o.name === "token" || o.name === "tokens") && o.place === "held");
                    for (const t of tokens) {
                        rt.write("\n", "'I'll take that gold token you've got there.'");
                        rt.write("\n", "'CHOMP!  Yep these old teeth left a mark in it.'");
                        rt.write("\n", "'Maybe next time you'll be smart enough to test it yourself.'");
                        rt.remove(t);
                        break;
                    }
                } else {
                    kickToBusStop(rt, m.$3, m.$2,
                        "Wrong!! Buzzzzz.  Don't come back til you know the answer!");
                }
            },
        },
        // === Return-visit gate sequence (after kick) ===
        // Press 1 (return): sleep text
        {
            name: "patch_gate_return_press_1",
            priority: 6,
            sourceIndex: nextIdx + 110,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "in_set", set: ["press", "push"] },
                      { index: 1, op: "eq_const", value: "button" },
                  ] },
                EAST_GATE_LOC,
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "gate_kicked", op: "eq_const", value: "t" },
                          { field: "gate_presses", op: "eq_const", value: "nil" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { gate_presses: "r1" });
                rt.write("\n", "'So it's you again, I think I'll go back to sleep and think about");
                rt.write("\n", "whether to talk to you.'");
            },
        },
        // Press 2 (return): start questions
        {
            name: "patch_gate_return_press_2",
            priority: 6,
            sourceIndex: nextIdx + 111,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [
                      { index: 0, op: "in_set", set: ["press", "push"] },
                      { index: 1, op: "eq_const", value: "button" },
                  ] },
                EAST_GATE_LOC,
                { cls: "history", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "gate_kicked", op: "eq_const", value: "t" },
                          { field: "gate_presses", op: "eq_const", value: "r1" }] },
            ],
            action: async (m) => {
                rt.remove(m.$1);
                rt.modify(m.$3, { gate_presses: "r2", gate_state: "await_name_v2" });
                rt.write("\n", "'Alright, I'll let you in if you answer three questions.'");
                rt.write("\n", "'First, what is your name?'");
            },
        },
        // Return-visit name → quest question (skips sex preference)
        dialogRule("q_name_v2", "await_name_v2", anyInput, async (m) => {
            const nameTokens = m.$1.tokens || [];
            rt.remove(m.$1);
            const status = rt.wm.first("status");
            if (status) rt.modify(status, { player_name: nameTokens.join(" ") });
            rt.modify(m.$2, { gate_state: "await_quest" });
            rt.write("\n", "'Second, what is your quest?'");
        }),
        // Quest answer → varied response + trivia question
        dialogRule("q_quest", "await_quest", anyInput, async (m) => {
            rt.remove(m.$1);
            const tokens = m.$1.tokens || [];
            const answer = tokens.join(" ");
            let response;
            if (answer.includes("holy") && answer.includes("grail") && answer.includes("seek")) {
                response = "'I always wanted to do that. I hope you don't go insane trying.'";
            } else if (answer.includes("holy") && answer.includes("grail")) {
                response = "'Well, I can assure you that you won't find it here.'\n'But you're welcome to try, if you don't go insane first.'";
            } else if (answer.includes("grail")) {
                response = "'I always wanted to do that. I hope you don't go insane trying.'";
            } else if (answer.includes("treasure")) {
                response = "'There's lots of that around, all you have to do is find it.'";
            } else {
                response = "'I always wanted to do that. I hope you don't go insane trying.'";
            }
            for (const line of response.split("\n")) rt.write("\n", line);
            rt.modify(m.$2, { gate_state: "await_trivia" });
            pickAndAskTrivia(m.$2);
        }),
    ];
}

function ivyDeathPatches(rt, nextIdx) {
    return [
        {
            name: "patch_ivy_climb_down_resurrect",
            priority: 2,
            sourceIndex: nextIdx + 320,
            conditions: [
                { cls: "input", isPositional: true, prefixLength: 2, negated: false,
                  tests: [{ index: 0, op: "eq_const", value: "climb" },
                          { index: 1, op: "eq_const", value: "down" }] },
                { cls: "location", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "name", op: "eq_const", value: "balcony" }] },
                { cls: "status", isPositional: false, prefixLength: null, negated: false,
                  tests: [{ field: "died", op: "eq_const", value: "nil" },
                          { field: "score", op: "eq_var", var: "Q" }] },
            ],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
                rt.write("\n", "I warned you that the ivy gave out up here!");
                rt.write("\n", "When you tried to leap over to get a grip, you missed!!!!");
                rt.write("\n", "Down you go");
                rt.write("\n", "           o");
                rt.write("\n", "            o");
                rt.write("\n", "             o");
                rt.write("\n", "              o.");
                rt.write("\n", "Your foot gets caught in some ivy near the bottom and you land");
                rt.write("\n", "on your head.  ");
                rt.write("\n", "Hmm...  you went and got yourself killed.");
                rt.write("\n", "But before the last neuron in your brain was destroyed, a");
                rt.write("\n", "10th level Bus driver came by and conjured up a Lazurus spell!!!");
                rt.modify(m.$3, { score: rt.compute(m.Q, "-", 20), died: "t" });
                rt.modify(m.$2, { name: "lawn", side: "out", east: 2, north: 2 });
            },
        },
    ];
}


const SAVE_KEY = "haunt:save:";
const AUTO_KEY = "haunt:autosave";

function serializeWM(wm) {
    const data = {};
    for (const [cls, bucket] of wm.classes) {
        const wmes = [];
        for (const w of bucket.values()) {
            const copy = { ...w };
            wmes.push(copy);
        }
        data[cls] = wmes;
    }
    return { version: 1, stamp: wm.stamp, nextId: wm.nextId, classes: data };
}

function restoreWM(wm, snapshot) {
    wm.classes.clear();
    wm.stamp = snapshot.stamp;
    wm.nextId = snapshot.nextId;
    for (const [cls, wmes] of Object.entries(snapshot.classes)) {
        const bucket = wm._bucket(cls);
        for (const w of wmes) {
            bucket.set(w._id, w);
        }
    }
}

export function rewriteGeneratedRules(rules, rt) {
    const stairsAtmoStamp = { last: -1 };
    const rewrites = {
        name377: async () => {
            rt.write("\n", "There is a speargun around here, the type for shooting underwater.");
        },
        name168: async (m) => {
            rt.remove(m.$2);
            rt.write("\n", "Hey, let's not mess up the PLACE!");
        },
        name2041: async (m) => {
            if (m.$1._stamp === stairsAtmoStamp.last) return;
            stairsAtmoStamp.last = m.$1._stamp;
            rt.write("\n", "The sound is coming from above you.");
        },
    };
    for (const rule of rules) {
        if (rewrites[rule.name]) rule.action = rewrites[rule.name];
    }
}

export async function runGame(term, opts = {}) {
    const wm = new WM();
    const rt = new Runtime(wm, term);
    const engine = new Engine({ rules: [], wm, term });
    const rules = createRules(rt, engine);
    rules.push(...patchRules(rt));
    rewriteGeneratedRules(rules, rt);
    engine.rules = rules;
    engine.maxCycles = 1_000_000;

    if (typeof window !== "undefined") {
        window.__haunt = { wm, engine, rt, rules };

        window.__haunt.save = (slot) => {
            const key = SAVE_KEY + (slot || 1);
            localStorage.setItem(key, JSON.stringify(serializeWM(wm)));
            engine.refracted.clear();
            return "Saved to slot " + (slot || 1);
        };
        window.__haunt.restore = (slot) => {
            const key = SAVE_KEY + (slot || 1);
            const raw = localStorage.getItem(key);
            if (!raw) return "No save in slot " + (slot || 1);
            restoreWM(wm, JSON.parse(raw));
            engine.refracted.clear();
            return "Restored from slot " + (slot || 1);
        };
        window.__haunt.autosave = () => {
            localStorage.setItem(AUTO_KEY, JSON.stringify(serializeWM(wm)));
        };
    }

    if (typeof window !== "undefined") {
        const origReadLine = term.readLine.bind(term);
        term.readLine = async function () {
            if (window.__haunt && window.__haunt.autosave) {
                try { window.__haunt.autosave(); } catch (_) {}
            }
            return origReadLine();
        };
    }

    if (opts.snapshot) {
        restoreWM(wm, opts.snapshot);
        engine.refracted.clear();
    } else {
        wm.make("start", []);
    }

    try {
        await engine.run();
    } catch (e) {
        if (!/input exhausted/.test(e && e.message || "")) {
            console.error(e);
            term.println("");
            term.println("[engine error in " + (e.ruleName || "?") + ": " + (e && e.message ? e.message : String(e)) + "]");
        }
    }
    rt.flush();
    term.blank();
    term.println("[adventure ended]");
}
