// AUTO-GENERATED from haunt_game_source.txt by tools/generate-rules.mjs
// Do not edit by hand.

export function createRules(rt, engine) {
    const _badInputPool = [
        "That does not compute.", "Try something different.",
        "Try something else.", "That's easy for you to say.",
        "Yo no comprendo.", "I don't understand that.",
        "No way buster.", "I don't grok that.",
        "That's a bit over my head.", "Huh?",
        "Ich verstehe nicht.", "Was that in Greek?",
        "Stop mumbling.",
    ];
    let _badInputIdx = 0;
    return [
        {
            name: "name01",
            priority: 0,
            sourceIndex: 0,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":0}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"readfirst"}]},{"cls":"input","isPositional":true,"prefixLength":0,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "I assume that means yes.");
            rt.modify(m.$2, { "type": "operator", "name": "read" });
            },
        },
        {
            name: "name02",
            priority: 0,
            sourceIndex: 1,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"readfirst"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["yes","y","oui","nothing"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "type": "operator", "name": "read" });
            },
        },
        {
            name: "name06",
            priority: 0,
            sourceIndex: 2,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":0}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"process"}]},{"cls":"input","isPositional":true,"prefixLength":0,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.write("\n", _badInputPool[_badInputIdx % _badInputPool.length]);
                _badInputIdx++;
            rt.remove(m.$3);
            rt.modify(m.$2, { "name": "read" });
            },
        },
        {
            name: "name07",
            priority: 0,
            sourceIndex: 3,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"process"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"neq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You can't go that way.");
            rt.modify(m.$2, { "name": "read" });
            rt.modify(m.$3, { "going": null });
            },
        },
        {
            name: "name08",
            priority: 0,
            sourceIndex: 4,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"process"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"nil"}]},{"cls":"input","isPositional":true,"prefixLength":0,"negated":true,"tests":[]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "type": "operator", "name": "read" });
            },
        },
        {
            name: "name09",
            priority: 0,
            sourceIndex: 5,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"read"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"nil"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"input","isPositional":true,"prefixLength":0,"negated":true,"tests":[]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "type": "operator", "name": "process" });
            rt.write("\n", "*");
            rt.make("input", [(await rt.term.readLine()).toLowerCase().split(/\s+/).filter(Boolean)].flat());
            rt.modify(m.$4, { "realtime": rt.compute(m.x, "+", 2) });
            },
        },
        {
            name: "name010",
            priority: 0,
            sourceIndex: 6,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":50}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"readfirst"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is HAUNT.  Version 4.6");
            rt.write("\n", "See NEWS for news.");
            rt.write("\n", "Have you played before?[yes]", "\n", "*");
            rt.make("input", [(await rt.term.readToken()).toLowerCase()].flat());
            rt.write("\n", " ");
            },
        },
        {
            name: "name011",
            priority: 0,
            sourceIndex: 7,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"read"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":true,"tests":[]}],
            action: async (m, wm, term) => {
                rt.make("location", { "name": "bus_stop" });
            },
        },
        {
            name: "name012",
            priority: 0,
            sourceIndex: 8,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":40}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"readfirst"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["n","no"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "name": "read" });
            rt.write("\n", "Welcome novice.  You are playing on one of the world's largest production");
            rt.write("\n", "systems.  The purpose of this game is to find");
            rt.write("\n", "treasure in a haunted house and then escape from the house.");
            rt.write("\n", " ");
            rt.write("\n", "The program will give descriptions of locations and accept");
            rt.write("\n", "commands to perform actions.");
            rt.write("\n", "Give it directives on what to do with simple 1-5 word commands");
            rt.write("\n", "Its knowledge of English is limited but imaginative.");
            rt.write("\n", "The directions are north, south, east, west,");
            rt.write("\n", "up and down.  Directions can be one letter (n,s,e,w,u,d).");
            rt.write("\n", "Forward, back, left and right also work.");
            rt.write("\n", "To string commands together use 'then'.  (eg.  west then s)");
            rt.write("\n", "It will describe things to you, and a phrase enclosed in ' ' ");
            rt.write("\n", "is something it hears.");
            rt.write("\n", " ");
            rt.write("\n", "Special commands: INVEN tells you what you hold.");
            rt.write("\n", "                  SCORE gives your current score.  ");
            rt.write("\n", "                  STOP ends the adventure.  ");
            rt.write("\n", "                  LOOK describes your current position.");
            rt.write("\n", "                  NEWS describes new features.");
            rt.write("\n", " ");
            rt.write("\n", "*******************************************************************");
            rt.write("\n", "You get 15 points for finding a treasure and 5 points for");
            rt.write("\n", "getting it to the lawn outside the house.  You get an extra");
            rt.write("\n", "bonus of 20 points for getting your body off the estate.");
            rt.write("\n", "The maximum number of points is 440");
            rt.write("\n", "Good luck, you'll need it.  Ask for help if you want.");
            rt.write("\n", "*******************************************************************");
            rt.write("\n", "Copyright (C) 1979, 1980, 1981, 1982 John Laird");
            rt.write("\n", "*******************************************************************");
            rt.write("\n", " ");
            rt.write("\n", "On with the adventure!!!");
            rt.write("\n", " ");
            rt.write("\n", " ");
            rt.write("\n", " ");
            rt.write("\n", " ");
            rt.write("\n", " ");
            rt.write("\n", " ");
            rt.write("\n", " ");
            rt.write("\n", " ");
            rt.write("\n", " ");
            rt.write("\n", " ");
            rt.write("\n", "Along time ago, a young couple was picnicing near the woods");
            rt.write("\n", "on the outskirts of town.  They were celebrating the birth");
            rt.write("\n", "of their first child.  Unfortunately, a crazed moose inhabited that");
            rt.write("\n", "area and attacked them.  The child and husband were");
            rt.write("\n", "unharmed, but the wife was gored to death by the moose.");
            rt.write("\n", " ");
            rt.write("\n", "After the funeral, the man bought the land where the incident occurred");
            rt.write("\n", "and constructed a large mansion: CHEZ MOOSE.  He filled it with");
            rt.write("\n", "the treasures of his family and claimed that his wife's");
            rt.write("\n", "soul was still in the area.  He vowed to remain in the");
            rt.write("\n", "mansion until he had returned her soul to human flesh.");
            rt.write("\n", "He tried to bridge the gap between life and death to reclaim her.");
            rt.write("\n", "Some say he was insane with grief, but others claimed that the madness was");
            rt.write("\n", "in his blood, and his wife's death brought it to the surface.");
            rt.write("\n", "After he entered the house, he never returned, and was declared dead ");
            rt.write("\n", "seven years later.  Several people have entered the mansion");
            rt.write("\n", "looking for him but none of them have ever returned.");
            rt.write("\n", "There were rumors that he and his wife now haunt the house.");
            rt.write("\n", " ");
            rt.write("\n", "That would be the end of the story except that the house");
            rt.write("\n", "still stands and is filled with priceless treasures.");
            rt.write("\n", "The house and all its contents are willed to his only descendant.");
            rt.write("\n", "Oh yes, I forgot to tell you, the day the mother was killed,");
            rt.write("\n", "the child was stolen by Gypsies.");
            rt.write("\n", "The Will claims that only the descendant will know");
            rt.write("\n", "how to avoid going crazy and committing suicide");
            rt.write("\n", "while spending a night in the mansion.");
            rt.write("\n", "An obscure hereditary disease, Orkhisnoires sakioannes,");
            rt.write("\n", "is supposed to play some part in this.");
            rt.write("\n", " ");
            rt.write("\n", "So if your heritage is in doubt, you may be the descendant that");
            rt.write("\n", "can claim the treasure in the mansion.");
            rt.write("\n", "Many people, claiming to be descendants have died trying...");
            rt.write("\n", " or at least never returned.");
            rt.write("\n", " ");
            rt.write("\n", "The terms of the Will say you get to keep any treasure");
            rt.write("\n", "you get to the lawn, but of course you must also get off the premises alive.");
            rt.write("\n", "Because the house is haunted it must be destroyed, and nobody");
            rt.write("\n", "would be crazy enough to try and recover the rest of the treasure.");
            rt.write("\n", "If you do get out, the government has agreed to");
            rt.write("\n", "buy the land and destroy the house.");
            rt.write("\n", " ");
            rt.write("\n", "If you are insane enough to try, your adventure starts at a bus stop.");
            rt.write("\n", "Remember, type STOP to end the adventure.");
            rt.write("\n", " ");
            },
        },
        {
            name: "name013",
            priority: 0,
            sourceIndex: 9,
            conditions: [{"cls":"start","isPositional":true,"prefixLength":0,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.make("current", { "type": "operator", "name": "readfirst" });
            rt.remove(m.$1);
            rt.make("x", [0].flat());
            rt.make("x", [10].flat());
            rt.make("x", [20].flat());
            rt.make("x", [30].flat());
            rt.make("x", [40].flat());
            rt.make("x", [50].flat());
            rt.make("x", [60].flat());
            },
        },
        {
            name: "name1005",
            priority: 0,
            sourceIndex: 10,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":60}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"readfirst"}]}],
            action: async (m, wm, term) => {
                rt.make("status", { "score": 0, "went": "w", "sound": "on" });
            rt.make("object", { "name": "elevator", "place": "h" });
            rt.make("object", { "name": "candlesticks", "place": "dining_room", "treasure": "t" });
            rt.make("object", { "name": "ghost", "place": "cheese_room" });
            rt.make("object", { "name": "candy", "place": "foyer" });
            rt.make("object", { "name": "jade", "place": "backroom", "treasure": "t" });
            rt.make("object", { "name": "soap", "place": "bathroom" });
            rt.make("object", { "name": "mattress", "place": "bedroom" });
            rt.make("object", { "name": "chest", "place": "ocean", "south": 2, "east": 2, "up": 1, "treasure": "t" });
            rt.make("object", { "name": "marijuana", "place": "secret_room", "treasure": "t" });
            rt.make("object", { "name": "bottle", "place": "bar" });
            rt.make("object", { "name": "painting", "place": "smelly_room", "covered": "t" });
            rt.make("object", { "name": "chair", "place": "main_hall", "treasure": "t" });
            rt.make("object", { "name": "stool", "place": "bar" });
            rt.make("object", { "name": "gold", "place": "small_closet", "treasure": "t" });
            rt.make("object", { "name": "dracula", "place": "dark_room", "asleep": "t" });
            rt.make("object", { "name": "monster", "place": "laboratory" });
            rt.make("object", { "name": "coins", "place": "bathysphere", "treasure": "t" });
            rt.make("object", { "name": "corkscrew", "place": "wine_cellar", "treasure": "t" });
            rt.make("object", { "name": "wetsuit", "place": "closet" });
            rt.make("object", { "name": "speargun", "place": "bathysphere", "state": "loaded" });
            rt.make("object", { "name": "diamonds", "place": "cave", "treasure": "t" });
            rt.make("object", { "name": "cube", "place": "frig", "treasure": "t" });
            rt.make("object", { "name": "tokens", "place": "held" });
            rt.make("object", { "name": "orchid", "place": "lawn", "side": "in", "east": 3, "north": 7, "state": "seed" });
            rt.make("object", { "name": "watch", "place": "held" });
            rt.make("object", { "name": "stairs", "state": "whole" });
            rt.make("object", { "name": "rope", "tied": "noose" });
            rt.make("object", { "name": "damsel", "alive": "t", "tied": "t" });
            rt.make("object", { "name": "turpentine", "inside": "bottle" });
            rt.make("object", { "name": "moray_eel", "alive": "t" });
            rt.make("object", { "name": "seamonster", "alive": "t" });
            rt.make("object", { "name": "octopus", "alive": "t" });
            rt.make("portal", { "name": "truck", "door": "closed" });
            rt.make("portal", { "name": "library", "door": "closed" });
            rt.make("portal", { "name": "casket", "door": "closed" });
            rt.make("portal", { "name": "grill", "door": "closed" });
            rt.make("portal", { "name": "elevator", "door": "closed" });
            rt.make("portal", { "name": "large_door", "door": "closed" });
            rt.make("portal", { "name": "safe", "door": "closed" });
            rt.make("portal", { "name": "rdoor", "door": "closed" });
            rt.make("portal", { "name": "wdoor", "door": "closed" });
            rt.make("portal", { "name": "closet", "door": "open" });
            rt.make("portal", { "name": "wall", "door": "closed" });
            rt.make("time", { "btime": 2214, "realtime": 2200 });
            rt.make("history", { "grave_status": "undug" });
            rt.make("place", { "name": "bathtub", "water": "out" });
            rt.make("place", { "name": "foyer", "virgin": "t" });
            },
        },
        {
            name: "name1",
            priority: 0,
            sourceIndex: 11,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":50}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"name"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_var","var":"name"}]}],
            action: async (m, wm, term) => {
                rt.make("place", { "name": m.name });
            },
        },
        {
            name: "name3",
            priority: 0,
            sourceIndex: 12,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"neq_var","var":"y"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"a"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "The", m.x, "is not here.");
            },
        },
        {
            name: "name4",
            priority: 0,
            sourceIndex: 13,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"news"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Version 4.6, 6-21-82");
            rt.write("\n", "As always, a few more bugs have been fixed.");
            rt.write("\n", "Send gripes to John.Laird@CMUA.");
            rt.write("\n", "Or John Laird, Computer Science Department");
            rt.write("\n", "Carnegie-Mellon University, Pittsburgh, Pa. 15213");
            rt.write("\n", "The max score is 440.");
            rt.write("\n", "Copyright (C) 1979,1980,1981,1982,1983 John E. Laird");
            },
        },
        {
            name: "name5",
            priority: 0,
            sourceIndex: 14,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"who"},{"index":1,"op":"eq_const","value":"is"},{"index":2,"op":"eq_const","value":"bzm"},{"index":3,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "A famous graduate of CMU CSD.");
            },
        },
        {
            name: "name6",
            priority: 0,
            sourceIndex: 15,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"xstat"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            engine.halt();
            },
        },
        {
            name: "name7",
            priority: 0,
            sourceIndex: 16,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":50}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"visited","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in", m.x.replace(/_/g, " "), ".");
            },
        },
        {
            name: "name8",
            priority: 0,
            sourceIndex: 17,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_var","var":"y"},{"index":2,"op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.make("input", [m.x, "on", m.y, rt.substr(m.$2, 5, "inf")].flat());
            rt.remove(m.$2);
            },
        },
        {
            name: "name9",
            priority: 0,
            sourceIndex: 18,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_var","var":"y"},{"index":2,"op":"eq_const","value":"off"}]}],
            action: async (m, wm, term) => {
                rt.make("input", [m.x, "off", m.y, rt.substr(m.$2, 5, "inf")].flat());
            rt.remove(m.$2);
            },
        },
        {
            name: "name10",
            priority: 0,
            sourceIndex: 19,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"to"},{"index":2,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, m.y].flat());
            },
        },
        {
            name: "name11",
            priority: 0,
            sourceIndex: 20,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"gamma"},{"index":1,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "name": m.y });
            },
        },
        {
            name: "name12",
            priority: 0,
            sourceIndex: 21,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"the"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, rt.substr(m.$2, 4, "inf")].flat());
            },
        },
        {
            name: "name13",
            priority: 0,
            sourceIndex: 22,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_var","var":"y"},{"index":2,"op":"eq_const","value":"the"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, m.y, rt.substr(m.$2, 5, "inf")].flat());
            },
        },
        {
            name: "name14",
            priority: 0,
            sourceIndex: 23,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"a"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, rt.substr(m.$2, 4, "inf")].flat());
            },
        },
        {
            name: "name15",
            priority: 0,
            sourceIndex: 24,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"then"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x].flat());
            rt.make("input", ["then", rt.substr(m.$2, 4, "inf")].flat());
            },
        },
        {
            name: "name16",
            priority: 0,
            sourceIndex: 25,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_var","var":"y"},{"index":2,"op":"eq_const","value":"then"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, m.y].flat());
            rt.make("input", [rt.substr(m.$2, 4, "inf")].flat());
            },
        },
        {
            name: "name17",
            priority: 0,
            sourceIndex: 26,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":5,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_var","var":"y"},{"index":2,"op":"eq_const","value":"then"},{"index":3,"op":"eq_var","var":"W"},{"index":4,"op":"eq_const","value":"it"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, m.y].flat());
            rt.make("input", ["then", m.W, m.y, rt.substr(m.$2, 7, "inf")].flat());
            },
        },
        {
            name: "name18",
            priority: 0,
            sourceIndex: 27,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"neq_const","value":"then"},{"index":1,"op":"eq_var","var":"y"},{"index":2,"op":"eq_var","var":"n"},{"index":3,"op":"eq_const","value":"then"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, m.y, m.n].flat());
            rt.make("input", [rt.substr(m.$2, 5, "inf")].flat());
            },
        },
        {
            name: "name19",
            priority: 0,
            sourceIndex: 28,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"then"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [rt.substr(m.$2, 3, "inf")].flat());
            rt.modify(m.$3, { "realtime": rt.compute(m.y, "+", 2) });
            },
        },
        {
            name: "name20",
            priority: 0,
            sourceIndex: 29,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"it"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.make("input", [m.x, m.y, rt.substr(m.$3, 4, "inf")].flat());
            },
        },
        {
            name: "name21",
            priority: 0,
            sourceIndex: 30,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"place","op":"eq_var","var":"Z"},{"field":"side","op":"eq_var","var":"__pos_side_Z","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_Z","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_Z","implicit":true}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"Z"},{"field":"side","op":"eq_var","var":"__pos_side_Z","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_Z","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_Z","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"it"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.make("input", [m.x, m.y, rt.substr(m.$4, 4, "inf")].flat());
            },
        },
        {
            name: "name22",
            priority: 0,
            sourceIndex: 31,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"bind_set","set":["n","s","e","w","u","d"],"var":"direction"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": m.direction, "went": m.direction });
            },
        },
        {
            name: "name23",
            priority: 0,
            sourceIndex: 32,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["out","leave"]}]}],
            action: async (m, wm, term) => {
                rt.make("input", ["exit", rt.substr(m.$2, 3, "inf")].flat());
            rt.remove(m.$2);
            },
        },
        {
            name: "name24",
            priority: 0,
            sourceIndex: 33,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"in"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["enter", rt.substr(m.$2, 4, "inf")].flat());
            },
        },
        {
            name: "name25",
            priority: 0,
            sourceIndex: 34,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["walkin","in","inside"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["enter", rt.substr(m.$2, 3, "inf")].flat());
            },
        },
        {
            name: "name26",
            priority: 0,
            sourceIndex: 35,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"west"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "w", "went": "w" });
            },
        },
        {
            name: "name27",
            priority: 0,
            sourceIndex: 36,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"east"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "e", "went": "e" });
            },
        },
        {
            name: "name28",
            priority: 0,
            sourceIndex: 37,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"north"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "n", "went": "n" });
            },
        },
        {
            name: "name29",
            priority: 0,
            sourceIndex: 38,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"south"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "s", "went": "s" });
            },
        },
        {
            name: "name30",
            priority: 0,
            sourceIndex: 39,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"up"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "u", "went": "u" });
            },
        },
        {
            name: "name31",
            priority: 0,
            sourceIndex: 40,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"down"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "d", "went": "d" });
            },
        },
        {
            name: "name32",
            priority: 0,
            sourceIndex: 41,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null, "noway": "t" });
            },
        },
        {
            name: "name33",
            priority: 0,
            sourceIndex: 42,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null, "noway": "t" });
            },
        },
        {
            name: "name34",
            priority: 0,
            sourceIndex: 43,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null, "noway": "t" });
            },
        },
        {
            name: "name35",
            priority: 0,
            sourceIndex: 44,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null, "noway": "t" });
            },
        },
        {
            name: "name36",
            priority: 0,
            sourceIndex: 45,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"d"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "You can't go down from here.");
            },
        },
        {
            name: "name37",
            priority: 0,
            sourceIndex: 46,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"u"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "There is nothing to go up on.");
            },
        },
        {
            name: "name38",
            priority: 0,
            sourceIndex: 47,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"noway","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You can't go that way.");
            rt.modify(m.$2, { "noway": null, "going": null });
            },
        },
        {
            name: "name39",
            priority: 0,
            sourceIndex: 48,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"w"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"right"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "n", "went": "n" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name40",
            priority: 0,
            sourceIndex: 49,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_var","var":"direction"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"forward"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": m.direction });
            rt.remove(m.$3);
            },
        },
        {
            name: "name41",
            priority: 0,
            sourceIndex: 50,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"s"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"left"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "e", "went": "e" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name42",
            priority: 0,
            sourceIndex: 51,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"e"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"left"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "n", "went": "n" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name43",
            priority: 0,
            sourceIndex: 52,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"e"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"right"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "s", "went": "s" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name44",
            priority: 0,
            sourceIndex: 53,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"e"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"back"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "w", "went": "w" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name45",
            priority: 0,
            sourceIndex: 54,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"s"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"right"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "w", "went": "w" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name46",
            priority: 0,
            sourceIndex: 55,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"s"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"back"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "n", "went": "n" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name47",
            priority: 0,
            sourceIndex: 56,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"n"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"left"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "w", "went": "w" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name48",
            priority: 0,
            sourceIndex: 57,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"n"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"right"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "e", "went": "e" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name49",
            priority: 0,
            sourceIndex: 58,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"n"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"back"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "s", "went": "s" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name50",
            priority: 0,
            sourceIndex: 59,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"w"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"left"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "s", "went": "s" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name51",
            priority: 0,
            sourceIndex: 60,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"u"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"back"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "d", "went": "d" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name52",
            priority: 0,
            sourceIndex: 61,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"d"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"back"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "u", "went": "u" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name53",
            priority: 0,
            sourceIndex: 62,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_const","value":"w"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"back"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": "e", "went": "e" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name54",
            priority: 0,
            sourceIndex: 63,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"ahead"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["forward"].flat());
            },
        },
        {
            name: "name55",
            priority: 0,
            sourceIndex: 64,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"went","op":"eq_var","var":"y"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"direction"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You are facing ", m.y);
            },
        },
        {
            name: "name56",
            priority: 0,
            sourceIndex: 65,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"exit"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["back"].flat());
            },
        },
        {
            name: "name57",
            priority: 0,
            sourceIndex: 66,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I can't enter", m.x, ".");
            },
        },
        {
            name: "name58",
            priority: 0,
            sourceIndex: 67,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"go"},{"index":1,"op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.make("input", ["forward"].flat());
            rt.remove(m.$2);
            },
        },
        {
            name: "name59",
            priority: 0,
            sourceIndex: 68,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"go"},{"index":1,"op":"neq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [rt.substr(m.$2, 3, "inf")].flat());
            },
        },
        {
            name: "name60",
            priority: 0,
            sourceIndex: 69,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"n"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"all"}]}],
            action: async (m, wm, term) => {
                rt.make("input", ["get", m.n].flat());
            },
        },
        {
            name: "name61",
            priority: 0,
            sourceIndex: 70,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"all"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "OK, all done.");
            },
        },
        {
            name: "name62",
            priority: 0,
            sourceIndex: 71,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"p"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_var","var":"p"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You already have", m.p);
            },
        },
        {
            name: "name63",
            priority: 0,
            sourceIndex: 72,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_var","var":"p"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I can't get", m.p);
            },
        },
        {
            name: "name64",
            priority: 0,
            sourceIndex: 73,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_var","var":"p"},{"field":"side","op":"eq_var","var":"s"},{"field":"north","op":"eq_var","var":"n"},{"field":"east","op":"eq_var","var":"e"},{"field":"state","op":"eq_const","value":"nil"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"p"},{"field":"side","op":"eq_var","var":"s"},{"field":"north","op":"eq_var","var":"n"},{"field":"east","op":"eq_var","var":"e"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.modify(m.$2, { "place": "held" });
            rt.write("\n", "You just got", m.x, ".");
            },
        },
        {
            name: "name65",
            priority: 0,
            sourceIndex: 74,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":40}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"monster"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "That would be a big mistake.");
            },
        },
        {
            name: "name66",
            priority: 0,
            sourceIndex: 75,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":40}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cecil"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"cecil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "Cecil is a free spirit.  He doesn't come with you.");
            },
        },
        {
            name: "name67",
            priority: 0,
            sourceIndex: 76,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["pull","pickup","grab","pry","lift","take","carry"]},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["get", m.x].flat());
            },
        },
        {
            name: "name68",
            priority: 0,
            sourceIndex: 77,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pick"},{"index":1,"op":"eq_const","value":"up"},{"index":2,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.make("input", ["get", m.x].flat());
            rt.remove(m.$2);
            },
        },
        {
            name: "name69",
            priority: 0,
            sourceIndex: 78,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_const","value":"all"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "All dropped.");
            },
        },
        {
            name: "name70",
            priority: 0,
            sourceIndex: 79,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_const","value":"all"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"p"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"n"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.make("input", ["drop", m.n].flat());
            },
        },
        {
            name: "name71",
            priority: 0,
            sourceIndex: 80,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"side","op":"eq_var","var":"s"},{"field":"north","op":"eq_var","var":"n"},{"field":"east","op":"eq_var","var":"e"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.modify(m.$2, { "place": m.y, "side": m.s, "north": m.n, "east": m.e });
            },
        },
        {
            name: "name72",
            priority: 0,
            sourceIndex: 81,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["discard","release"]},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["drop", m.x].flat());
            },
        },
        {
            name: "name73",
            priority: 0,
            sourceIndex: 82,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"neq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You don't have", m.x);
            },
        },
        {
            name: "name74",
            priority: 0,
            sourceIndex: 83,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"put"},{"index":1,"op":"eq_const","value":"down"},{"index":2,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["drop", m.x].flat());
            },
        },
        {
            name: "name75",
            priority: 0,
            sourceIndex: 84,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"take"},{"index":1,"op":"eq_const","value":"off"},{"index":2,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["remove", m.x].flat());
            },
        },
        {
            name: "name76",
            priority: 0,
            sourceIndex: 85,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"p"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"inven"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", m.p);
            },
        },
        {
            name: "name77",
            priority: 0,
            sourceIndex: 86,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"inven"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            },
        },
        {
            name: "name78",
            priority: 0,
            sourceIndex: 87,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":40}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"inven"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You have the following:");
            },
        },
        {
            name: "name79",
            priority: 0,
            sourceIndex: 88,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"inventory"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["inven"].flat());
            },
        },
        {
            name: "name80",
            priority: 0,
            sourceIndex: 89,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"p"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"C"},{"field":"inside","op":"eq_var","var":"p"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"inven"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", m.C);
            },
        },
        {
            name: "name81",
            priority: 0,
            sourceIndex: 90,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":50}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"inven"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You're empty handed.");
            },
        },
        {
            name: "name82",
            priority: 0,
            sourceIndex: 91,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"run"},{"index":1,"op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I'm going as fast as I can.");
            },
        },
        {
            name: "name83",
            priority: 0,
            sourceIndex: 92,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"run"},{"index":1,"op":"neq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I can't go any faster.");
            },
        },
        {
            name: "name84",
            priority: 0,
            sourceIndex: 93,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"listen"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Silence!");
            },
        },
        {
            name: "name85",
            priority: 0,
            sourceIndex: 94,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"sound","op":"eq_const","value":"on"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"listen"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "sound": "on" });
            },
        },
        {
            name: "name86",
            priority: 0,
            sourceIndex: 95,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"whistle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "What, without an accompanying orchestra?");
            },
        },
        {
            name: "name87",
            priority: 0,
            sourceIndex: 96,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"hum"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Hum de dum de dum, hum hum dum dum de dum.");
            },
        },
        {
            name: "name88",
            priority: 0,
            sourceIndex: 97,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sing"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "In-A-Gadda-Da-Vida Baby, don't you know that I love you.");
            },
        },
        {
            name: "name89",
            priority: 0,
            sourceIndex: 98,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"mumble"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "mumbmaubmmmsms");
            },
        },
        {
            name: "name90",
            priority: 0,
            sourceIndex: 99,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["quit","halt","stop"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "quit": "t" });
            rt.write("\n", "The party's over.");
            },
        },
        {
            name: "name1007",
            priority: 0,
            sourceIndex: 100,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":40}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"die","op":"eq_const","value":"t"},{"field":"died","op":"eq_const","value":"t"},{"field":"quit","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Well, you're one more that didn't get the treasure and live.");
            rt.modify(m.$2, { "quit": "t" });
            },
        },
        {
            name: "name1008",
            priority: 0,
            sourceIndex: 101,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":40}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"die","op":"eq_const","value":"t"},{"field":"score","op":"eq_var","var":"Q"},{"field":"died","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "score": rt.compute(m.Q, "-", 20), "died": "t" });
            rt.write("\n", "Hmm...  you went and got yourself killed.");
            rt.write("\n", "But before the last neuron in your brain was destroyed, a");
            rt.write("\n", "10th level Bus driver came by and conjured up a Lazurus spell!!!");
            },
        },
        {
            name: "name96",
            priority: 0,
            sourceIndex: 102,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pour"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You don't have a bottle full of anything.");
            },
        },
        {
            name: "name97",
            priority: 0,
            sourceIndex: 103,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drink"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.remove(m.$3);
            rt.write("\n", "I love that", m.x, "for breakfast every morning.");
            },
        },
        {
            name: "name98",
            priority: 0,
            sourceIndex: 104,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"beach"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"sand"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "The sand clogs in the neck of the bottle.");
            rt.write("\n", "For all practical purposes you can't get any sand.");
            },
        },
        {
            name: "name99",
            priority: 0,
            sourceIndex: 105,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"beach"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.make("input", ["get", "sand"].flat());
            },
        },
        {
            name: "name100",
            priority: 0,
            sourceIndex: 106,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"corkscrew"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a diamond studded corkscrew here!");
            },
        },
        {
            name: "name101",
            priority: 0,
            sourceIndex: 107,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"corkscrew"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"screw"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Cork screwing is a little out of my league.");
            rt.remove(m.$3);
            },
        },
        {
            name: "name102",
            priority: 0,
            sourceIndex: 108,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"ring"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a huge diamond ring here.");
            },
        },
        {
            name: "name103",
            priority: 0,
            sourceIndex: 109,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"candy"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a bowl of candy on the ground.");
            },
        },
        {
            name: "name104",
            priority: 0,
            sourceIndex: 110,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"bowl"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, "candy"].flat());
            },
        },
        {
            name: "name105",
            priority: 0,
            sourceIndex: 111,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"candy"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_const","value":"candy"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Candy tastes good; uhm!");
            rt.write("\n", "Of course the pins in the Snickers take a little chewing.");
            rt.remove(m.$2);
            rt.remove(m.$4);
            },
        },
        {
            name: "name106",
            priority: 0,
            sourceIndex: 112,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"candy"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_const","value":"candy"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You eat the candy; and get cavities.");
            rt.remove(m.$2);
            rt.remove(m.$3);
            },
        },
        {
            name: "name107",
            priority: 0,
            sourceIndex: 113,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"marijuana"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is some fine marijuana here! Good stuff.");
            },
        },
        {
            name: "name108",
            priority: 0,
            sourceIndex: 114,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"burn"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The matches go out before you can burn", m.x);
            },
        },
        {
            name: "name109",
            priority: 0,
            sourceIndex: 115,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"marijuana"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"hungry","op":"eq_const","value":"nil"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"smoke"},{"index":1,"op":"eq_const","value":"marijuana"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$3);
            rt.remove(m.$5);
            rt.modify(m.$4, { "hungry": "t" });
            rt.write("\n", "You manage to light up,");
            rt.write("\n", "the matches haved dried out here, this very expensive stuff.");
            rt.write("\n", "Its very smooth, you begin to think you really don't");
            rt.write("\n", "need to adventure anymore.  You are hungry.");
            },
        },
        {
            name: "name110",
            priority: 0,
            sourceIndex: 116,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"marijuana"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"smoke"},{"index":1,"op":"eq_const","value":"marijuana"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You don't have any matches.");
            },
        },
        {
            name: "name111",
            priority: 0,
            sourceIndex: 117,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"smoke"},{"index":1,"op":"eq_const","value":"marijuana"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You don't have any.");
            },
        },
        {
            name: "name112",
            priority: 0,
            sourceIndex: 118,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"marijuana"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"smoke"},{"index":1,"op":"eq_const","value":"marijuana"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "The matches are wet.");
            },
        },
        {
            name: "name113",
            priority: 0,
            sourceIndex: 119,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"hungry","op":"eq_const","value":"t"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "I'm so hungry, I could eat a ", m.x);
            rt.make("input", ["eat", m.x].flat());
            },
        },
        {
            name: "name114",
            priority: 0,
            sourceIndex: 120,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"hungry","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "hungry": null });
            },
        },
        {
            name: "name115",
            priority: 0,
            sourceIndex: 121,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"y"},{"index":1,"op":"in_set","set":["maryjane","marihuana","dope","grass","pot"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.y, "marijuana"].flat());
            },
        },
        {
            name: "name116",
            priority: 0,
            sourceIndex: 122,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["smoke","light","burn"]},{"index":1,"op":"eq_const","value":"marijuana"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["smoke", "marijuana"].flat());
            },
        },
        {
            name: "name117",
            priority: 0,
            sourceIndex: 123,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a small white cube here.");
            },
        },
        {
            name: "name118",
            priority: 0,
            sourceIndex: 124,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"lick"},{"index":1,"op":"eq_const","value":"cube"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "UHM! That tasted good!!!");
            },
        },
        {
            name: "name119",
            priority: 0,
            sourceIndex: 125,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"taste"},{"index":1,"op":"eq_const","value":"cube"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "To taste it you should really eat the cube.");
            },
        },
        {
            name: "name120",
            priority: 0,
            sourceIndex: 126,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"watch"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_const","value":"cube"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$4);
            rt.write("\n", "The cube tastes like sugar.  You are suddenly surrounded by");
            rt.write("\n", "a herd of moose.  They start talking to you about a moose-load of things.");
            rt.write("\n", "One walks over to you and whispers, 'Fa Lowe, why her?'");
            rt.write("\n", "You look at your watch , but the hands suddenly spin!");
            rt.write("\n", "You find yourself staring at the");
            rt.write("\n", "m");
            rt.write("\n", " o");
            rt.write("\n", "  o");
            rt.write("\n", "   s");
            rt.write("\n", "    e");
            rt.write("\n", "     ?");
            rt.write("\n", "  for a long time, and enjoying it.");
            },
        },
        {
            name: "name121",
            priority: 0,
            sourceIndex: 127,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_const","value":"cube"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$3);
            rt.write("\n", "The cube tastes like sugar.  You are suddenly surrounded by");
            rt.write("\n", "a herd of moose.  They start talking to you about a moose-load of things.");
            rt.write("\n", "One walks over to you and whispers, 'Fa Lowe, why her?'");
            rt.write("\n", "You find yourself staring at your toes");
            rt.write("\n", "  for a long time, and enjoying it.");
            },
        },
        {
            name: "name122",
            priority: 0,
            sourceIndex: 128,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_const","value":"cube"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.remove(m.$4);
            rt.write("\n", "That was sweet!");
            rt.write("\n", "This kitchen is a real deary PLACE!!  A bad PLACE to take acid.");
            rt.write("\n", "You have to get out of here!!");
            rt.write("\n", "You feel on fire, you need water to cool off.");
            rt.make("input", ["w", "then", "push", "button", "then", "n", "then", "push", "b", "then", "exit", "then", "push", "red", "button"].flat());
            },
        },
        {
            name: "name123",
            priority: 0,
            sourceIndex: 129,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"white"},{"index":2,"op":"eq_const","value":"cube"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, "cube"].flat());
            },
        },
        {
            name: "name124",
            priority: 0,
            sourceIndex: 130,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"in_set","set":["sugar","acid"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, "cube"].flat());
            },
        },
        {
            name: "name125",
            priority: 0,
            sourceIndex: 131,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":60}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"likes","op":"eq_var","var":"B"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"cancer","op":"eq_var","var":"TIME"},{"field":"realtime","op":"eq_var","var":"TIME"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Your wicked and lusty life has finally caught up with you.");
            rt.write("\n", "That cigarette you had with the", m.B, "has caused cancer to");
            rt.write("\n", "spread throughout your lungs.  COUGH!! COUGH!! You are");
            rt.write("\n", "weakening.  Hack! You're down on your knees.  COUGH COUGH!!");
            rt.write("\n", "You keel over and die....");
            rt.modify(m.$3, { "quit": "t" });
            },
        },
        {
            name: "name126",
            priority: 0,
            sourceIndex: 132,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":60}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"orc_status","op":"eq_const","value":"sweat"},{"field":"orc_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "orc_status": "dizzy", "orc_time": rt.compute(m.x, "+", 120) });
            rt.write("\n", " ");
            rt.write("\n", "You are starting to sweat.  I think this place is getting to you.");
            },
        },
        {
            name: "name127",
            priority: 0,
            sourceIndex: 133,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":60}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"orc_status","op":"eq_const","value":"dizzy"},{"field":"orc_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "orc_status": "mad", "orc_time": rt.compute(m.x, "+", 60) });
            rt.write("\n", " ");
            rt.write("\n", "Your getting a little dizzy.");
            rt.write("\n", "The area around seems to swim a little when you move.");
            },
        },
        {
            name: "name128",
            priority: 0,
            sourceIndex: 134,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":60}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"orc_status","op":"eq_const","value":"mad"},{"field":"orc_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "orc_status": "suicide", "orc_time": rt.compute(m.x, "+", 30) });
            rt.write("\n", " ");
            rt.write("\n", "I think you are definitely going insane.  The sweaty palms and dizziness were");
            rt.write("\n", "the first signs.  If you don't do something quick, you'll commit suicide!");
            },
        },
        {
            name: "name129",
            priority: 0,
            sourceIndex: 135,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":60}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"orc_status","op":"eq_const","value":"suicide"},{"field":"orc_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "orc_status": null, "orc_time": null });
            rt.modify(m.$3, { "die": "t" });
            rt.write("\n", " ");
            rt.write("\n", "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            rt.write("\n", "You can't stand it anymore, you are now totally crazy!");
            rt.write("\n", "You start laughing uncontrollably, but choke on your tongue.");
            rt.write("\n", "Ugh! Well at least you died happy!");
            },
        },
        {
            name: "name130",
            priority: 0,
            sourceIndex: 136,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"orc_status","op":"neq_const","value":"nil"}]},{"cls":"command","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"string","op":"eq_const","value":"eat_it"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "orc_status": null });
            rt.remove(m.$3);
            rt.write("\n", "You feel much saner.");
            rt.write("\n", "You've managed to avoid the St.  John curse!");
            },
        },
        {
            name: "name131",
            priority: 0,
            sourceIndex: 137,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"orc_status","op":"eq_const","value":"suicide"}]},{"cls":"command","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"string","op":"eq_const","value":"eat_it"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "orc_status": null });
            rt.remove(m.$3);
            rt.write("\n", "You've done it! The orchid returns you to sanity.");
            },
        },
        {
            name: "name132",
            priority: 0,
            sourceIndex: 138,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["examine","describe"]},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["look", m.x].flat());
            },
        },
        {
            name: "name133",
            priority: 0,
            sourceIndex: 139,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"visited","op":"eq_const","value":"t"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"look"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.modify(m.$2, { "visited": null });
            },
        },
        {
            name: "name134",
            priority: 0,
            sourceIndex: 140,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kill"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "With what? Your bare hands?");
            },
        },
        {
            name: "name135",
            priority: 0,
            sourceIndex: 141,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_var","var":"z"},{"field":"side","op":"eq_var","var":"__pos_side_z","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_z","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_z","implicit":true}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"z"},{"field":"side","op":"eq_var","var":"__pos_side_z","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_z","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_z","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kill"},{"index":1,"op":"eq_var","var":"x"},{"index":2,"op":"eq_const","value":"with"},{"index":3,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "Even with that you can't kill it.");
            },
        },
        {
            name: "name136",
            priority: 0,
            sourceIndex: 142,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"football"},{"field":"holds","op":"eq_const","value":"nil"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"throw"},{"index":1,"op":"eq_const","value":"football"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You don't have a football Dummy!");
            },
        },
        {
            name: "name137",
            priority: 0,
            sourceIndex: 143,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"throw"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I don't throw anything but a regulation NFL football.");
            },
        },
        {
            name: "name138",
            priority: 0,
            sourceIndex: 144,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"throw"},{"index":1,"op":"eq_const","value":"up"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I don't have the stomach for that.");
            },
        },
        {
            name: "name139",
            priority: 0,
            sourceIndex: 145,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"cut"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "There is nothing to cut with.");
            },
        },
        {
            name: "name140",
            priority: 0,
            sourceIndex: 146,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"cut"},{"index":1,"op":"eq_var","var":"x"},{"index":2,"op":"eq_const","value":"with"},{"index":3,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The", m.y, "won't cut the", m.x, ".");
            },
        },
        {
            name: "name141",
            priority: 0,
            sourceIndex: 147,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"cut"},{"index":1,"op":"eq_const","value":"cheese"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Look, this room is smelly enough already without that.");
            },
        },
        {
            name: "name142",
            priority: 0,
            sourceIndex: 148,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"break"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You hurt your hand.");
            },
        },
        {
            name: "name143",
            priority: 0,
            sourceIndex: 149,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"bust"},{"index":1,"op":"eq_const","value":"bust"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Homer looks hurt.");
            },
        },
        {
            name: "name144",
            priority: 0,
            sourceIndex: 150,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kick"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Ouch! The", m.x, "kicks back.");
            },
        },
        {
            name: "name145",
            priority: 0,
            sourceIndex: 151,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"side","op":"eq_var","var":"s"},{"field":"north","op":"eq_var","var":"n"},{"field":"east","op":"eq_var","var":"e"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kick"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "place": m.y, "side": m.s, "north": m.n, "east": m.e });
            rt.remove(m.$4);
            rt.write("\n", "Thud! Not much of a kicker I see.");
            },
        },
        {
            name: "name146",
            priority: 0,
            sourceIndex: 152,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kick"},{"index":1,"op":"eq_const","value":"football"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I see no football here.");
            },
        },
        {
            name: "name147",
            priority: 0,
            sourceIndex: 153,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"punt"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["kick", m.x].flat());
            },
        },
        {
            name: "name148",
            priority: 0,
            sourceIndex: 154,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Up you go, down you come.");
            },
        },
        {
            name: "name149",
            priority: 0,
            sourceIndex: 155,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"burn"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You can't burn", m.x, "without matches.");
            },
        },
        {
            name: "name150",
            priority: 0,
            sourceIndex: 156,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"burn"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You may have matches, but you didn't light one.");
            },
        },
        {
            name: "name151",
            priority: 0,
            sourceIndex: 157,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "If there is a secret panel near-by, this is not the way to open it.");
            },
        },
        {
            name: "name152",
            priority: 0,
            sourceIndex: 158,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"},{"index":1,"op":"eq_const","value":"chest"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The chest can't be opened, but it is worth mucho closed.");
            },
        },
        {
            name: "name153",
            priority: 0,
            sourceIndex: 159,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"help"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Help yourself");
            },
        },
        {
            name: "name154",
            priority: 0,
            sourceIndex: 160,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"process"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"yes"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Cute, but lets get on with the show.");
            },
        },
        {
            name: "name155",
            priority: 0,
            sourceIndex: 161,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"current","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"type","op":"eq_const","value":"operator"},{"field":"name","op":"eq_const","value":"process"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"no"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "That was rhetorical you fool.");
            },
        },
        {
            name: "name156",
            priority: 0,
            sourceIndex: 162,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"spit"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Your throat is too dry.");
            },
        },
        {
            name: "name157",
            priority: 0,
            sourceIndex: 163,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"where"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I don't know where", m.x, ".  I hope we aren't lost!!");
            },
        },
        {
            name: "name158",
            priority: 0,
            sourceIndex: 164,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"find"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "That would be cheating if I did it.");
            },
        },
        {
            name: "name159",
            priority: 0,
            sourceIndex: 165,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drink"},{"index":1,"op":"eq_var","var":"a"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The", m.a, "is not drinkable.");
            },
        },
        {
            name: "name160",
            priority: 0,
            sourceIndex: 166,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drink"},{"index":1,"op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I don't know what to drink.");
            },
        },
        {
            name: "name161",
            priority: 0,
            sourceIndex: 167,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"screw"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Sorry, but i don't have a screw driver.");
            },
        },
        {
            name: "name162",
            priority: 0,
            sourceIndex: 168,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fuck"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "That would be pretty kinky.");
            },
        },
        {
            name: "name163",
            priority: 0,
            sourceIndex: 169,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fuck"},{"index":1,"op":"eq_const","value":"bust"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Homer is harder than you are.");
            },
        },
        {
            name: "name164",
            priority: 0,
            sourceIndex: 170,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"wears","op":"eq_const","value":"wetsuit"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fuck"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You can't do that with a wetsuit on!");
            },
        },
        {
            name: "name165",
            priority: 0,
            sourceIndex: 171,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"up"},{"index":1,"op":"eq_const","value":"yours"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Up your own.");
            },
        },
        {
            name: "name166",
            priority: 0,
            sourceIndex: 172,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"oh"},{"index":1,"op":"eq_const","value":"shit"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Isn't life a pisser?");
            },
        },
        {
            name: "name167",
            priority: 0,
            sourceIndex: 173,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"oh"},{"index":1,"op":"eq_const","value":"no"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Mais oui.");
            },
        },
        {
            name: "name168",
            priority: 0,
            sourceIndex: 174,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"shit"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Hey, let's not mess up the place!");
            },
        },
        {
            name: "name169",
            priority: 0,
            sourceIndex: 175,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"rape"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["torture", m.x].flat());
            },
        },
        {
            name: "name170",
            priority: 0,
            sourceIndex: 176,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kiss"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "SMACK!");
            },
        },
        {
            name: "name171",
            priority: 0,
            sourceIndex: 177,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["ball","copulate","hump"]},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["fuck", m.x].flat());
            },
        },
        {
            name: "name172",
            priority: 0,
            sourceIndex: 178,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"make"},{"index":1,"op":"eq_const","value":"love"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"likes","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["fuck", m.x].flat());
            },
        },
        {
            name: "name173",
            priority: 0,
            sourceIndex: 179,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"masturbate"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You're too scared to get aroused at all.");
            },
        },
        {
            name: "name174",
            priority: 0,
            sourceIndex: 180,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"god"},{"index":1,"op":"eq_const","value":"damn"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["pray"].flat());
            },
        },
        {
            name: "name175",
            priority: 0,
            sourceIndex: 181,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tingle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Nothing happens.");
            },
        },
        {
            name: "name176",
            priority: 0,
            sourceIndex: 182,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"blow"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Whoooooosh!");
            },
        },
        {
            name: "name177",
            priority: 0,
            sourceIndex: 183,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"knock"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Thud, thud.");
            },
        },
        {
            name: "name178",
            priority: 0,
            sourceIndex: 184,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"neq_const","value":"orchid"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "That is not part of a balanced diet.");
            },
        },
        {
            name: "name179",
            priority: 0,
            sourceIndex: 185,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"holds","op":"eq_const","value":"nil"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You don't have", m.x, "on you.");
            },
        },
        {
            name: "name180",
            priority: 0,
            sourceIndex: 186,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_const","value":"shit"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "YEACH! Fuck off!");
            },
        },
        {
            name: "name181",
            priority: 0,
            sourceIndex: 187,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"go"},{"index":1,"op":"eq_const","value":"to"},{"index":2,"op":"eq_const","value":"hell"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Oh yeah! I'm fed up with you!!");
            rt.modify(m.$2, { "quit": "t" });
            },
        },
        {
            name: "name182",
            priority: 0,
            sourceIndex: 188,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"moose"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I see no moose.");
            },
        },
        {
            name: "name183",
            priority: 0,
            sourceIndex: 189,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"go"},{"index":1,"op":"eq_const","value":"blue"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Beat State.");
            },
        },
        {
            name: "name184",
            priority: 0,
            sourceIndex: 190,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pray"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "GOD responds:");
            rt.make("input", ["help"].flat());
            },
        },
        {
            name: "name185",
            priority: 0,
            sourceIndex: 191,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"damn"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Clean up your act.");
            },
        },
        {
            name: "name186",
            priority: 0,
            sourceIndex: 192,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"},{"index":1,"op":"eq_const","value":"sesame"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "No says me!");
            },
        },
        {
            name: "name187",
            priority: 0,
            sourceIndex: 193,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"i"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Quit talking about yourself and give me a command.");
            },
        },
        {
            name: "name188",
            priority: 0,
            sourceIndex: 194,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"give"},{"index":1,"op":"eq_var","var":"x"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The", m.y, "doesn't take", m.x);
            },
        },
        {
            name: "name189",
            priority: 0,
            sourceIndex: 195,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"give"},{"index":1,"op":"eq_var","var":"x"},{"index":2,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The", m.x, "doesn't want", m.y);
            },
        },
        {
            name: "name190",
            priority: 0,
            sourceIndex: 196,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"give"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Hey, after we went through all the trouble to get ", "\n", m.x, "I ain't gonna let you give it away.");
            },
        },
        {
            name: "name191",
            priority: 0,
            sourceIndex: 197,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"give"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "First we should get it.");
            },
        },
        {
            name: "name192",
            priority: 0,
            sourceIndex: 198,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_const","value":2}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"follow"},{"index":1,"op":"eq_const","value":"moose"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Crash!! Into the wall you go.");
            },
        },
        {
            name: "name193",
            priority: 0,
            sourceIndex: 199,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_const","value":2}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"follow"},{"index":1,"op":"eq_const","value":"moose"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "Last I saw he went west, so away we go.");
            rt.make("input", ["west"].flat());
            },
        },
        {
            name: "name194",
            priority: 0,
            sourceIndex: 200,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"follow"},{"index":1,"op":"eq_const","value":"moose"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I see no moose here.");
            },
        },
        {
            name: "name195",
            priority: 0,
            sourceIndex: 201,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"swim"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Why don't you wait until we are in the water.");
            },
        },
        {
            name: "name196",
            priority: 0,
            sourceIndex: 202,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"mount"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "going": "u", "went": "u" });
            },
        },
        {
            name: "name197",
            priority: 0,
            sourceIndex: 203,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"stand"},{"index":1,"op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["mount"].flat());
            },
        },
        {
            name: "name198",
            priority: 0,
            sourceIndex: 204,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["mount"].flat());
            },
        },
        {
            name: "name199",
            priority: 0,
            sourceIndex: 205,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"climb"},{"index":1,"op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["mount"].flat());
            },
        },
        {
            name: "name200",
            priority: 0,
            sourceIndex: 206,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"climb"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "going": "u", "went": "u" });
            },
        },
        {
            name: "name201",
            priority: 0,
            sourceIndex: 207,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"neq_const","value":"bus"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"off"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.modify(m.$3, { "going": "d", "went": "d" });
            },
        },
        {
            name: "name202",
            priority: 0,
            sourceIndex: 208,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"down"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "going": "d", "went": "d" });
            },
        },
        {
            name: "name203",
            priority: 0,
            sourceIndex: 209,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"dismount"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "going": "d", "went": "d" });
            },
        },
        {
            name: "name204",
            priority: 0,
            sourceIndex: 210,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sit"},{"index":1,"op":"eq_const","value":"in"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["sit", "on"].flat());
            },
        },
        {
            name: "name205",
            priority: 0,
            sourceIndex: 211,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sit"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I don't know how to sit on it.");
            },
        },
        {
            name: "name206",
            priority: 0,
            sourceIndex: 212,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":50}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"ontop","op":"neq_const","value":"nil"},{"field":"going","op":"eq_const","value":"d"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "ontop": null, "going": null });
            rt.write("\n", "You are back on Terra Firma.");
            },
        },
        {
            name: "name207",
            priority: 0,
            sourceIndex: 213,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":40}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"ontop","op":"neq_const","value":"nil"},{"field":"going","op":"neq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "ontop": null, "going": null });
            rt.write("\n", "You just fell to the ground.");
            rt.make("input", ["look"].flat());
            },
        },
        {
            name: "name208",
            priority: 0,
            sourceIndex: 214,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":40}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"siton","op":"neq_const","value":"nil"},{"field":"going","op":"neq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "siton": null });
            },
        },
        {
            name: "name209",
            priority: 0,
            sourceIndex: 215,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"siton","op":"neq_const","value":"nil"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"up"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "siton": null });
            rt.remove(m.$3);
            rt.write("\n", "You are now standing.");
            },
        },
        {
            name: "name210",
            priority: 0,
            sourceIndex: 216,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"stand"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "siton": null });
            rt.remove(m.$3);
            rt.write("\n", "You are no longer sitting.");
            },
        },
        {
            name: "name211",
            priority: 0,
            sourceIndex: 217,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"siton","op":"eq_var","var":"Q"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_var","var":"Q"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You'll have to stand up first.");
            },
        },
        {
            name: "name212",
            priority: 0,
            sourceIndex: 218,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"ontop","op":"eq_var","var":"Q"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_var","var":"Q"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Cute, why don't you get off it first.");
            },
        },
        {
            name: "name213",
            priority: 0,
            sourceIndex: 219,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"mount"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Why don't you drop it first.");
            },
        },
        {
            name: "name214",
            priority: 0,
            sourceIndex: 220,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["fondle","cuddle","hug","rub","tap","feel"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["touch"].flat());
            },
        },
        {
            name: "name215",
            priority: 0,
            sourceIndex: 221,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"touch"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "It is in your hands, and it feels like a", m.x, ".");
            },
        },
        {
            name: "name216",
            priority: 0,
            sourceIndex: 222,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"touch"},{"index":1,"op":"eq_const","value":"wall"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Surprize! The wall is flat and cold.");
            },
        },
        {
            name: "name217",
            priority: 0,
            sourceIndex: 223,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"painting"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"touch"},{"index":1,"op":"eq_const","value":"painting"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The painting is still wet!!");
            },
        },
        {
            name: "name218",
            priority: 0,
            sourceIndex: 224,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"touch"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You should get it first.");
            },
        },
        {
            name: "name219",
            priority: 0,
            sourceIndex: 225,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status2","op":"eq_const","value":"oil"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$5);
            rt.write("\n", "The oil won't go into the bottle, sorry.");
            },
        },
        {
            name: "name220",
            priority: 0,
            sourceIndex: 226,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status2","op":"eq_const","value":"oil"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"oil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$5);
            rt.write("\n", "The oil is too thick to go into the bottle.");
            },
        },
        {
            name: "name221",
            priority: 0,
            sourceIndex: 227,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"inside","op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is an empty bottle here.");
            },
        },
        {
            name: "name222",
            priority: 0,
            sourceIndex: 228,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":20}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"q"},{"field":"inside","op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a bottle of", m.q, "here.");
            },
        },
        {
            name: "name223",
            priority: 0,
            sourceIndex: 229,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"q"},{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_var","var":"q"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "place": "held" });
            rt.remove(m.$5);
            rt.write("\n", "You are now holding the bottle.");
            },
        },
        {
            name: "name224",
            priority: 0,
            sourceIndex: 230,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"bottle"},{"index":2,"op":"eq_var","var":"g"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"inside","op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.make("object", { "name": "bathwater", "inside": "bottle" });
            rt.write("\n", "The bottle is full of bathwater.");
            },
        },
        {
            name: "name225",
            priority: 0,
            sourceIndex: 231,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"beach"},{"field":"east","op":"eq_const","value":3}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"bottle"},{"index":2,"op":"eq_var","var":"g"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"inside","op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.make("object", { "name": "water", "inside": "bottle" });
            rt.write("\n", "The bottle is full of sparkling water.");
            },
        },
        {
            name: "name226",
            priority: 0,
            sourceIndex: 232,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"beach"},{"field":"east","op":"eq_const","value":3}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pour"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.remove(m.$5);
            rt.write("\n", "The bottle is empty.  The liquid disappears in the sand.");
            },
        },
        {
            name: "name227",
            priority: 0,
            sourceIndex: 233,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pour"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.remove(m.$5);
            rt.write("\n", "The bottle is now empty.");
            },
        },
        {
            name: "name228",
            priority: 0,
            sourceIndex: 234,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"underwater","op":"eq_const","value":"t"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"bottle"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"neq_const","value":"nil"},{"field":"inside","op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.make("object", { "name": "seawater", "inside": "bottle" });
            rt.write("\n", "The bottle is full of seawater.");
            },
        },
        {
            name: "name229",
            priority: 0,
            sourceIndex: 235,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"in_set","set":["seawater","bathwater","water"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["fill", "bottle"].flat());
            },
        },
        {
            name: "name230",
            priority: 0,
            sourceIndex: 236,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"up"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["fill", "bottle"].flat());
            },
        },
        {
            name: "name231",
            priority: 0,
            sourceIndex: 237,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"bottle"},{"index":2,"op":"eq_var","var":"g"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_var","var":"q"},{"field":"inside","op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "There is nothing to fill the bottle with.");
            },
        },
        {
            name: "name232",
            priority: 0,
            sourceIndex: 238,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The bottle is already full.");
            },
        },
        {
            name: "name233",
            priority: 0,
            sourceIndex: 239,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "You don't have a bottle to fill.");
            },
        },
        {
            name: "name234",
            priority: 0,
            sourceIndex: 240,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pour"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"underwater","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "Hmm, you want me to empty a bottle underwater.");
            rt.write("\n", "I'm afraid that is out of my league.");
            },
        },
        {
            name: "name235",
            priority: 0,
            sourceIndex: 241,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"water"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a wet spot here.");
            },
        },
        {
            name: "name236",
            priority: 0,
            sourceIndex: 242,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"seawater"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a salty wet spot here.");
            },
        },
        {
            name: "name237",
            priority: 0,
            sourceIndex: 243,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathwater"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a bit of a wet spot here.");
            },
        },
        {
            name: "name238",
            priority: 0,
            sourceIndex: 244,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"turpentine"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The turpentine evaporates as it leaves the bottle.");
            },
        },
        {
            name: "name239",
            priority: 0,
            sourceIndex: 245,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"q"},{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_var","var":"q"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "place": m.y });
            rt.remove(m.$4);
            },
        },
        {
            name: "name240",
            priority: 0,
            sourceIndex: 246,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"q"},{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pour"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.modify(m.$3, { "inside": null, "place": m.y });
            },
        },
        {
            name: "name241",
            priority: 0,
            sourceIndex: 247,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"in_set","set":["water","seawater","bathwater"]},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Sorry, I don't have a mop!");
            },
        },
        {
            name: "name242",
            priority: 0,
            sourceIndex: 248,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"water"},{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drink"},{"index":1,"op":"eq_const","value":"water"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.remove(m.$2);
            rt.remove(m.$4);
            rt.write("\n", "You have changed into a baby, the adventure must end.");
            rt.modify(m.$5, { "quit": "t" });
            },
        },
        {
            name: "name243",
            priority: 0,
            sourceIndex: 249,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"seawater"},{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drink"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$3);
            rt.write("\n", "Yech! It tastes salty!!");
            },
        },
        {
            name: "name244",
            priority: 0,
            sourceIndex: 250,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["water","empty"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["pour"].flat());
            },
        },
        {
            name: "name245",
            priority: 0,
            sourceIndex: 251,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There are matches here.");
            },
        },
        {
            name: "name246",
            priority: 0,
            sourceIndex: 252,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"match"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", [m.x, "matches"].flat());
            },
        },
        {
            name: "name247",
            priority: 0,
            sourceIndex: 253,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["light","strike","dry"]},{"index":1,"op":"eq_const","value":"matches"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "This house is to damp to light the matches in.");
            },
        },
        {
            name: "name248",
            priority: 0,
            sourceIndex: 254,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"dry"},{"index":1,"op":"eq_const","value":"matches"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The matches dry out.");
            },
        },
        {
            name: "name249",
            priority: 0,
            sourceIndex: 255,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["light","strike"]},{"index":1,"op":"eq_const","value":"matches"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The match lights but goes out quickly.");
            },
        },
        {
            name: "name250",
            priority: 0,
            sourceIndex: 256,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"smoke"},{"index":1,"op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"neq_const","value":"holds"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "You're not holding it.");
            },
        },
        {
            name: "name251",
            priority: 0,
            sourceIndex: 257,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"light"},{"index":1,"op":"eq_const","value":"marijuana"},{"index":2,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["smoke", "marijuana"].flat());
            },
        },
        {
            name: "name252",
            priority: 0,
            sourceIndex: 258,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"football"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is an official NFL football here!");
            },
        },
        {
            name: "name253",
            priority: 0,
            sourceIndex: 259,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"football"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kick"},{"index":1,"op":"eq_const","value":"football"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Oh wow! You kick it around,");
            rt.write("\n", "luckily nothing breaks.");
            rt.modify(m.$2, { "place": m.x });
            },
        },
        {
            name: "name254",
            priority: 0,
            sourceIndex: 260,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"football"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"throw"},{"index":1,"op":"eq_const","value":"football"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Throw is short.  Incomplete pass.  Fourth down, 10 to go.");
            rt.modify(m.$2, { "place": m.x });
            },
        },
        {
            name: "name255",
            priority: 0,
            sourceIndex: 261,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"ball"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", [m.x, "football"].flat());
            },
        },
        {
            name: "name256",
            priority: 0,
            sourceIndex: 262,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"what"},{"index":1,"op":"eq_const","value":"time"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"watch"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The time is", m.x);
            },
        },
        {
            name: "name257",
            priority: 0,
            sourceIndex: 263,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"watch"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There's a watch here, it even has a luminous dial.");
            },
        },
        {
            name: "name258",
            priority: 0,
            sourceIndex: 264,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"time"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["what", "time"].flat());
            },
        },
        {
            name: "name259",
            priority: 0,
            sourceIndex: 265,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"read"},{"index":1,"op":"eq_const","value":"watch"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["what", "time"].flat());
            },
        },
        {
            name: "name260",
            priority: 0,
            sourceIndex: 266,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tell"},{"index":1,"op":"eq_const","value":"time"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["what", "time"].flat());
            },
        },
        {
            name: "name261",
            priority: 0,
            sourceIndex: 267,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"what"},{"index":1,"op":"eq_const","value":"time"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I have no watch.");
            },
        },
        {
            name: "name262",
            priority: 0,
            sourceIndex: 268,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"look"},{"index":1,"op":"eq_const","value":"at"},{"index":2,"op":"eq_const","value":"watch"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["what", "time"].flat());
            },
        },
        {
            name: "name263",
            priority: 0,
            sourceIndex: 269,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"put"},{"index":1,"op":"eq_const","value":"on"},{"index":2,"op":"eq_const","value":"watch"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["get", "watch"].flat());
            },
        },
        {
            name: "name264",
            priority: 0,
            sourceIndex: 270,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"wind"},{"index":1,"op":"eq_const","value":"watch"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The watch is electric.");
            },
        },
        {
            name: "name265",
            priority: 0,
            sourceIndex: 271,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"},{"index":1,"op":"eq_const","value":"watch"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The watch is sealed shut.");
            },
        },
        {
            name: "name266",
            priority: 0,
            sourceIndex: 272,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"break"},{"index":1,"op":"eq_const","value":"watch"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The watch is shock resistent too.  It still works.");
            },
        },
        {
            name: "name267",
            priority: 0,
            sourceIndex: 273,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_const","value":600},{"field":"morning","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "morning": "t" });
            rt.write("\n", "'Cock-a-doodle-do'.  You hear a rooster crow.");
            },
        },
        {
            name: "name268",
            priority: 0,
            sourceIndex: 274,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_const","value":2000},{"field":"morning","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "morning": null });
            rt.write("\n", "'Clunk!'  I think night just fell.");
            },
        },
        {
            name: "name269",
            priority: 0,
            sourceIndex: 275,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_const","value":0},{"field":"midnight","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "midnight": "t" });
            },
        },
        {
            name: "name270",
            priority: 0,
            sourceIndex: 276,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"midnight","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "midnight": null });
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "A moose comes running out of a wall at full speed straight at you!!!");
            rt.write("\n", "He is right on top of you!!! He runs right through you and disappears.");
            },
        },
        {
            name: "name271",
            priority: 0,
            sourceIndex: 277,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"midnight","op":"eq_const","value":"t"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "midnight": null });
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "A moose comes running across the lawn at full speed straight at you!!!");
            rt.write("\n", "He is right on top of you.  He runs right through you and disappears.");
            },
        },
        {
            name: "name272",
            priority: 0,
            sourceIndex: 278,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"midnight","op":"eq_const","value":"t"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"underwater","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "BONG!");
            rt.write("\n", "A moose comes swimming out of the darkness, at full speed straight at you.");
            rt.write("\n", "He has on full scuba gear, and is really moving.");
            rt.write("\n", "He is right on top of you.  He runs right through you and disappears.");
            },
        },
        {
            name: "name273",
            priority: 0,
            sourceIndex: 279,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"art"},{"index":2,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", [m.x, "painting", m.y].flat());
            },
        },
        {
            name: "name274",
            priority: 0,
            sourceIndex: 280,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"painting"},{"field":"place","op":"eq_var","var":"x"},{"field":"covered","op":"eq_const","value":"t"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a work of ugly modern art on the ground.");
            },
        },
        {
            name: "name275",
            priority: 0,
            sourceIndex: 281,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"painting"},{"field":"place","op":"eq_var","var":"x"},{"field":"covered","op":"eq_const","value":"nil"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a valuable Rembrandt here.");
            },
        },
        {
            name: "name276",
            priority: 0,
            sourceIndex: 282,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"painting"},{"field":"place","op":"eq_const","value":"held"},{"field":"covered","op":"eq_const","value":"t"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"turpentine"},{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["clean","pour"]}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "covered": null, "treasure": "t" });
            rt.remove(m.$3);
            rt.remove(m.$4);
            rt.write("\n", "The ugly paint comes off! Underneath is a Rembrandt");
            rt.write("\n", "This will be very valuable.");
            rt.write("\n", "It is a person and a bust in the painting.");
            },
        },
        {
            name: "name277",
            priority: 0,
            sourceIndex: 283,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"painting"},{"field":"place","op":"eq_var","var":"x"},{"field":"covered","op":"eq_const","value":"t"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"turpentine"},{"field":"inside","op":"eq_const","value":"bottle"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["clean","pour"]}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "covered": null, "treasure": "t" });
            rt.remove(m.$4);
            rt.remove(m.$5);
            rt.write("\n", "The turpentine hits the painting and causes the paint to come off.");
            rt.write("\n", "The painting has a person contemplating a bust.");
            },
        },
        {
            name: "name278",
            priority: 0,
            sourceIndex: 284,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"remove"},{"index":1,"op":"eq_const","value":"paint"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["clean"].flat());
            },
        },
        {
            name: "name279",
            priority: 0,
            sourceIndex: 285,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"painting"},{"field":"place","op":"eq_const","value":"held"},{"field":"covered","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Upon closer look, this is worthless!");
            },
        },
        {
            name: "name280",
            priority: 0,
            sourceIndex: 286,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"money"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The money is here!");
            },
        },
        {
            name: "name281",
            priority: 0,
            sourceIndex: 287,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"smelly_room"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stereo"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"sound","op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "sound": "off" });
            },
        },
        {
            name: "name282",
            priority: 0,
            sourceIndex: 288,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stereo"},{"field":"place","op":"eq_const","value":"smelly_room"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"smelly_room"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"sound","op":"eq_const","value":"on"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"turn"},{"index":1,"op":"eq_const","value":"off"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "sound": "off" });
            rt.remove(m.$4);
            rt.write("\n", "The stereo is off.  But you broke it, so it won't turn on.");
            },
        },
        {
            name: "name283",
            priority: 0,
            sourceIndex: 289,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stereo"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is an expensive stereo here, worth many megabucks!!");
            },
        },
        {
            name: "name284",
            priority: 0,
            sourceIndex: 290,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"book"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a book on the ground.");
            },
        },
        {
            name: "name285",
            priority: 0,
            sourceIndex: 291,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"book"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"read"},{"index":1,"op":"eq_const","value":"book"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Vampires can only be destroyed by a stake through the heart,");
            rt.write("\n", "or by the light of day.  They are invunerable to all other");
            rt.write("\n", "attacks.  They dislike garlic and fear crosses.  They are known");
            rt.write("\n", " to frequent dark rooms.");
            },
        },
        {
            name: "name286",
            priority: 0,
            sourceIndex: 292,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"gold"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is gold here!!!!");
            },
        },
        {
            name: "name287",
            priority: 0,
            sourceIndex: 293,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"horn"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a magic unicorn horn here.");
            },
        },
        {
            name: "name288",
            priority: 0,
            sourceIndex: 294,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"horn"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"horn"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_const","value":"horn"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.remove(m.$4);
            rt.write("\n", "When you drop the horn, it and the one on the ground merge together.");
            },
        },
        {
            name: "name289",
            priority: 0,
            sourceIndex: 295,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dining_room"},{"field":"ontop","op":"eq_const","value":"stool"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"horn"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"horn"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The horn won't come off.");
            },
        },
        {
            name: "name290",
            priority: 0,
            sourceIndex: 296,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"horn"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"blow"},{"index":1,"op":"eq_const","value":"horn"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"clue","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.remove(m.$2);
            rt.write("\n", "A terrific noise comes from the horn.  BLAT!!!");
            rt.write("\n", "The horn disappears from your hands.");
            rt.write("\n", "Your body shakes and you black out ......");
            rt.modify(m.$3, { "clue": "t" });
            },
        },
        {
            name: "name291",
            priority: 0,
            sourceIndex: 297,
            conditions: [{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"clue","op":"eq_const","value":"t"},{"field":"grave_status","op":"eq_const","value":"undug"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "A spirit appears to you in your sleep.");
            rt.write("\n", "Your mind is filled with the following phrase:");
            rt.write("\n", "'As your family is sheep, the gold that is YOUR color must be found");
            rt.write("\n", "before you can escape this estate.' ");
            rt.modify(m.$1, { "clue": null });
            },
        },
        {
            name: "name292",
            priority: 0,
            sourceIndex: 298,
            conditions: [{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"clue","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "clue": null });
            rt.write("\n", "When you wake you see smoke form the words:");
            rt.write("\n", "EVERY OPTIon on A MACHINE HAS A PURPOSE.  The smoke then dissapates.");
            },
        },
        {
            name: "name293",
            priority: 0,
            sourceIndex: 299,
            conditions: [{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"clue","op":"eq_const","value":"t"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_const","value":"lawn"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You dream of a garden of flowers.");
            rt.modify(m.$1, { "clue": null });
            },
        },
        {
            name: "name294",
            priority: 0,
            sourceIndex: 300,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"them"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", [m.x, "candlesticks"].flat());
            },
        },
        {
            name: "name295",
            priority: 0,
            sourceIndex: 301,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"candlesticks"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a pair of silver candlesticks here!! No candles though.");
            },
        },
        {
            name: "name296",
            priority: 0,
            sourceIndex: 302,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"candlesticks"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"form"},{"index":1,"op":"eq_const","value":"cross"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "state": "crossed" });
            rt.remove(m.$2);
            rt.write("\n", "The candlesticks are in a cross.");
            },
        },
        {
            name: "name297",
            priority: 0,
            sourceIndex: 303,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"candlesticks"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"make"},{"index":1,"op":"eq_const","value":"cross"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "state": "crossed" });
            rt.remove(m.$2);
            rt.write("\n", "The candlesticks are in a cross.");
            },
        },
        {
            name: "name298",
            priority: 0,
            sourceIndex: 304,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"candlesticks"},{"field":"place","op":"eq_const","value":"held"},{"field":"state","op":"eq_const","value":"crossed"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_const","value":"candlesticks"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "place": m.x, "state": null });
            rt.remove(m.$3);
            },
        },
        {
            name: "name299",
            priority: 0,
            sourceIndex: 305,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["make","form"]},{"index":1,"op":"eq_const","value":"cross"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "You have nothing to form a cross with, arms don't work.");
            },
        },
        {
            name: "name300",
            priority: 0,
            sourceIndex: 306,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"cross"},{"index":1,"op":"eq_const","value":"candlesticks"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["make", "cross"].flat());
            },
        },
        {
            name: "name301",
            priority: 0,
            sourceIndex: 307,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"chair"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is an old style chair on the ground.");
            },
        },
        {
            name: "name302",
            priority: 0,
            sourceIndex: 308,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"chair"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The plate of the back of the chair says 'MADE BY LOUIS XIV'");
            },
        },
        {
            name: "name303",
            priority: 0,
            sourceIndex: 309,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"chair"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"mount"},{"index":1,"op":"eq_const","value":"chair"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$3);
            rt.write("\n", "The priceless chair breaks under your weight.");
            rt.write("\n", "It then disappears.");
            },
        },
        {
            name: "name304",
            priority: 0,
            sourceIndex: 310,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"chair"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sit"},{"index":1,"op":"eq_const","value":"on"},{"index":2,"op":"eq_const","value":"chair"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$3);
            rt.write("\n", "You sat on the chair and it broke!");
            rt.write("\n", "It disappears.");
            },
        },
        {
            name: "name305",
            priority: 0,
            sourceIndex: 311,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stool"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a sturdy stool here.");
            },
        },
        {
            name: "name306",
            priority: 0,
            sourceIndex: 312,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stool"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sit"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$1, { "siton": "stool" });
            rt.write("\n", "You're sitting on the stool.");
            },
        },
        {
            name: "name307",
            priority: 0,
            sourceIndex: 313,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stool"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sit"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I suggest you drop the stool first.");
            },
        },
        {
            name: "name308",
            priority: 0,
            sourceIndex: 314,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stool"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"mount"},{"index":1,"op":"eq_const","value":"stool"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "siton": "stool" });
            rt.remove(m.$3);
            rt.write("\n", "You are on the stool.");
            },
        },
        {
            name: "name309",
            priority: 0,
            sourceIndex: 315,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"climb"},{"index":1,"op":"eq_const","value":"stool"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["mount", "stool"].flat());
            },
        },
        {
            name: "name310",
            priority: 0,
            sourceIndex: 316,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"chest"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a chest of treasure!!!");
            },
        },
        {
            name: "name311",
            priority: 0,
            sourceIndex: 317,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"chest"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"},{"index":1,"op":"eq_const","value":"chest"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Give up, the chest doesn't open, but is worth gigabucks the way it is.");
            },
        },
        {
            name: "name312",
            priority: 0,
            sourceIndex: 318,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"conch"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"blow"},{"index":1,"op":"eq_const","value":"conch"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "'Hoooonk!!'");
            },
        },
        {
            name: "name313",
            priority: 0,
            sourceIndex: 319,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"conch"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a large conch shell here.");
            },
        },
        {
            name: "name314",
            priority: 0,
            sourceIndex: 320,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"shell"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", [m.x, "conch"].flat());
            },
        },
        {
            name: "name315",
            priority: 0,
            sourceIndex: 321,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"conch"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"listen"},{"index":1,"op":"eq_const","value":"conch"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "You hear the ocean 'rumble'.");
            },
        },
        {
            name: "name316",
            priority: 0,
            sourceIndex: 322,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"token"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a token here.");
            },
        },
        {
            name: "name317",
            priority: 0,
            sourceIndex: 323,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"tokens"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There are tokens here.");
            },
        },
        {
            name: "name318",
            priority: 0,
            sourceIndex: 324,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"bite"},{"index":1,"op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The", m.x, "bites back, Chomp!!");
            },
        },
        {
            name: "name319",
            priority: 0,
            sourceIndex: 325,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"bite"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You must be holding what you are trying to bite.");
            },
        },
        {
            name: "name0320",
            priority: 0,
            sourceIndex: 326,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"treasure","op":"eq_const","value":"t"},{"field":"place","op":"eq_const","value":"held"},{"field":"scored","op":"eq_const","value":"nil"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "score": rt.compute(m.y, "+", 15) });
            rt.modify(m.$1, { "scored": "t" });
            },
        },
        {
            name: "name0321",
            priority: 0,
            sourceIndex: 327,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"lawn"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"water"},{"field":"inside","op":"eq_const","value":"bottle"},{"field":"xscore","op":"eq_const","value":"nil"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "score": rt.compute(5, "+", m.y) });
            rt.modify(m.$2, { "xscore": "t" });
            },
        },
        {
            name: "name0322",
            priority: 0,
            sourceIndex: 328,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pour"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bottle"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"water"},{"field":"xscore","op":"eq_const","value":"t"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"z"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$4, { "score": rt.compute(m.z, "-", 5) });
            },
        },
        {
            name: "name0323",
            priority: 0,
            sourceIndex: 329,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"treasure","op":"eq_const","value":"t"},{"field":"xscore","op":"eq_const","value":"nil"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "score": rt.compute(5, "+", m.y) });
            rt.modify(m.$1, { "name": m.x, "xscore": "t" });
            },
        },
        {
            name: "name0324",
            priority: 0,
            sourceIndex: 330,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"xscore","op":"eq_const","value":"t"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "xscore": null });
            rt.modify(m.$2, { "score": rt.compute(m.y, "-", 5) });
            },
        },
        {
            name: "name321",
            priority: 0,
            sourceIndex: 331,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"score"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Score =", m.x);
            rt.remove(m.$1);
            },
        },
        {
            name: "name322",
            priority: 0,
            sourceIndex: 332,
            conditions: [{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"quit","op":"eq_const","value":"t"},{"field":"score","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Your final score is", m.x);
            rt.write("\n", "The total possible is 440");
            rt.make("turnoff", [].flat());
            },
        },
        {
            name: "name323",
            priority: 0,
            sourceIndex: 333,
            conditions: [{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"cmp","cmp":"<","value":20}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Hmm...  I don't think you tried very hard.");
            },
        },
        {
            name: "name324",
            priority: 0,
            sourceIndex: 334,
            conditions: [{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                engine.halt();
            },
        },
        {
            name: "name325",
            priority: 0,
            sourceIndex: 335,
            conditions: [{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"cmp","cmp":"<","value":50},{"field":"score","op":"cmp","cmp":">","value":21}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Rank Novice! Are you scared of your own shadow?");
            },
        },
        {
            name: "name326",
            priority: 0,
            sourceIndex: 336,
            conditions: [{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"cmp","cmp":">","value":51},{"field":"score","op":"cmp","cmp":"<","value":80}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Beginning Ghost Hunter");
            },
        },
        {
            name: "name327",
            priority: 0,
            sourceIndex: 337,
            conditions: [{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"cmp","cmp":">","value":81},{"field":"score","op":"cmp","cmp":"<","value":140}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Reasonable Spirit Fighter");
            },
        },
        {
            name: "name328",
            priority: 0,
            sourceIndex: 338,
            conditions: [{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"cmp","cmp":">","value":141},{"field":"score","op":"cmp","cmp":"<","value":220}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Intermediate Haunt Hacker");
            },
        },
        {
            name: "name329",
            priority: 0,
            sourceIndex: 339,
            conditions: [{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"cmp","cmp":">","value":221},{"field":"score","op":"cmp","cmp":"<","value":290}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Advanced Monster Killer");
            },
        },
        {
            name: "name330",
            priority: 0,
            sourceIndex: 340,
            conditions: [{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"cmp","cmp":">","value":291},{"field":"score","op":"cmp","cmp":"<","value":360}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Master Haunter!!");
            },
        },
        {
            name: "name331",
            priority: 0,
            sourceIndex: 341,
            conditions: [{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"cmp","cmp":">","value":361}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Fearless Vampire Killer");
            },
        },
        {
            name: "name332",
            priority: 0,
            sourceIndex: 342,
            conditions: [{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"likes","op":"eq_var","var":"x"}]},{"cls":"turnoff","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"cmp","cmp":">","value":435}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "and waster of many cycles.");
            },
        },
        {
            name: "name333",
            priority: 0,
            sourceIndex: 343,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"pearls"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There are huge pearls here!!!");
            },
        },
        {
            name: "name334",
            priority: 0,
            sourceIndex: 344,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"diamonds"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There are diamonds here!");
            },
        },
        {
            name: "name335",
            priority: 0,
            sourceIndex: 345,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_var","var":"x"},{"field":"state","op":"eq_const","value":"plant"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a beautiful black orchid here.");
            },
        },
        {
            name: "name336",
            priority: 0,
            sourceIndex: 346,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_var","var":"x"},{"field":"state","op":"eq_const","value":"plant"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"smell"},{"index":1,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Yum! The orchid smells delicious!");
            },
        },
        {
            name: "name337",
            priority: 0,
            sourceIndex: 347,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"smell"},{"index":1,"op":"eq_const","value":"orchid"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I like the odor! Sniff.  Sniff.");
            },
        },
        {
            name: "name338",
            priority: 0,
            sourceIndex: 348,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pick"},{"index":1,"op":"eq_const","value":"orchid"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["get", "orchid"].flat());
            },
        },
        {
            name: "name339",
            priority: 0,
            sourceIndex: 349,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"smell"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "Ah CHOOOO! There is alot of dust around here.");
            },
        },
        {
            name: "name340",
            priority: 0,
            sourceIndex: 350,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sniff"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["smell", m.x].flat());
            },
        },
        {
            name: "name341",
            priority: 0,
            sourceIndex: 351,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_var","var":"x"},{"field":"tied","op":"eq_const","value":"noose"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is rope in a noose here.");
            },
        },
        {
            name: "name342",
            priority: 0,
            sourceIndex: 352,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_var","var":"x"},{"field":"tied","op":"eq_const","value":"untied"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is some loose rope here.");
            },
        },
        {
            name: "name343",
            priority: 0,
            sourceIndex: 353,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"neq_var","var":"x"},{"field":"tied","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "A rope is tied to the", m.y);
            },
        },
        {
            name: "name344",
            priority: 0,
            sourceIndex: 354,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"place","op":"neq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_var","var":"x"},{"field":"tied","op":"eq_var","var":"y"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "An end of a rope is here.");
            },
        },
        {
            name: "name345",
            priority: 0,
            sourceIndex: 355,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_var","var":"x"},{"field":"tied","op":"eq_var","var":"y"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "An end of the rope is here, tied to the ", m.y);
            },
        },
        {
            name: "name346",
            priority: 0,
            sourceIndex: 356,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_var","var":"x"},{"field":"tied","op":"eq_var","var":"y"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "A rope tied to the", m.y, "is here.");
            },
        },
        {
            name: "name347",
            priority: 0,
            sourceIndex: 357,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"},{"field":"tied","op":"eq_const","value":"noose"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"untie"},{"index":1,"op":"eq_const","value":"rope"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "tied": "untied" });
            rt.remove(m.$2);
            rt.write("\n", "The rope is now untied.");
            },
        },
        {
            name: "name348",
            priority: 0,
            sourceIndex: 358,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"tied","op":"eq_const","value":"noose"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"hang"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "No hanging around here.");
            },
        },
        {
            name: "name349",
            priority: 0,
            sourceIndex: 359,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"},{"field":"tied","op":"eq_const","value":"noose"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The rope is already in knots.");
            },
        },
        {
            name: "name350",
            priority: 0,
            sourceIndex: 360,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Look, don't tie", m.x, ", tie rope to something you have on you.");
            },
        },
        {
            name: "name351",
            priority: 0,
            sourceIndex: 361,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tieup"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["tie", "rope", "to", m.x].flat());
            },
        },
        {
            name: "name352",
            priority: 0,
            sourceIndex: 362,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"},{"field":"tied","op":"eq_const","value":"untied"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "tied": m.x });
            rt.remove(m.$3);
            rt.write("\n", "The rope is tied to", m.x, ".");
            },
        },
        {
            name: "name353",
            priority: 0,
            sourceIndex: 363,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"},{"field":"tied","op":"eq_var","var":"z"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The rope is already tied to the", m.z);
            rt.write("\n", "I can tie the rope to only one object at a time.");
            },
        },
        {
            name: "name354",
            priority: 0,
            sourceIndex: 364,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"side","op":"eq_var","var":"__pos_side_y","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_y","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_y","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_var","var":"y"},{"field":"side","op":"eq_var","var":"__pos_side_y","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_y","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_y","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"neq_const","value":"held"},{"field":"tied","op":"eq_var","var":"x"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "place": "held" });
            rt.write("\n", "You get the rope first and then ...");
            },
        },
        {
            name: "name355",
            priority: 0,
            sourceIndex: 365,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"neq_const","value":"held"},{"field":"tied","op":"eq_var","var":"x"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"rope"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "place": "held" });
            rt.remove(m.$4);
            rt.write("\n", "You just pulled in the rest of the rope.");
            },
        },
        {
            name: "name356",
            priority: 0,
            sourceIndex: 366,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"Z"},{"field":"side","op":"eq_var","var":"__pos_side_Z","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_Z","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_Z","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cecil"},{"field":"place","op":"eq_var","var":"Z"},{"field":"side","op":"eq_var","var":"__pos_side_Z","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_Z","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_Z","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_const","value":"cecil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "You can't tie cecil down!");
            },
        },
        {
            name: "name357",
            priority: 0,
            sourceIndex: 367,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_const","value":"monster"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "That would be very foolish.");
            },
        },
        {
            name: "name358",
            priority: 0,
            sourceIndex: 368,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"Z"},{"field":"side","op":"eq_var","var":"__pos_side_Z","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_Z","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_Z","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"},{"field":"tied","op":"eq_const","value":"untied"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dracula"},{"field":"place","op":"eq_var","var":"Z"},{"field":"side","op":"eq_var","var":"__pos_side_Z","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_Z","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_Z","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_const","value":"dracula"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "You can't get Dracula, not to mention tie him up.");
            },
        },
        {
            name: "name359",
            priority: 0,
            sourceIndex: 369,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"bind_set","set":["candy","marijuana","cube","orchid"],"var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"},{"field":"tied","op":"eq_const","value":"untied"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "That is too small for the rope to be tied to.");
            },
        },
        {
            name: "name360",
            priority: 0,
            sourceIndex: 370,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"lasso"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["tie", "rope", "to", m.x].flat());
            },
        },
        {
            name: "name361",
            priority: 0,
            sourceIndex: 371,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"},{"field":"tied","op":"eq_const","value":"untied"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_const","value":"rope"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "tied": "noose" });
            rt.remove(m.$2);
            rt.write("\n", "The rope is tied in knots.");
            },
        },
        {
            name: "name362",
            priority: 0,
            sourceIndex: 372,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"torture_chamber"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"likes","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"damsel"},{"field":"state","op":"eq_const","value":"free"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$5);
            rt.make("input", ["torture", "damsel"].flat());
            },
        },
        {
            name: "name363",
            priority: 0,
            sourceIndex: 373,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"chest"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"octopus"},{"field":"alive","op":"eq_const","value":"t"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_const","value":"chest"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$5);
            rt.write("\n", "The octopus blocks your way.");
            },
        },
        {
            name: "name364",
            priority: 0,
            sourceIndex: 374,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Either you aren't holding ", m.x, ", or I can't tie the rope to it.");
            },
        },
        {
            name: "name365",
            priority: 0,
            sourceIndex: 375,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"neq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"tie"},{"index":1,"op":"eq_const","value":"rope"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_var","var":"z"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You don't have the rope.");
            },
        },
        {
            name: "name366",
            priority: 0,
            sourceIndex: 376,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"untie"},{"index":1,"op":"eq_const","value":"rope"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"tied","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "tied": "untied" });
            rt.write("\n", "The rope is no longer tied to", m.x, ".");
            },
        },
        {
            name: "name367",
            priority: 0,
            sourceIndex: 377,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pull"},{"index":1,"op":"eq_const","value":"rope"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"place","op":"eq_const","value":"held"},{"field":"tied","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Umph! You just pulled in the", m.x, ".");
            rt.remove(m.$1);
            rt.modify(m.$3, { "place": "held" });
            },
        },
        {
            name: "name368x5",
            priority: 0,
            sourceIndex: 378,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pull"},{"index":1,"op":"eq_const","value":"rope"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"tied","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "place": "held" });
            rt.write("\n", "You now have all the rope.");
            },
        },
        {
            name: "name368",
            priority: 0,
            sourceIndex: 379,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"untie"},{"index":1,"op":"eq_const","value":"rope"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"tied","op":"eq_const","value":"untied"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The rope isn't tied to anything.");
            },
        },
        {
            name: "name369",
            priority: 0,
            sourceIndex: 380,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"untie"},{"index":1,"op":"eq_const","value":"rope"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"tied","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The rope is tied to the", m.x, ", which you aren't holding.");
            },
        },
        {
            name: "name370",
            priority: 0,
            sourceIndex: 381,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathysphere"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pull"},{"index":1,"op":"eq_const","value":"rope"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"tied","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"ocean"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wdoor"},{"field":"door","op":"eq_const","value":"closed"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The airlock door is closed on the rope.");
            },
        },
        {
            name: "name371",
            priority: 0,
            sourceIndex: 382,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wetsuit"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a wetsuit, with everything needed to survive underwater.");
            },
        },
        {
            name: "name372",
            priority: 0,
            sourceIndex: 383,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["don","wear"]},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["put", "on", m.x].flat());
            },
        },
        {
            name: "name373",
            priority: 0,
            sourceIndex: 384,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wetsuit"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"put"},{"index":1,"op":"eq_const","value":"on"},{"index":2,"op":"eq_const","value":"wetsuit"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "place": "held" });
            },
        },
        {
            name: "name374",
            priority: 0,
            sourceIndex: 385,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wetsuit"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"put"},{"index":1,"op":"eq_const","value":"on"},{"index":2,"op":"eq_const","value":"wetsuit"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "wears": "t" });
            rt.remove(m.$2);
            rt.write("\n", "You are wearing a wetsuit.");
            },
        },
        {
            name: "name375",
            priority: 0,
            sourceIndex: 386,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wetsuit"},{"field":"wears","op":"eq_const","value":"t"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["remove","doff"]},{"index":1,"op":"eq_const","value":"wetsuit"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "wears": null });
            rt.remove(m.$2);
            rt.write("\n", "Your wetsuit is in your arms.");
            },
        },
        {
            name: "name376",
            priority: 0,
            sourceIndex: 387,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_const","value":"wetsuit"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wetsuit"},{"field":"place","op":"eq_const","value":"held"},{"field":"wears","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "wears": null, "place": m.x });
            },
        },
        {
            name: "name377",
            priority: 0,
            sourceIndex: 388,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"speargun"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a speargun that shoots underwater.");
            },
        },
        {
            name: "name378",
            priority: 0,
            sourceIndex: 389,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"speargun"},{"field":"place","op":"eq_var","var":"x"},{"field":"state","op":"eq_const","value":"loaded"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The speargun is loaded, ready to fire.");
            },
        },
        {
            name: "name379",
            priority: 0,
            sourceIndex: 390,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"speargun"},{"field":"place","op":"eq_const","value":"held"},{"field":"state","op":"eq_const","value":"loaded"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"underwater","op":"eq_const","value":"nil"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"shoot"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "state": "unloaded" });
            rt.remove(m.$4);
            rt.write("\n", "The gun goes off.  BRRRANG!!");
            rt.write("\n", "The backlash from the speargun snaps your neck!");
            rt.modify(m.$5, { "quit": "t" });
            },
        },
        {
            name: "name380",
            priority: 0,
            sourceIndex: 391,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"speargun"},{"field":"place","op":"eq_const","value":"held"},{"field":"state","op":"eq_const","value":"unloaded"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"shoot"},{"index":1,"op":"eq_const","value":"speargun"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The gun isn't loaded with a spear!!");
            },
        },
        {
            name: "name381",
            priority: 0,
            sourceIndex: 392,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"speargun"},{"field":"place","op":"eq_const","value":"held"},{"field":"state","op":"eq_const","value":"unloaded"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"spear"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"load"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The gun is now loaded.");
            rt.modify(m.$1, { "state": "loaded" });
            },
        },
        {
            name: "name382",
            priority: 0,
            sourceIndex: 393,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"spear"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a speargun spear here.");
            },
        },
        {
            name: "name383",
            priority: 0,
            sourceIndex: 394,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"gun"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", [m.x, "speargun"].flat());
            },
        },
        {
            name: "name384",
            priority: 0,
            sourceIndex: 395,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["pres","p","depress","push"]},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["press", m.x].flat());
            },
        },
        {
            name: "name385",
            priority: 0,
            sourceIndex: 396,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"coins"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You see many coins here!");
            },
        },
        {
            name: "name386",
            priority: 0,
            sourceIndex: 397,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bone"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a bone here that you identify as from the MISSING LINK!");
            },
        },
        {
            name: "name387",
            priority: 0,
            sourceIndex: 398,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"soap"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a bar of soap here.");
            },
        },
        {
            name: "name388",
            priority: 0,
            sourceIndex: 399,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"gem"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a valuable gem here.");
            },
        },
        {
            name: "name396",
            priority: 0,
            sourceIndex: 400,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"jade"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a piece of valuable jade here.");
            },
        },
        {
            name: "name397",
            priority: 0,
            sourceIndex: 401,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"why"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "Hey, I don't know.");
            rt.write("\n", "Send mail to Laird@cmua if you have questions.");
            },
        },
        {
            name: "name398",
            priority: 0,
            sourceIndex: 402,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_const","value":"orchid"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.remove(m.$2);
            rt.write("\n", "Chomp! chomp.  I don't think your real family had a taste for orchids.");
            rt.write("\n", "It looks like you aren't one of those that knows how to digest orchids.");
            },
        },
        {
            name: "name399",
            priority: 0,
            sourceIndex: 403,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_const","value":"orchid"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.remove(m.$2);
            rt.remove(m.$3);
            rt.write("\n", "An orchid a day keeps the crazies away!");
            rt.make("command", { "string": "eat_it" });
            },
        },
        {
            name: "name400",
            priority: 0,
            sourceIndex: 404,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"eat"},{"index":1,"op":"eq_const","value":"orchid"}]}],
            action: async (m, wm, term) => {
                rt.make("input", ["get", "orchid"].flat());
            },
        },
        {
            name: "name401",
            priority: 0,
            sourceIndex: 405,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"say"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", [m.x].flat());
            rt.write("\n", "You can just type", m.x);
            rt.write("\n", "and I'll try and understand", m.x, "right now.");
            },
        },
        {
            name: "name402",
            priority: 0,
            sourceIndex: 406,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["scream","shout","yell"]},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "'", m.x, "!!'");
            rt.remove(m.$1);
            rt.write("\n", "I don't think anybody is listening.");
            },
        },
        {
            name: "name403",
            priority: 0,
            sourceIndex: 407,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"hello"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "Your greeting is met with silence.");
            },
        },
        {
            name: "name404",
            priority: 0,
            sourceIndex: 408,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fly"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "You flap your arms, but nothing happens.");
            },
        },
        {
            name: "name405",
            priority: 0,
            sourceIndex: 409,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"afihywn"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "Hmm, is that Australian?");
            },
        },
        {
            name: "name1009",
            priority: 1,
            sourceIndex: 410,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "We are at an intersection of two streets going n-s and e-w.");
            rt.write("\n", "There is a bus stop here.");
            rt.write("\n", "To the west a bus is pulling away from the next bus stop.");
            },
        },
        {
            name: "name1010",
            priority: 0,
            sourceIndex: 411,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"neq_const","value":"nil"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"x"},{"field":"btime","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "bus_stop" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "btime": rt.compute(m.x, "+", 16) });
            },
        },
        {
            name: "name1011",
            priority: 0,
            sourceIndex: 412,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"x"},{"field":"btime","op":"eq_var","var":"x"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"bus_stopped","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "bus_stopped": "t" });
            },
        },
        {
            name: "name1012",
            priority: 1,
            sourceIndex: 413,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"bus_stopped","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "A bus has stopped in front of us.");
            },
        },
        {
            name: "name1013",
            priority: 0,
            sourceIndex: 414,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"wait"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "La dee da.");
            rt.remove(m.$1);
            },
        },
        {
            name: "name1014",
            priority: 0,
            sourceIndex: 415,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"wait"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"bus_stopped","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$3, { "bus_stopped": "t" });
            rt.write("\n", "Yawn!");
            },
        },
        {
            name: "name1015",
            priority: 0,
            sourceIndex: 416,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["mount","board"]}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["enter", "bus"].flat());
            },
        },
        {
            name: "name1016",
            priority: 0,
            sourceIndex: 417,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"bus_stopped","op":"eq_const","value":"t"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"tokens"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "name": "on_bus" });
            rt.modify(m.$3, { "bus_stopped": null });
            rt.remove(m.$4);
            rt.make("object", { "name": "token", "place": "held" });
            },
        },
        {
            name: "name1017",
            priority: 0,
            sourceIndex: 418,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"bus_stopped","op":"eq_const","value":"t"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"token"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "name": "on_bus" });
            rt.modify(m.$3, { "bus_stopped": null });
            rt.remove(m.$4);
            },
        },
        {
            name: "name1018",
            priority: 0,
            sourceIndex: 419,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"take"},{"index":1,"op":"eq_const","value":"ride"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["enter", "bus"].flat());
            },
        },
        {
            name: "name1019",
            priority: 0,
            sourceIndex: 420,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"bus_stopped","op":"eq_const","value":"t"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"tokens"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"token"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "You don't have any tokens.  You sit on the corner and starve to death.");
            rt.modify(m.$3, { "quit": "t" });
            },
        },
        {
            name: "name1020",
            priority: 0,
            sourceIndex: 421,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"bus_stopped","op":"eq_const","value":"t"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"token"},{"field":"place","op":"eq_const","value":"bus"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The bus doors remain closed.");
            },
        },
        {
            name: "name1021",
            priority: 0,
            sourceIndex: 422,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"bus_stopped","op":"eq_const","value":"t"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"tokens"},{"field":"place","op":"eq_const","value":"bus"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You stumble over some tokens and bang your head on the bus.");
            },
        },
        {
            name: "name1022",
            priority: 0,
            sourceIndex: 423,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"on_bus"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "bus" });
            rt.make("place", { "visited": "t" });
            rt.write("\n", "As you find your seat, you notice the bus is empty.");
            rt.write("\n", "There isn't even a driver.  But before you can change your mind,");
            rt.write("\n", "the bus starts up and drives away from the intersection.");
            rt.write("\n", "Va Vooooom!");
            rt.write("\n", "Looking out the window you see many intersections flash by.");
            rt.write("\n", " ");
            rt.write("\n", "After a while the intersections get farther apart.");
            rt.write("\n", "The bus is now in the outskirts of town.");
            rt.write("\n", "The bus comes up to an old mansion with a high gate surrounding it and stops.");
            rt.write("\n", "A voice comes over the speaker: 'ALL OUT, END OF THE LINE.'");
            },
        },
        {
            name: "name1023",
            priority: 1,
            sourceIndex: 424,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", " ");
            rt.write("\n", "You are in a bus.  There isn't a driver and the exit doors are open.");
            },
        },
        {
            name: "name1024",
            priority: 0,
            sourceIndex: 425,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"off"},{"index":2,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["exit"].flat());
            },
        },
        {
            name: "name1025",
            priority: 0,
            sourceIndex: 426,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["leave","depart","disembark"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["exit"].flat());
            },
        },
        {
            name: "name1026",
            priority: 0,
            sourceIndex: 427,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"exit"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$1, { "name": "lawn", "side": "out", "east": 5, "north": 2 });
            rt.write("\n", "The bus drives off as you get off.");
            },
        },
        {
            name: "name1027",
            priority: 0,
            sourceIndex: 428,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"out"},{"index":2,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["exit"].flat());
            },
        },
        {
            name: "name1028",
            priority: 0,
            sourceIndex: 429,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["chase","follow","catch"]},{"index":1,"op":"eq_const","value":"bus"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I'm assuming that means GO WEST.");
            rt.modify(m.$3, { "going": ["w", "went", "w"] });
            },
        },
        {
            name: "name1029",
            priority: 1,
            sourceIndex: 430,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_const","value":2226}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Hint: patience is a virtue.");
            },
        },
        {
            name: "name1030",
            priority: 0,
            sourceIndex: 431,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"hijack"},{"index":1,"op":"eq_const","value":"bus"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Sorry, this bus doesn't go to Cuba, that's another line.");
            },
        },
        {
            name: "name1031",
            priority: 0,
            sourceIndex: 432,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"driver"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "There isn't a driver on this bus.");
            },
        },
        {
            name: "name1032",
            priority: 0,
            sourceIndex: 433,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drive"},{"index":1,"op":"eq_const","value":"bus"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I'm sorry but you don't have a chauffeur's license.");
            },
        },
        {
            name: "name1033",
            priority: 0,
            sourceIndex: 434,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"bus"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Give up and get off the bus.");
            },
        },
        {
            name: "name1034",
            priority: 0,
            sourceIndex: 435,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bus_stop"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"hail"},{"index":1,"op":"eq_const","value":"bus"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The bus does not stop for you.");
            },
        },
        {
            name: "name1035",
            priority: 0,
            sourceIndex: 436,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"bind_set","set":[2,3,4,5,6,7],"var":"C"},{"field":"north","op":"in_set","set":[1,2,8]}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "east": rt.compute(1, "+", m.C) });
            },
        },
        {
            name: "name01035",
            priority: 0,
            sourceIndex: 437,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":1}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "east": 2 });
            },
        },
        {
            name: "name1036",
            priority: 0,
            sourceIndex: 438,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"in_set","set":[1,2,8]},{"field":"north","op":"bind_set","set":[2,3,4,5,6,7],"var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "north": rt.compute(1, "+", m.N) });
            },
        },
        {
            name: "name001036",
            priority: 0,
            sourceIndex: 439,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"north","op":"eq_const","value":1}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "north": 2 });
            },
        },
        {
            name: "name1037",
            priority: 0,
            sourceIndex: 440,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"in_set","set":[1,2,8]},{"field":"north","op":"bind_set","set":[3,4,5,6,7,8],"var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "north": rt.compute(m.N, "-", 1) });
            },
        },
        {
            name: "name01037",
            priority: 0,
            sourceIndex: 441,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"north","op":"eq_const","value":2}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "north": 1 });
            },
        },
        {
            name: "name1038",
            priority: 0,
            sourceIndex: 442,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"cmp","cmp":">","value":2},{"field":"east","op":"eq_var","var":"E"},{"field":"north","op":"in_set","set":[1,2,8]}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "east": rt.compute(m.E, "-", 1) });
            },
        },
        {
            name: "name01038",
            priority: 0,
            sourceIndex: 443,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":2}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "east": 1 });
            },
        },
        {
            name: "name1039",
            priority: 0,
            sourceIndex: 444,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":1},{"field":"north","op":"neq_const","value":1}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The woods are too dense to penetrate.");
            },
        },
        {
            name: "name1041",
            priority: 0,
            sourceIndex: 445,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":1},{"field":"north","op":"eq_const","value":1}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "name": "bus_stop" });
            },
        },
        {
            name: "name1043",
            priority: 0,
            sourceIndex: 446,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":1}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "name": "bus_stop" });
            },
        },
        {
            name: "name1044",
            priority: 0,
            sourceIndex: 447,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"neq_const","value":1}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "You are unable to penetrate into the woods.");
            },
        },
        {
            name: "name1045",
            priority: 0,
            sourceIndex: 448,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"north","op":"eq_const","value":1}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The forest can not be penetrated.");
            },
        },
        {
            name: "name1046",
            priority: 0,
            sourceIndex: 449,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"north","op":"eq_const","value":8}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "Penetration into the forest is impossible");
            },
        },
        {
            name: "name1047",
            priority: 0,
            sourceIndex: 450,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"in_set","set":[3,4,5,6,7]},{"field":"north","op":"eq_const","value":2}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The wall prevents passage to the north.");
            },
        },
        {
            name: "name1049",
            priority: 0,
            sourceIndex: 451,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"in_set","set":[3,4,5,6,7]},{"field":"north","op":"eq_const","value":8}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The wall is in the way.");
            },
        },
        {
            name: "name1051",
            priority: 1,
            sourceIndex: 452,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"in_set","set":[3,4,5,6,7]},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You're on the north border of a wall, on the outside.");
            },
        },
        {
            name: "name1053",
            priority: 1,
            sourceIndex: 453,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"in_set","set":[3,4,5,6,7]},{"field":"north","op":"eq_const","value":2}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "To the north is the wall that surrounds CHEZ MOOSE.");
            rt.write("\n", "To the south is a road.");
            },
        },
        {
            name: "name1055",
            priority: 1,
            sourceIndex: 454,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"north","op":"in_set","set":[3,4,5,6,7]},{"field":"east","op":"eq_const","value":2}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "To the west is a thick forest, and to the east is a wall.");
            },
        },
        {
            name: "name1056",
            priority: 1,
            sourceIndex: 455,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"in_set","set":[3,4,5,6,7]}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "To the east is a dark forest, and to the west is a high wall.");
            },
        },
        {
            name: "name1060",
            priority: 0,
            sourceIndex: 456,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":2},{"field":"north","op":"in_set","set":[3,4,5,6,7]}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "Ahh, there is the big wall in the way.");
            },
        },
        {
            name: "name1061",
            priority: 0,
            sourceIndex: 457,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"in_set","set":[3,4,5,6,7]}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The wall is in the way.");
            },
        },
        {
            name: "name1074",
            priority: 1,
            sourceIndex: 458,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"north","op":"eq_const","value":1}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are on the road, to the south is a forest.");
            },
        },
        {
            name: "name1075",
            priority: 1,
            sourceIndex: 459,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":1},{"field":"north","op":"cmp","cmp":">","value":1}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in a forest.");
            },
        },
        {
            name: "name1098",
            priority: 1,
            sourceIndex: 460,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":2}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "To the north is a gate in a wall.");
            rt.write("\n", "Further north a huge mansion looms.");
            rt.write("\n", " ");
            rt.write("\n", "Lights from inside illuminate the surrounding estate.");
            rt.write("\n", "The gate is inoperable, and you won't be able to open it.");
            },
        },
        {
            name: "name1114",
            priority: 1,
            sourceIndex: 461,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":2},{"field":"north","op":"eq_const","value":2}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is the sw corner of the wall.");
            },
        },
        {
            name: "name1115",
            priority: 1,
            sourceIndex: 462,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":2}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is the se corner of the wall.  You can go n, s, e or w.");
            },
        },
        {
            name: "name1116",
            priority: 1,
            sourceIndex: 463,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is the ne corner of the wall.");
            },
        },
        {
            name: "name1117",
            priority: 1,
            sourceIndex: 464,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":2},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is the nw corner of the wall.");
            },
        },
        {
            name: "name1140",
            priority: 0,
            sourceIndex: 465,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"in_set","set":[2,3,4,6,7,8]},{"field":"north","op":"cmp","cmp":"<","value":8},{"field":"north","op":"eq_var","var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "north": rt.compute(1, "+", m.N), "general": null });
            },
        },
        {
            name: "name1141",
            priority: 0,
            sourceIndex: 466,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"bind_set","set":[2,3,6,7],"var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "north": rt.compute(1, "+", m.N), "general": null });
            },
        },
        {
            name: "name1142",
            priority: 0,
            sourceIndex: 467,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"in_set","set":[2,3,4,6,7,8]},{"field":"north","op":"cmp","cmp":">","value":2},{"field":"north","op":"eq_var","var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "north": rt.compute(m.N, "-", 1), "general": null });
            },
        },
        {
            name: "name1143",
            priority: 0,
            sourceIndex: 468,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"bind_set","set":[3,4,7,8],"var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "north": rt.compute(m.N, "-", 1), "general": null });
            },
        },
        {
            name: "name1150",
            priority: 0,
            sourceIndex: 469,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"north","op":"in_set","set":[2,3,4,6,7,8]},{"field":"east","op":"cmp","cmp":"<","value":8},{"field":"east","op":"eq_var","var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "east": rt.compute(1, "+", m.N), "general": null });
            },
        },
        {
            name: "name1151",
            priority: 0,
            sourceIndex: 470,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"north","op":"eq_const","value":5},{"field":"east","op":"bind_set","set":[2,3,6,7],"var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "east": rt.compute(1, "+", m.N), "general": null });
            },
        },
        {
            name: "name1152",
            priority: 0,
            sourceIndex: 471,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"north","op":"in_set","set":[2,3,4,6,7,8]},{"field":"east","op":"cmp","cmp":">","value":2},{"field":"east","op":"eq_var","var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "east": rt.compute(m.N, "-", 1), "general": null });
            },
        },
        {
            name: "name1153",
            priority: 0,
            sourceIndex: 472,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"north","op":"eq_const","value":5},{"field":"east","op":"bind_set","set":[3,4,7,8],"var":"N"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "east": rt.compute(m.N, "-", 1), "general": null });
            },
        },
        {
            name: "name1048",
            priority: 0,
            sourceIndex: 473,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"north","op":"eq_const","value":2}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The wall won't let you go south.");
            },
        },
        {
            name: "name1050",
            priority: 0,
            sourceIndex: 474,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"north","op":"eq_const","value":8}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "Hey, the wall is north.");
            },
        },
        {
            name: "name1052",
            priority: 1,
            sourceIndex: 475,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You're on the inside of the north border of a wall.");
            },
        },
        {
            name: "name1054",
            priority: 1,
            sourceIndex: 476,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"north","op":"eq_const","value":2}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "A wall is to the south.");
            },
        },
        {
            name: "name1057",
            priority: 1,
            sourceIndex: 477,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "To the east is a wall.");
            },
        },
        {
            name: "name1058",
            priority: 1,
            sourceIndex: 478,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":2}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "To the west is a wall.");
            },
        },
        {
            name: "name1059",
            priority: 0,
            sourceIndex: 479,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":2}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The wall blocks your way.");
            },
        },
        {
            name: "name1062",
            priority: 0,
            sourceIndex: 480,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The wall is in the way.");
            },
        },
        {
            name: "name1063",
            priority: 1,
            sourceIndex: 481,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":4},{"field":"north","op":"eq_const","value":4}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are at the sw corner of the house.");
            },
        },
        {
            name: "name1064",
            priority: 1,
            sourceIndex: 482,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":6},{"field":"north","op":"eq_const","value":4}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are at the se corner of the house.");
            },
        },
        {
            name: "name1065",
            priority: 1,
            sourceIndex: 483,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":4},{"field":"north","op":"eq_const","value":5}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are on the west side of the house.");
            },
        },
        {
            name: "name1066",
            priority: 1,
            sourceIndex: 484,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":4},{"field":"north","op":"eq_const","value":6}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is the north-west corner of the house.");
            },
        },
        {
            name: "name1067",
            priority: 1,
            sourceIndex: 485,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":6}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is the north side of the house.");
            },
        },
        {
            name: "name1068",
            priority: 1,
            sourceIndex: 486,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":6},{"field":"north","op":"eq_const","value":6}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is the north east corner of the mansion.");
            },
        },
        {
            name: "name1069",
            priority: 1,
            sourceIndex: 487,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":6},{"field":"north","op":"eq_const","value":5}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is the east side of the house.");
            },
        },
        {
            name: "name1070",
            priority: 0,
            sourceIndex: 488,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":6},{"field":"north","op":"eq_const","value":5}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The house is in the way.");
            },
        },
        {
            name: "name1071",
            priority: 0,
            sourceIndex: 489,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":4},{"field":"north","op":"eq_const","value":5}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The house is in the way.");
            },
        },
        {
            name: "name1072",
            priority: 0,
            sourceIndex: 490,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The house is in the way.");
            },
        },
        {
            name: "name1073",
            priority: 0,
            sourceIndex: 491,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":6}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The house is in the way.");
            },
        },
        {
            name: "name1076",
            priority: 0,
            sourceIndex: 492,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":3},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1077",
            priority: 0,
            sourceIndex: 493,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":4},{"field":"north","op":"eq_const","value":3},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1078",
            priority: 0,
            sourceIndex: 494,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":6},{"field":"north","op":"eq_const","value":3},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1079",
            priority: 0,
            sourceIndex: 495,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":3},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1080",
            priority: 0,
            sourceIndex: 496,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":4},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1081",
            priority: 0,
            sourceIndex: 497,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":7},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1082",
            priority: 0,
            sourceIndex: 498,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":6},{"field":"north","op":"eq_const","value":7},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1083",
            priority: 0,
            sourceIndex: 499,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":7},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1084",
            priority: 0,
            sourceIndex: 500,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":4},{"field":"north","op":"eq_const","value":7},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1085",
            priority: 0,
            sourceIndex: 501,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":6},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1086",
            priority: 1,
            sourceIndex: 502,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":7}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This looks like an old garden, but the land is all dried and hard.");
            },
        },
        {
            name: "name1087",
            priority: 0,
            sourceIndex: 503,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathwater"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":7}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"state","op":"eq_const","value":"seed"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "state": "plant" });
            rt.write("\n", "The ground shakes...");
            rt.write("\n", "An orchid sprouts from the ground.");
            },
        },
        {
            name: "name1088",
            priority: 0,
            sourceIndex: 504,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"water"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":7}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":7},{"field":"state","op":"eq_const","value":"plant"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathwater"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":7}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The orchid shrinks and disappears underground.");
            },
        },
        {
            name: "name1089",
            priority: 0,
            sourceIndex: 505,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"water"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":7}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":7},{"field":"state","op":"eq_const","value":"seed"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Nothing happens.  That must be strange water.");
            },
        },
        {
            name: "name1090",
            priority: 0,
            sourceIndex: 506,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"seawater"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":7}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"orchid"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":7}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I think you killed what ever was planted.");
            },
        },
        {
            name: "name1091",
            priority: 0,
            sourceIndex: 507,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathwater"},{"field":"place","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"water"},{"field":"place","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.remove(m.$2);
            rt.write("\n", "The two types of water evaporate.");
            },
        },
        {
            name: "name1092",
            priority: 0,
            sourceIndex: 508,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":5},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1093",
            priority: 0,
            sourceIndex: 509,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":3},{"field":"north","op":"eq_const","value":4},{"field":"general","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "general": "lawns" });
            },
        },
        {
            name: "name1094",
            priority: 1,
            sourceIndex: 510,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"general","op":"eq_const","value":"lawns"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You're on the lawn of the mansion.");
            },
        },
        {
            name: "name1095",
            priority: 1,
            sourceIndex: 511,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":3}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You're on the front walk.");
            },
        },
        {
            name: "name1096",
            priority: 1,
            sourceIndex: 512,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":2}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You're at the front gate, which can't be opened.");
            },
        },
        {
            name: "name1097",
            priority: 0,
            sourceIndex: 513,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_var","var":"side"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":2}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"climb"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Nice try, but the upper part of the gate is electrified!");
            rt.write("\n", "I suggest you try somewhere else.");
            },
        },
        {
            name: "name1105",
            priority: 1,
            sourceIndex: 514,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are on the drive way.");
            rt.write("\n", "The drive has a gate in the wall to the east.");
            },
        },
        {
            name: "name1106",
            priority: 1,
            sourceIndex: 515,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":6}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are on a parking space.");
            },
        },
        {
            name: "name1118",
            priority: 0,
            sourceIndex: 516,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["scale","climb"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The wall is too slick to climb up.  You can't get a grip.");
            },
        },
        {
            name: "name1119",
            priority: 0,
            sourceIndex: 517,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["burrow","tunnel","dig"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The ground is too hard to dig here.");
            },
        },
        {
            name: "name1120",
            priority: 0,
            sourceIndex: 518,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"throw"},{"index":1,"op":"eq_var","var":"x"},{"index":2,"op":"eq_const","value":"at"},{"index":3,"op":"eq_const","value":"wall"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The", m.x, "bounces off the wall.");
            rt.make("input", ["drop", m.x].flat());
            },
        },
        {
            name: "name1121",
            priority: 0,
            sourceIndex: 519,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"},{"index":1,"op":"eq_const","value":"wall"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "You aren't the HULK or Dwight Stones.");
            },
        },
        {
            name: "name1122",
            priority: 0,
            sourceIndex: 520,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"},{"index":1,"op":"eq_const","value":"wall"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dwight"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "You approach the wall.  Up, up you go.");
            rt.write("\n", "SPLAT!! You hit the wall right at 8\".  That would");
            rt.write("\n", "be a new world's record.  Too bad the wall is ten feet tall.");
            },
        },
        {
            name: "name1123",
            priority: 0,
            sourceIndex: 521,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"},{"index":1,"op":"eq_const","value":"wall"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"the"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "Ha! You aren't the Hulk, you're just a little green");
            rt.write("\n", "from the bus ride.");
            },
        },
        {
            name: "name1124",
            priority: 0,
            sourceIndex: 522,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"},{"index":1,"op":"eq_const","value":"over"},{"index":2,"op":"eq_const","value":"wall"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "You watched Superman too many times!");
            },
        },
        {
            name: "name1125",
            priority: 0,
            sourceIndex: 523,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"throw"},{"index":1,"op":"eq_var","var":"y"},{"index":2,"op":"eq_const","value":"over"},{"index":3,"op":"eq_var","var":"Z"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The wall is too high for you to throw anything over it.");
            },
        },
        {
            name: "name1126",
            priority: 0,
            sourceIndex: 524,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"let"},{"index":1,"op":"eq_const","value":"me"},{"index":2,"op":"eq_const","value":"in"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "I'm afraid you aren't getting anyone's attention.");
            },
        },
        {
            name: "name1127",
            priority: 0,
            sourceIndex: 525,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"},{"index":1,"op":"eq_const","value":"gate"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The gate can't be opened by you.");
            },
        },
        {
            name: "name1128",
            priority: 0,
            sourceIndex: 526,
            conditions: [{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"notreasure","op":"eq_const","value":"t"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            },
        },
        {
            name: "name1129",
            priority: 1,
            sourceIndex: 527,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":6}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is ivy on the walls of the house.");
            },
        },
        {
            name: "name389",
            priority: 0,
            sourceIndex: 528,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"oil_status","op":"eq_const","value":"oil"},{"field":"oil_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "oil_status": "enter", "oil_time": rt.compute(m.x, "+", 10) });
            },
        },
        {
            name: "name390",
            priority: 0,
            sourceIndex: 529,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"oil_status","op":"eq_const","value":"enter"},{"field":"oil_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.make("object", { "name": "truck", "place": "lawn", "side": "in", "east": 7, "north": 5 });
            rt.modify(m.$1, { "oil_status": "walk", "oil_time": rt.compute(m.x, "+", 10) });
            },
        },
        {
            name: "name391",
            priority: 0,
            sourceIndex: 530,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"oil_status","op":"eq_const","value":"walk"},{"field":"oil_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"undug"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "oil_status": "walk", "oil_time": rt.compute(m.x, "+", 4) });
            rt.modify(m.$2, { "grave_status": "dug" });
            },
        },
        {
            name: "name392",
            priority: 0,
            sourceIndex: 531,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"oil_status","op":"eq_const","value":"walk"},{"field":"oil_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"dug"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "oil_status": "walk", "oil_time": rt.compute(m.x, "+", 4) });
            rt.modify(m.$2, { "grave_status": "deep" });
            },
        },
        {
            name: "name393",
            priority: 0,
            sourceIndex: 532,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"oil_status","op":"eq_const","value":"walk"},{"field":"oil_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"deep"},{"field":"grave_status2","op":"eq_const","value":"oil"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "grave_status2": null });
            rt.modify(m.$1, { "oil_status": "fixit", "oil_time": rt.compute(m.x, "+", 8) });
            },
        },
        {
            name: "name394",
            priority: 0,
            sourceIndex: 533,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"oil_status","op":"eq_const","value":"fixit"},{"field":"oil_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.make("fixed", [].flat());
            rt.modify(m.$1, { "oil_status": "return", "oil_time": rt.compute(m.x, "+", 10) });
            },
        },
        {
            name: "name395",
            priority: 0,
            sourceIndex: 534,
            conditions: [{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"oil_status","op":"eq_const","value":"return"},{"field":"oil_time","op":"eq_var","var":"x"},{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "oil_status": "done" });
            rt.remove(m.$2);
            },
        },
        {
            name: "name500",
            priority: 1,
            sourceIndex: 535,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"undug"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a fresh grave here.");
            },
        },
        {
            name: "name501",
            priority: 0,
            sourceIndex: 536,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"undug"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"dig"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "grave_status": "dug" });
            rt.write("\n", "Luckily, the dirt is soft.");
            },
        },
        {
            name: "name502",
            priority: 1,
            sourceIndex: 537,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"dug"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a open grave.");
            },
        },
        {
            name: "name503",
            priority: 0,
            sourceIndex: 538,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"dug"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"dig"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "grave_status": "deep" });
            },
        },
        {
            name: "name504",
            priority: 1,
            sourceIndex: 539,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"deep"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a large pipe that goes through the grave.");
            rt.write("\n", "There is a lever on the pipe labelled 'Emergency Release.'");
            },
        },
        {
            name: "name505",
            priority: 0,
            sourceIndex: 540,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"dirt"},{"index":2,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Hmmm..  I didn't understand that.  I can only dig holes and fill in holes.");
            },
        },
        {
            name: "name506",
            priority: 0,
            sourceIndex: 541,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"dirt"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Sorry, that won't wash.  I can only dig holes and fill in holes.");
            rt.write("\n", "You can't get the dirt.");
            },
        },
        {
            name: "name507",
            priority: 0,
            sourceIndex: 542,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pull"},{"index":1,"op":"eq_const","value":"lever"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"deep"},{"field":"grave_status2","op":"neq_const","value":"oil"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"fixed","isPositional":true,"prefixLength":0,"negated":true,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Ummph!");
            rt.modify(m.$3, { "grave_status2": "oil" });
            rt.modify(m.$4, { "oil_time": rt.compute(m.x, "+", 30) });
            },
        },
        {
            name: "name508",
            priority: 1,
            sourceIndex: 543,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status2","op":"eq_const","value":"oil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is oil seeping out of the pipe.");
            },
        },
        {
            name: "name509",
            priority: 0,
            sourceIndex: 544,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["throw","get","push","turn","close"]},{"index":1,"op":"eq_const","value":"lever"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["pull", "lever"].flat());
            },
        },
        {
            name: "name510",
            priority: 0,
            sourceIndex: 545,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"lever"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "I don't understand the word", m.x, "as a verb for lever.");
            },
        },
        {
            name: "name511",
            priority: 0,
            sourceIndex: 546,
            conditions: [{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status2","op":"eq_const","value":"oil"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pull"},{"index":1,"op":"eq_const","value":"lever"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The lever won't close, a special tool is needed!");
            rt.write("\n", "The oil continues to seep out.");
            },
        },
        {
            name: "name512",
            priority: 0,
            sourceIndex: 547,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"oil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The oil is too slippery to do anything with it.");
            },
        },
        {
            name: "name513",
            priority: 0,
            sourceIndex: 548,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"refill"}]},{"cls":"walk","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You are unable to affect the driver's digging.");
            },
        },
        {
            name: "name514",
            priority: 0,
            sourceIndex: 549,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"refill"}]},{"cls":"fixit","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You are unable to affect the driver's work.");
            },
        },
        {
            name: "name515",
            priority: 0,
            sourceIndex: 550,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"refill"}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status2","op":"eq_const","value":"oil"},{"field":"grave_status","op":"eq_const","value":"deep"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "grave_status": "dug" });
            rt.write("\n", "The oil still seeps out.");
            },
        },
        {
            name: "name516",
            priority: 0,
            sourceIndex: 551,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"deep"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"refill"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "grave_status": "dug" });
            },
        },
        {
            name: "name517",
            priority: 0,
            sourceIndex: 552,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"dug"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"refill"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "grave_status": "undug" });
            },
        },
        {
            name: "name518",
            priority: 0,
            sourceIndex: 553,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"oil"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The oil is too slippery to use.");
            },
        },
        {
            name: "name519",
            priority: 0,
            sourceIndex: 554,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fill"},{"index":1,"op":"eq_const","value":"in"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["refill"].flat());
            },
        },
        {
            name: "name520",
            priority: 0,
            sourceIndex: 555,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"fillin"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["refill"].flat());
            },
        },
        {
            name: "name521",
            priority: 0,
            sourceIndex: 556,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"cover"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["refill"].flat());
            },
        },
        {
            name: "name522",
            priority: 0,
            sourceIndex: 557,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["scoop","shovel"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["dig"].flat());
            },
        },
        {
            name: "name523",
            priority: 0,
            sourceIndex: 558,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"dig"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The ground is too hard to dig anymore.");
            },
        },
        {
            name: "name524",
            priority: 0,
            sourceIndex: 559,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"refill"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The grave is filled.");
            },
        },
        {
            name: "name525",
            priority: 0,
            sourceIndex: 560,
            conditions: [{"cls":"history","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"grave_status","op":"eq_const","value":"dug"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"bone"}]}],
            action: async (m, wm, term) => {
                rt.make("object", { "name": "bone", "place": "lawn", "side": "in", "east": 8, "north": 8, "treasure": "t" });
            },
        },
        {
            name: "name526",
            priority: 0,
            sourceIndex: 561,
            conditions: [{"cls":"fixed","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The oil is not seeping out, the lever has been fixed but can not be pulled.");
            },
        },
        {
            name: "name527",
            priority: 0,
            sourceIndex: 562,
            conditions: [{"cls":"fixed","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pull"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The lever won't budge.");
            },
        },
        {
            name: "name530",
            priority: 1,
            sourceIndex: 563,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":5}]},{"cls":"enter","isPositional":true,"prefixLength":0,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You see a truck outside at the gate.");
            },
        },
        {
            name: "name531",
            priority: 0,
            sourceIndex: 564,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"cmp","cmp":">","value":6},{"field":"north","op":"eq_const","value":5}]},{"cls":"enter","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"z"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The gates open and the truck enters.  The gate closes before you can escape.");
            rt.write("\n", "The truck says 'Oil line fixit' on the side.");
            rt.write("\n", "The truck pulls in and parks on the drive.");
            rt.write("\n", "The driver gets out and heads north east.");
            },
        },
        {
            name: "name532",
            priority: 0,
            sourceIndex: 565,
            conditions: [{"cls":"enter","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"cmp","cmp":">","value":6},{"field":"north","op":"eq_const","value":5}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"z"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You hear a truck pull into the driveway and stop.");
            },
        },
        {
            name: "name533",
            priority: 0,
            sourceIndex: 566,
            conditions: [{"cls":"walk","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The driver is digging to get a better angle on the pipe.");
            },
        },
        {
            name: "name534",
            priority: 0,
            sourceIndex: 567,
            conditions: [{"cls":"fixit","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The driver is fixing the pipe.");
            },
        },
        {
            name: "name535",
            priority: 0,
            sourceIndex: 568,
            conditions: [{"cls":"fixit","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":8}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"z"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The driver is finished with the work, and heads back to the truck.");
            },
        },
        {
            name: "name536",
            priority: 0,
            sourceIndex: 569,
            conditions: [{"cls":"return","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"x"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"z"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"cmp","cmp":">","value":6},{"field":"north","op":"eq_const","value":5}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The man gets in the truck and backs out as the gate opens.");
            rt.write("\n", "You are unable to escape as it leaves.");
            },
        },
        {
            name: "name537",
            priority: 0,
            sourceIndex: 570,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"driver"},{"index":2,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "You are unable to contact or make contact with the driver.");
            rt.write("\n", "It is as if he doesn't know you are there.");
            },
        },
        {
            name: "name538",
            priority: 0,
            sourceIndex: 571,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"truck"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The truck is a little heavy to get.");
            },
        },
        {
            name: "name539",
            priority: 0,
            sourceIndex: 572,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a panel truck here.");
            },
        },
        {
            name: "name540",
            priority: 0,
            sourceIndex: 573,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"mount"},{"index":1,"op":"eq_const","value":"truck"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The truck is too tall to climb up on.");
            },
        },
        {
            name: "name541",
            priority: 0,
            sourceIndex: 574,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"},{"index":1,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The front doors are locked, but you were able to open the back.");
            rt.modify(m.$2, { "door": "open" });
            },
        },
        {
            name: "name542",
            priority: 0,
            sourceIndex: 575,
            conditions: [{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"door","op":"eq_const","value":"closed"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"},{"index":1,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The back doors are now open.");
            rt.modify(m.$1, { "door": "open" });
            rt.remove(m.$4);
            },
        },
        {
            name: "name543",
            priority: 0,
            sourceIndex: 576,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["mount","enter"]},{"index":1,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "None of the doors are open.");
            },
        },
        {
            name: "name544",
            priority: 0,
            sourceIndex: 577,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"close"},{"index":1,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "door": "close" });
            rt.remove(m.$4);
            rt.write("\n", "Ok.");
            },
        },
        {
            name: "name545",
            priority: 0,
            sourceIndex: 578,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["mount","enter"]},{"index":1,"op":"eq_var","var":"h"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.modify(m.$1, { "place": "intruck" });
            rt.write("\n", "You are in the back of the truck.");
            },
        },
        {
            name: "name546",
            priority: 0,
            sourceIndex: 579,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"intruck"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"look"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You are inside the panel truck.  It is empty.");
            },
        },
        {
            name: "name547",
            priority: 0,
            sourceIndex: 580,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"intruck"}]},{"cls":"return","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"y"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"y"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"z"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "As the truck starts up, it accelerates so fast that you fall out the back.");
            rt.remove(m.$6);
            rt.modify(m.$3, { "place": "lawn", "side": "in", "east": 7, "north": 5 });
            },
        },
        {
            name: "name548",
            priority: 0,
            sourceIndex: 581,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"door","op":"eq_const","value":"closed"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"intruck"}]},{"cls":"return","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"y"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"y"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"z"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$6);
            rt.write("\n", "VaVoom! The truck has started up.");
            rt.write("\n", "Bump bump! You feel yourself being driven out of the yard.");
            rt.modify(m.$7, { "going": "out" });
            },
        },
        {
            name: "name549",
            priority: 0,
            sourceIndex: 582,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":7},{"field":"north","op":"eq_const","value":5}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["mount","enter"]},{"index":1,"op":"eq_var","var":"R"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"y"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "The", m.y, "won't fit through the door!");
            },
        },
        {
            name: "name550",
            priority: 0,
            sourceIndex: 583,
            conditions: [{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"out"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "going": null });
            rt.write("\n", "As you drive by the gate you hear from the speaker:");
            rt.write("\n", "'Good job son!'");
            rt.write("\n", "");
            rt.write("\n", "The truck drives on for a while then stops.");
            rt.write("\n", "Your open the truck door and find that you are outside the walls.");
            rt.write("\n", "You've escaped!");
            rt.write("\n", "");
            rt.write("\n", "In the distance you here the trumpeting of a bull moose.");
            rt.write("\n", "");
            rt.write("\n", "James Watt is here with a check for $10,000,000 to buy the land");
            rt.write("\n", "for the Department of the Interior.");
            rt.write("\n", "He assures you that the government will not sell the land, but admits");
            rt.write("\n", "that he may allow some leasing of mineral rights.  You have the option");
            rt.write("\n", "of selling it and making big bucks, or you can donate, with the");
            rt.write("\n", "restriction that it be perserved in its current state.");
            rt.write("\n", "What is your choice? Sell, or donate?");
            rt.make("selldonate", [(await rt.term.readToken()).toLowerCase()].flat());
            },
        },
        {
            name: "name551",
            priority: 0,
            sourceIndex: 584,
            conditions: [{"cls":"selldonate","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sell"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "Hmm.  I don't think your father would have approved.");
            rt.write("\n", "Oh my god! Out of the forest a moose comes charging at you.");
            rt.write("\n", "He is coming right at you.  You can't escape.  ");
            rt.write("\n", "ARGHH! He gored you, but missed James Watt.");
            rt.write("\n", "You're dead, what a bummer after what you have been through.");
            rt.make("input", ["stop"].flat());
            rt.modify(m.$2, { "score": rt.compute(m.x, "-", 20) });
            },
        },
        {
            name: "name552",
            priority: 0,
            sourceIndex: 585,
            conditions: [{"cls":"selldonate","isPositional":true,"prefixLength":0,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "Make up your mind, Sell or donate.");
            rt.make("selldonate", [(await rt.term.readToken()).toLowerCase()].flat());
            },
        },
        {
            name: "name553",
            priority: 0,
            sourceIndex: 586,
            conditions: [{"cls":"selldonate","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"donate"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "James Watt accuses you of being a reactionary idiot.");
            rt.write("\n", "He stomps off, mumbling, 'Those strip miners are going");
            rt.write("\n", "to be real disappointed', and walks right through a pile of moose turds.");
            rt.write("\n", "I think you made the right decision.");
            rt.make("gone", [].flat());
            rt.modify(m.$2, { "score": rt.compute(m.x, "+", 20) });
            },
        },
        {
            name: "name554",
            priority: 0,
            sourceIndex: 587,
            conditions: [{"cls":"gone","isPositional":true,"prefixLength":0,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.make("input", ["stop"].flat());
            },
        },
        {
            name: "name555",
            priority: 0,
            sourceIndex: 588,
            conditions: [{"cls":"gone","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"lawn"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "score": rt.compute(m.x, "-", 50) });
            rt.make("input", ["stop"].flat());
            rt.write("\n", "The police bust into the yard of the house to collect");
            rt.write("\n", "your treasure for you.");
            rt.write("\n", "Unfortunately they find the sugar cube with the LSd in it.");
            rt.write("\n", "You are arrested and thrown in jail for 50 years!!!");
            rt.write("\n", "What a loser!");
            },
        },
        {
            name: "name556",
            priority: 0,
            sourceIndex: 589,
            conditions: [{"cls":"gone","isPositional":true,"prefixLength":0,"negated":false,"tests":[]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"score","op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"marijuana"},{"field":"place","op":"eq_const","value":"lawn"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "score": rt.compute(m.x, "-", 20) });
            rt.make("input", ["stop"].flat());
            rt.write("\n", "The police bust into the yard of the house to collect your treasure for you.");
            rt.write("\n", "They find the marijuana! Luckily you are in the state of confusion");
            rt.write("\n", "and you get a $5 fine, but lose the $300 worth of pot.");
            rt.write("\n", "Oh well, maybe next time you'll enjoy it first.");
            },
        },
        {
            name: "name557",
            priority: 0,
            sourceIndex: 590,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"intruck"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"out"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"truck"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$1, { "name": "lawn", "side": "in", "east": 7, "north": 5 });
            },
        },
        {
            name: "name1130",
            priority: 0,
            sourceIndex: 591,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":6}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"ivy"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The ivy is stuck to the wall.");
            },
        },
        {
            name: "name1131",
            priority: 0,
            sourceIndex: 592,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"hi"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":5}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The gate opens.  You rush in and then it closes behind you.");
            rt.write("\n", "Out of the speaker you hear, 'Now you are in, but will you ever get out?'");
            rt.modify(m.$2, { "side": "in" });
            },
        },
        {
            name: "name1132",
            priority: 1,
            sourceIndex: 593,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":5}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are on the driveway.  The gate to the outside");
            rt.write("\n", "is to the east, but is locked electronically.");
            },
        },
        {
            name: "name1133",
            priority: 0,
            sourceIndex: 594,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":5}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The gate is locked, and you can't open it.");
            },
        },
        {
            name: "name1134",
            priority: 1,
            sourceIndex: 595,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"out"},{"field":"east","op":"eq_const","value":8},{"field":"north","op":"eq_const","value":5}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a gate in the wall that spans the");
            rt.write("\n", "driveway that leads into the inner grounds of the mansion.");
            rt.write("\n", "By the left hand side of the gate is a 'Jack-in-the-box'");
            rt.write("\n", " speaker with a button.");
            },
        },
        {
            name: "name1200",
            priority: 0,
            sourceIndex: 596,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["climb","scale"]}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":6}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "name": "balcony", "side": null, "east": null, "north": null });
            rt.write("\n", "The ivy allows you to get a grip.  You climb up the wall.");
            rt.write("\n", "The ivy starts to thin out and you haven't found anywhere to stop.");
            rt.write("\n", "To the right you spy a balcony.  Using your great skill as a");
            rt.write("\n", "world class haunted house climber, you JRST over to the balcony.");
            },
        },
        {
            name: "name01200",
            priority: 0,
            sourceIndex: 597,
            conditions: [{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"u"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":6}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "going": null });
            rt.modify(m.$2, { "name": "balcony", "side": null, "east": null, "north": null });
            rt.write("\n", "The ivy allows you to get a grip.  You climb up the wall.");
            rt.write("\n", "The ivy starts to thin out and you haven't found anywhere to stop.");
            rt.write("\n", "To the right you spy a balcony.  Using your great skill as a");
            rt.write("\n", "world class haunted house climber, you JRST over to the balcony.");
            },
        },
        {
            name: "name1201",
            priority: 1,
            sourceIndex: 598,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are on the balcony.  The doors to the inside");
            rt.write("\n", "are missing leaving a large doorway to the inside.");
            },
        },
        {
            name: "name1202",
            priority: 0,
            sourceIndex: 599,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"u"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "You can't climb any higher.");
            },
        },
        {
            name: "name1203",
            priority: 0,
            sourceIndex: 600,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"climb"},{"index":1,"op":"eq_const","value":"up"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "u", "went": "u" });
            },
        },
        {
            name: "name1204",
            priority: 0,
            sourceIndex: 601,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"climb"},{"index":1,"op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Climb up or climb down?");
            },
        },
        {
            name: "name1205",
            priority: 0,
            sourceIndex: 602,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"climb"},{"index":1,"op":"eq_const","value":"down"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "I warned you that the ivy gave out up here!");
            rt.write("\n", "When you tried to leap over to get a grip, you missed!!");
            rt.write("\n", "Down you go");
            rt.write("\n", "           o");
            rt.write("\n", "            o");
            rt.write("\n", "             o");
            rt.write("\n", "              o.");
            rt.write("\n", "Your foot gets caught in some ivy near the bottom and you land");
            rt.write("\n", "on your head.  ");
            rt.modify(m.$3, { "die": "t" });
            },
        },
        {
            name: "name1206",
            priority: 0,
            sourceIndex: 603,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"d"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "Is that climb down or jump?");
            },
        },
        {
            name: "name1207",
            priority: 0,
            sourceIndex: 604,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Paratrooper training comes in helpful sometimes.");
            rt.write("\n", "Unfortunately you never had it.  You break your neck when you hit.");
            rt.remove(m.$2);
            rt.modify(m.$3, { "die": "t" });
            },
        },
        {
            name: "name1208",
            priority: 0,
            sourceIndex: 605,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.modify(m.$4, { "die": "t" });
            rt.write("\n", "You flip over in mid-air and land on your back! 'CRUNCH'");
            rt.remove(m.$2);
            },
        },
        {
            name: "name1209",
            priority: 0,
            sourceIndex: 606,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":6}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$1, { "name": "lawn", "side": "in", "east": 5, "north": 6 });
            rt.write("\n", "Luckily you land on the mattress.");
            },
        },
        {
            name: "name1210",
            priority: 0,
            sourceIndex: 607,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_const","value":"mattress"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$3, { "place": "lawn", "side": "in", "east": 5, "north": 6 });
            rt.write("\n", "The mattress floats to the ground.");
            },
        },
        {
            name: "name1211",
            priority: 0,
            sourceIndex: 608,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"throw"},{"index":1,"op":"eq_const","value":"mattress"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["drop", "mattress"].flat());
            },
        },
        {
            name: "name1212",
            priority: 0,
            sourceIndex: 609,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "going": "s", "went": "s" });
            rt.remove(m.$1);
            },
        },
        {
            name: "name1213",
            priority: 0,
            sourceIndex: 610,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"balcony"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "bedroom" });
            rt.modify(m.$2, { "name": "balcony", "visited": "t" });
            rt.modify(m.$3, { "going": null });
            },
        },
        {
            name: "name1214",
            priority: 1,
            sourceIndex: 611,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in what looks like the master bedroom of the mansion.");
            rt.write("\n", "A large doorway opens to the balcony to the north.");
            rt.write("\n", "To the east is a opening to the bathroom.");
            rt.write("\n", "The main doorway to the rest of the house is boarded up and impassable.");
            },
        },
        {
            name: "name1215",
            priority: 0,
            sourceIndex: 612,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["e"].flat());
            },
        },
        {
            name: "name1216",
            priority: 0,
            sourceIndex: 613,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"make","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"input"},{"index":1,"op":"eq_const","value":"exit"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["n"].flat());
            },
        },
        {
            name: "name1217",
            priority: 0,
            sourceIndex: 614,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "going": null });
            rt.write("\n", "The mattress won't fit through the door.");
            },
        },
        {
            name: "name1218",
            priority: 0,
            sourceIndex: 615,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The mattress just clears the door.");
            },
        },
        {
            name: "name1219",
            priority: 0,
            sourceIndex: 616,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "going": null });
            rt.modify(m.$2, { "name": "bedroom", "visited": "t" });
            rt.modify(m.$1, { "name": "balcony" });
            },
        },
        {
            name: "name1220",
            priority: 0,
            sourceIndex: 617,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "name": "bedroom", "visited": "t" });
            rt.modify(m.$1, { "name": "bathroom" });
            },
        },
        {
            name: "name1221",
            priority: 1,
            sourceIndex: 618,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"sound","op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Some noise can be heard through the boarded up door.");
            },
        },
        {
            name: "name1222",
            priority: 0,
            sourceIndex: 619,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"bedroom"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a king-size bed in the middle of the room.");
            },
        },
        {
            name: "name1223",
            priority: 1,
            sourceIndex: 620,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"bedroom"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is the frame and springs of a king-size bed in the room.");
            },
        },
        {
            name: "name1224",
            priority: 0,
            sourceIndex: 621,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"bed"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "All you can get is the mattress, the rest is too heavy.");
            rt.make("input", ["get", "mattress"].flat());
            },
        },
        {
            name: "name1225",
            priority: 0,
            sourceIndex: 622,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"cut"},{"index":1,"op":"eq_const","value":"mattress"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.remove(m.$2);
            rt.write("\n", "The mattress is poorly made and you rip it to shreds.");
            rt.write("\n", "In fact it is in a million pieces that float away.");
            },
        },
        {
            name: "name1226",
            priority: 0,
            sourceIndex: 623,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"cut"},{"index":1,"op":"eq_const","value":"mattress"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.remove(m.$2);
            rt.write("\n", "The mattress falls to pieces in your hands and they all float away.");
            },
        },
        {
            name: "name1227",
            priority: 0,
            sourceIndex: 624,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"in_set","set":["chop","rip","tear"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["cut"].flat());
            },
        },
        {
            name: "name1228",
            priority: 0,
            sourceIndex: 625,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"look"},{"index":1,"op":"eq_const","value":"under"},{"index":2,"op":"eq_const","value":"bed"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "'Ahhh Chooo!' There is dust under the bed.");
            },
        },
        {
            name: "name1229",
            priority: 0,
            sourceIndex: 626,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"under"},{"index":2,"op":"eq_const","value":"bed"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The bed is too low to go under.");
            },
        },
        {
            name: "name1230",
            priority: 0,
            sourceIndex: 627,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"mount"},{"index":1,"op":"eq_const","value":"bed"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "ontop": "bed" });
            rt.write("\n", "You are on the bed.");
            },
        },
        {
            name: "name1231",
            priority: 0,
            sourceIndex: 628,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"},{"field":"ontop","op":"eq_const","value":"bed"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"bedroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"mirror"},{"field":"state","op":"eq_const","value":"broke"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "You bounce up and hit the mirror.  It shatters into many small pieces.");
            rt.make("object", { "name": "mirror", "state": "broke" });
            },
        },
        {
            name: "name1232",
            priority: 0,
            sourceIndex: 629,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"bounce"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["jump"].flat());
            },
        },
        {
            name: "name1233",
            priority: 0,
            sourceIndex: 630,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"},{"field":"ontop","op":"eq_const","value":"bed"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Without the mattress on you don't get any cheap thrills.");
            },
        },
        {
            name: "name1234",
            priority: 0,
            sourceIndex: 631,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"},{"field":"ontop","op":"neq_const","value":"nil"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"mirror"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The mirror is still out of reach.");
            },
        },
        {
            name: "name1235",
            priority: 0,
            sourceIndex: 632,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"mirror"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The mirror is much too high to reach.");
            },
        },
        {
            name: "name1236",
            priority: 0,
            sourceIndex: 633,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"mirror"},{"field":"state","op":"eq_const","value":"broke"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a mirror on the ceiling above the bed.");
            },
        },
        {
            name: "name1237",
            priority: 0,
            sourceIndex: 634,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mirror"},{"field":"state","op":"eq_const","value":"broke"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"mirror"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"cut","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$4, { "cut": "t" });
            rt.write("\n", "The glass is too sharp to carry, you cut yourself.  'Ouch!'");
            },
        },
        {
            name: "name1238",
            priority: 0,
            sourceIndex: 635,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"},{"field":"ontop","op":"eq_const","value":"bed"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mirror"},{"field":"state","op":"eq_const","value":"broke"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"mirror"},{"index":2,"op":"eq_var","var":"x"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$4, { "cut": "t" });
            rt.write("\n", "The glass cuts you when you try to pick it up.");
            },
        },
        {
            name: "name1239",
            priority: 0,
            sourceIndex: 636,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mirror"},{"field":"state","op":"eq_const","value":"broke"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"glass"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$4, { "cut": "t" });
            rt.write("\n", "'Ouch!' The glass cuts you, you can't carry it.");
            },
        },
        {
            name: "name1240",
            priority: 0,
            sourceIndex: 637,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mirror"},{"field":"state","op":"eq_const","value":"broke"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is glass from a broken mirror on the floor.");
            },
        },
        {
            name: "name1241",
            priority: 0,
            sourceIndex: 638,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sleep"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"},{"field":"ontop","op":"eq_const","value":"bed"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Snooze...\n\t.\n\t.\n\t.\n\t.\n\t.\n\t...  snort.  Ah that was refreshing, but useless, you're still ugly.");
            rt.remove(m.$1);
            },
        },
        {
            name: "name1242",
            priority: 0,
            sourceIndex: 639,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"in_set","set":["on","in"]},{"index":2,"op":"eq_const","value":"bed"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["mount", "bed"].flat());
            },
        },
        {
            name: "name1243",
            priority: 0,
            sourceIndex: 640,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bedroom"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sit"},{"index":1,"op":"eq_const","value":"on"},{"index":2,"op":"eq_const","value":"bed"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["mount", "bed"].flat());
            },
        },
        {
            name: "name1244",
            priority: 0,
            sourceIndex: 641,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sleep"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Let's wait until we are on a bed.");
            },
        },
        {
            name: "name1245",
            priority: 0,
            sourceIndex: 642,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"neq_const","value":"bedroom"},{"field":"name","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_var","var":"x"},{"field":"side","op":"eq_var","var":"__pos_side_x","implicit":true},{"field":"east","op":"eq_var","var":"__pos_east_x","implicit":true},{"field":"north","op":"eq_var","var":"__pos_north_x","implicit":true}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a king-size mattress here.");
            },
        },
        {
            name: "name1246",
            priority: 1,
            sourceIndex: 643,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in the master bathroom.");
            rt.write("\n", "The exciting features around are the bathtub and the toilet.");
            },
        },
        {
            name: "name1247",
            priority: 0,
            sourceIndex: 644,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "bedroom" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name1248",
            priority: 0,
            sourceIndex: 645,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"urinate"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "That was a relief!");
            },
        },
        {
            name: "name1249",
            priority: 0,
            sourceIndex: 646,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"urinate"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"likes","op":"eq_const","value":"prince"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "siton": "toilet" });
            },
        },
        {
            name: "name1250",
            priority: 0,
            sourceIndex: 647,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"urinate"},{"index":1,"op":"eq_const","value":"into"},{"index":2,"op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The adventure has frighten you so much that your");
            rt.write("\n", "urethra won't relax");
            rt.write("\n", "and you are unable to even expel a drop.");
            },
        },
        {
            name: "name1251",
            priority: 0,
            sourceIndex: 648,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"urine"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["urinate", "into", "bottle"].flat());
            },
        },
        {
            name: "name1252",
            priority: 0,
            sourceIndex: 649,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"urinate"},{"index":1,"op":"eq_const","value":"in"},{"index":2,"op":"eq_const","value":"bottle"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["urinate", "into", "bottle"].flat());
            },
        },
        {
            name: "name1253",
            priority: 0,
            sourceIndex: 650,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"shit"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "siton": "toilet" });
            rt.write("\n", "Too bad there isn't any tissue!");
            },
        },
        {
            name: "name1254",
            priority: 0,
            sourceIndex: 651,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"piss"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["urinate"].flat());
            },
        },
        {
            name: "name1255",
            priority: 0,
            sourceIndex: 652,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"take"},{"index":1,"op":"eq_const","value":"a"},{"index":2,"op":"eq_const","value":"leak"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["urinate"].flat());
            },
        },
        {
            name: "name1256",
            priority: 0,
            sourceIndex: 653,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"take"},{"index":1,"op":"eq_const","value":"a"},{"index":2,"op":"eq_const","value":"crap"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["shit"].flat());
            },
        },
        {
            name: "name1257",
            priority: 0,
            sourceIndex: 654,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"mount"},{"index":1,"op":"eq_const","value":"toilet"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "siton": "toilet" });
            rt.write("\n", "Sitting on a toilet is lots of fun!!");
            },
        },
        {
            name: "name1258",
            priority: 0,
            sourceIndex: 655,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sit"},{"index":1,"op":"eq_const","value":"on"},{"index":2,"op":"eq_const","value":"toilet"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "siton": "toilet" });
            rt.write("\n", "Duly sat.");
            },
        },
        {
            name: "name1259",
            priority: 0,
            sourceIndex: 656,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"flush"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "die": "t" });
            rt.write("\n", "When you flush the toilet it spins around, knocking you off your feet!");
            rt.write("\n", "You crack your head on the bathtub and die!!!");
            },
        },
        {
            name: "name1260",
            priority: 0,
            sourceIndex: 657,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"siton","op":"neq_const","value":"nil"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "siton": null });
            },
        },
        {
            name: "name1261",
            priority: 0,
            sourceIndex: 658,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"flush"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"siton","op":"eq_const","value":"toilet"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "name": "backroom" });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name1262",
            priority: 0,
            sourceIndex: 659,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"toilet"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Give me a break! The toilet stays here!");
            },
        },
        {
            name: "name1263",
            priority: 0,
            sourceIndex: 660,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"bathtub"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The bathtub doesn't move.");
            rt.remove(m.$2);
            },
        },
        {
            name: "name1264",
            priority: 0,
            sourceIndex: 661,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["enter","mount"]},{"index":1,"op":"eq_const","value":"bathtub"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "siton": "bathtub" });
            rt.remove(m.$2);
            rt.write("\n", "Ok.");
            },
        },
        {
            name: "name1265",
            priority: 0,
            sourceIndex: 662,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"sit"},{"index":1,"op":"eq_const","value":"in"},{"index":2,"op":"eq_const","value":"bathtub"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "siton": "bathtub" });
            rt.remove(m.$2);
            rt.write("\n", "Ok.");
            },
        },
        {
            name: "name1266",
            priority: 0,
            sourceIndex: 663,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"turn"},{"index":1,"op":"eq_const","value":"on"},{"index":2,"op":"eq_const","value":"water"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "state": "water_running" });
            },
        },
        {
            name: "name1267",
            priority: 1,
            sourceIndex: 664,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"state","op":"eq_const","value":"water_running"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The water is on in the bathtub.");
            },
        },
        {
            name: "name1268",
            priority: 0,
            sourceIndex: 665,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"state","op":"neq_const","value":"water_running"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"turn"},{"index":1,"op":"eq_const","value":"off"},{"index":2,"op":"eq_const","value":"water"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The water is already off.");
            },
        },
        {
            name: "name1269",
            priority: 0,
            sourceIndex: 666,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"state","op":"eq_const","value":"water_running"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"turn"},{"index":1,"op":"eq_const","value":"off"},{"index":2,"op":"eq_const","value":"water"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "state": null });
            rt.remove(m.$3);
            rt.write("\n", "The water is turned off.");
            rt.write("\n", "All the water drains out.");
            },
        },
        {
            name: "name1270",
            priority: 0,
            sourceIndex: 667,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"turn"},{"index":1,"op":"eq_const","value":"on"},{"index":2,"op":"eq_const","value":"shower"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "There isn't a shower head, just a bathtub.");
            },
        },
        {
            name: "name1271",
            priority: 0,
            sourceIndex: 668,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"take"},{"index":1,"op":"eq_const","value":"shower"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I thought I said there was only a bathtub!");
            },
        },
        {
            name: "name1272",
            priority: 0,
            sourceIndex: 669,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"take"},{"index":1,"op":"eq_const","value":"bath"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("command", { "string": "wash" });
            },
        },
        {
            name: "name1273",
            priority: 0,
            sourceIndex: 670,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"wash"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("command", { "string": "wash" });
            },
        },
        {
            name: "name1274",
            priority: 0,
            sourceIndex: 671,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"command","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"string","op":"eq_const","value":"wash"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"state","op":"neq_const","value":"water_running"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Well, I must turn on the water.");
            rt.modify(m.$3, { "state": "water_running" });
            },
        },
        {
            name: "name1275",
            priority: 0,
            sourceIndex: 672,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"siton","op":"neq_const","value":"bathtub"}]},{"cls":"command","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"string","op":"eq_const","value":"wash"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Let's get in the bathtub.");
            rt.modify(m.$1, { "siton": "bathtub" });
            },
        },
        {
            name: "name1276",
            priority: 0,
            sourceIndex: 673,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"command","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"string","op":"eq_const","value":"wash"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"soap"},{"field":"place","op":"eq_const","value":"bathroom"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Hmmm...  now where was that soap.");
            rt.make("input", ["get", "soap"].flat());
            },
        },
        {
            name: "name1277",
            priority: 0,
            sourceIndex: 674,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"siton","op":"eq_const","value":"bathtub"}]},{"cls":"command","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"string","op":"eq_const","value":"wash"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"soap"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"state","op":"eq_const","value":"water_running"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$3);
            rt.write("\n", "Luckily we don't worry about clothes in this adventure!");
            rt.write("\n", "The water is nice and warm.  Too bad I don't have a rubber duckie!");
            rt.write("\n", "Well let's use the soap to get clean.");
            rt.write("\n", "There is so much dirt here it takes alot of soap.");
            rt.write("\n", "As the soap wears away, we are left with a GEM!!!.");
            rt.make("object", { "name": "gem", "place": "held", "treasure": "t" });
            },
        },
        {
            name: "name1278",
            priority: 0,
            sourceIndex: 675,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":10}]},{"cls":"command","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"string","op":"eq_const","value":"wash"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "Ahh, can't wash without any soap and water.");
            },
        },
        {
            name: "name1279",
            priority: 0,
            sourceIndex: 676,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"siton","op":"eq_const","value":"bathtub"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"soap"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"state","op":"eq_const","value":"water_running"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "As long as we're here, we might as well wash.");
            rt.make("command", { "string": "wash" });
            },
        },
        {
            name: "name1280",
            priority: 0,
            sourceIndex: 677,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"soap"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_const","value":"soap"},{"index":2,"op":"eq_const","value":"in"},{"index":3,"op":"in_set","set":["bathtub","water"]}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"state","op":"eq_const","value":"water_running"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$3);
            rt.write("\n", "The soap dissolves in the water!!");
            rt.make("object", { "name": "gem", "place": "bathroom", "treasure": "t" });
            },
        },
        {
            name: "name1281",
            priority: 0,
            sourceIndex: 678,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"siton","op":"eq_const","value":"bathtub"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"wears","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "If we're getting in the bathtub I'm going to take off the", m.x, ".");
            rt.make("input", ["take", "off", m.x].flat());
            },
        },
        {
            name: "name1282",
            priority: 0,
            sourceIndex: 679,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"lather"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["wash"].flat());
            },
        },
        {
            name: "name1283",
            priority: 0,
            sourceIndex: 680,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_const","value":"soap"},{"index":2,"op":"eq_const","value":"in"},{"index":3,"op":"eq_const","value":"water"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["wash"].flat());
            },
        },
        {
            name: "name1284",
            priority: 0,
            sourceIndex: 681,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drop"},{"index":1,"op":"eq_const","value":"soap"},{"index":2,"op":"eq_const","value":"in"},{"index":3,"op":"eq_const","value":"bathtub"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["wash"].flat());
            rt.write("\n", "Let's jump in after it and take a bath.");
            },
        },
        {
            name: "name1285",
            priority: 0,
            sourceIndex: 682,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drink"},{"index":1,"op":"eq_const","value":"water"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Gross! I'm not that thirsty!");
            },
        },
        {
            name: "name1286",
            priority: 0,
            sourceIndex: 683,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"urinate"},{"index":1,"op":"eq_var","var":"x"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"wears","op":"neq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["take", "off", m.x].flat());
            rt.write("\n", "Well, I think it is best to undress a little first.");
            },
        },
        {
            name: "name1287",
            priority: 0,
            sourceIndex: 684,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"shit"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_var","var":"x"},{"field":"wears","op":"neq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("input", ["take", "off", m.x].flat());
            rt.write("\n", "I'll take off the suit first.");
            },
        },
        {
            name: "name1288",
            priority: 0,
            sourceIndex: 685,
            conditions: [{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"pee"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("input", ["urinate"].flat());
            },
        },
        {
            name: "name1289",
            priority: 0,
            sourceIndex: 686,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"drain"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The drain is open, even shoving the bed down it won't close it");
            },
        },
        {
            name: "name1290",
            priority: 0,
            sourceIndex: 687,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"plug"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "You can't plug it.");
            },
        },
        {
            name: "name1291",
            priority: 0,
            sourceIndex: 688,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"plug"},{"index":2,"op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I see no plug here.");
            },
        },
        {
            name: "name1292",
            priority: 0,
            sourceIndex: 689,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"state","op":"eq_const","value":"water_running"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"splash"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "Hey, watch it! No splashing around here.");
            },
        },
        {
            name: "name1293",
            priority: 0,
            sourceIndex: 690,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"siton","op":"eq_const","value":"bathtub"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bathroom"},{"field":"state","op":"eq_const","value":"water_running"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"drown"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "state": null });
            rt.remove(m.$3);
            rt.modify(m.$4, { "die": "t" });
            rt.write("\n", "Adventure a little to tough for you eh?");
            rt.write("\n", "Well you did look a little blue, especially after you held your head under");
            rt.write("\n", "for ten minutes!");
            },
        },
        {
            name: "name1294",
            priority: 1,
            sourceIndex: 691,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"backroom"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"backroom"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The toilet and the wall have swivled around 180 degrees.");
            rt.write("\n", "You are now in a backroom.");
            rt.write("\n", "I assume this was for when grand-dad wanted to ...  in private.");
            rt.write("\n", "There are no doors or windows.  Just the toilet.");
            },
        },
        {
            name: "name1295",
            priority: 0,
            sourceIndex: 692,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"backroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"flush"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"backroom"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "bathroom" });
            rt.remove(m.$2);
            rt.modify(m.$3, { "visited": "t" });
            rt.write("\n", "Around you go again.");
            },
        },
        {
            name: "name1296",
            priority: 0,
            sourceIndex: 693,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"backroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"urinate"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Your bladder is empty.");
            },
        },
        {
            name: "name1297",
            priority: 0,
            sourceIndex: 694,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"backroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"shit"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Plop!");
            },
        },
        {
            name: "name1298",
            priority: 0,
            sourceIndex: 695,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"backroom"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"stand"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "There isn't enough room to stand.");
            },
        },
        {
            name: "name1299",
            priority: 0,
            sourceIndex: 696,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"backroom"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"up"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I see no up here.  Ha ha, only kidding.  There isn't room to stand in here.");
            },
        },
        {
            name: "name2000",
            priority: 0,
            sourceIndex: 697,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"ouvre"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"closed"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"likes","op":"eq_var","var":"f"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "name": "large_door", "door": "open" });
            rt.write("\n", "The door creaks open.");
            rt.write("\n", "A voice from within says: 'Welcome,", m.f, "lover.'");
            },
        },
        {
            name: "name2001",
            priority: 0,
            sourceIndex: 698,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"ouvre"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The door stays open.");
            },
        },
        {
            name: "name2002",
            priority: 0,
            sourceIndex: 699,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The door is closed, you bump your nose!");
            },
        },
        {
            name: "name2003",
            priority: 0,
            sourceIndex: 700,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "foyer", "side": null, "east": null, "north": null });
            rt.modify(m.$2, { "going": null });
            },
        },
        {
            name: "name2004",
            priority: 0,
            sourceIndex: 701,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"mattress"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "The mattress won't fit throught the door.");
            },
        },
        {
            name: "name2005",
            priority: 0,
            sourceIndex: 702,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$4, { "place": "lawn", "side": "in", "east": 5, "north": 4 });
            rt.write("\n", "You stumble over the threshold and drop the cube outside.");
            },
        },
        {
            name: "name2006",
            priority: 0,
            sourceIndex: 703,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"marijuana"},{"field":"place","op":"eq_const","value":"held"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The dope slips from your hand.");
            rt.modify(m.$4, { "place": "lawn", "side": "in", "east": 5, "north": 4 });
            },
        },
        {
            name: "name2007",
            priority: 0,
            sourceIndex: 704,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "n", "went": "n" });
            },
        },
        {
            name: "name2008",
            priority: 1,
            sourceIndex: 705,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are outside a large door in the front of an old mansion.");
            },
        },
        {
            name: "name2009",
            priority: 0,
            sourceIndex: 706,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"knock"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "'Knock! Knock!'");
            rt.make("input", ["ouvre"].flat());
            },
        },
        {
            name: "name2010",
            priority: 0,
            sourceIndex: 707,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"ring"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Ding dong!");
            rt.make("input", ["ouvre"].flat());
            },
        },
        {
            name: "name2011",
            priority: 0,
            sourceIndex: 708,
            conditions: [{"cls":"x","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":30}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"ring"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I see no bell here.");
            },
        },
        {
            name: "name2012",
            priority: 0,
            sourceIndex: 709,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"closed"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "Didn't your mother teach you any manners?");
            rt.write("\n", "You shouldn't open someones door without their permission!");
            },
        },
        {
            name: "name2013",
            priority: 0,
            sourceIndex: 710,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"close"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "door": "closed" });
            rt.remove(m.$3);
            rt.write("\n", "The door closes.");
            },
        },
        {
            name: "name2014",
            priority: 1,
            sourceIndex: 711,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lawn"},{"field":"side","op":"eq_const","value":"in"},{"field":"east","op":"eq_const","value":5},{"field":"north","op":"eq_const","value":4}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"sound","op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Muffled sounds can be heard inside.");
            },
        },
        {
            name: "name2015",
            priority: 1,
            sourceIndex: 712,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are inside the house in the inner foyer.");
            rt.write("\n", "There is a walk-in closet to the west, an entrance to a hall to the north.");
            },
        },
        {
            name: "name2016",
            priority: 0,
            sourceIndex: 713,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "door": "closed" });
            rt.write("\n", "Before you can get out the large door slams shut; BOOM!");
            rt.write("\n", "Laughter can be heard in the upper floors of the house.");
            },
        },
        {
            name: "name2017",
            priority: 0,
            sourceIndex: 714,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"closed"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The large door is locked impossible to open.");
            },
        },
        {
            name: "name2018",
            priority: 0,
            sourceIndex: 715,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            rt.modify(m.$1, { "name": "main_hall" });
            },
        },
        {
            name: "name2019",
            priority: 0,
            sourceIndex: 716,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"closed"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "going": null });
            rt.write("\n", "The door is shut.");
            },
        },
        {
            name: "name2020",
            priority: 0,
            sourceIndex: 717,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"},{"index":1,"op":"eq_const","value":"closet"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "w", "went": "w" });
            },
        },
        {
            name: "name2021",
            priority: 0,
            sourceIndex: 718,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"},{"index":1,"op":"eq_const","value":"hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "going": "n", "went": "n" });
            rt.remove(m.$2);
            },
        },
        {
            name: "name2022",
            priority: 0,
            sourceIndex: 719,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "visited": "t" });
            rt.modify(m.$1, { "name": "closet" });
            rt.modify(m.$2, { "going": null });
            },
        },
        {
            name: "name2023",
            priority: 0,
            sourceIndex: 720,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"large_door"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"close"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "door": "closed" });
            rt.write("\n", "The door closes.");
            },
        },
        {
            name: "name2024",
            priority: 0,
            sourceIndex: 721,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"},{"field":"virgin","op":"eq_const","value":"t"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"y"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "virgin": null });
            rt.modify(m.$3, { "orc_status": "sweat", "orc_time": rt.compute(m.y, "+", 160) });
            rt.write("\n", "You feel a chill run down your spine, and you doubt your own sanity.");
            rt.write("\n", " ");
            rt.write("\n", "A booming voice proclaims:");
            rt.write("\n", "'YOU WON'T GET OUT BY A DOOR.'");
            rt.write("\n", "'...  at least alive!'");
            rt.write("\n", " ");
            rt.write("\n", "The house is very damp and musty.");
            },
        },
        {
            name: "name2025",
            priority: 0,
            sourceIndex: 722,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"y"},{"field":"orc_time","op":"cmp","cmp":"<","value":{"var":"y"}}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "orc_time": rt.compute(m.y, "+", 20) });
            rt.write("\n", "A booming voice proclaims:");
            rt.write("\n", "'You must be mad to return.  If you're not, you will be soon.'");
            },
        },
        {
            name: "name2026",
            priority: 0,
            sourceIndex: 723,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"realtime","op":"eq_var","var":"y"}]},{"cls":"command","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"string","op":"eq_const","value":"eat_it"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "orc_status": null });
            rt.remove(m.$3);
            },
        },
        {
            name: "name2027",
            priority: 1,
            sourceIndex: 724,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"foyer"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"sound","op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Some noise is coming from the hall.");
            },
        },
        {
            name: "name2028",
            priority: 0,
            sourceIndex: 725,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "foyer" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2029",
            priority: 1,
            sourceIndex: 726,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in the main hall.");
            rt.write("\n", "The foyer is south.");
            rt.write("\n", "The hall extends west and darkens.");
            rt.write("\n", "A large room is to the east.");
            },
        },
        {
            name: "name2030",
            priority: 0,
            sourceIndex: 727,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "dark_hall" });
            rt.modify(m.$2, { "visited": "t" });
            rt.modify(m.$3, { "going": null });
            },
        },
        {
            name: "name2031",
            priority: 0,
            sourceIndex: 728,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "library" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2032",
            priority: 0,
            sourceIndex: 729,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"in_set","set":["u","n"]}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"},{"field":"state","op":"eq_const","value":"whole"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "stairs" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$4, { "visited": "t" });
            },
        },
        {
            name: "name2033",
            priority: 0,
            sourceIndex: 730,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"},{"field":"state","op":"eq_const","value":"collapsed"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "stairs_debris" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$4, { "visited": "t" });
            },
        },
        {
            name: "name2034",
            priority: 1,
            sourceIndex: 731,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"main_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"sound","op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Weird noises are coming from above.");
            },
        },
        {
            name: "name2035",
            priority: 0,
            sourceIndex: 732,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"closet"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"closet"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "foyer" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2036",
            priority: 1,
            sourceIndex: 733,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"closet"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"closet"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in a large closet, you can see all its contents");
            rt.write("\n", " by the light from the foyer.");
            },
        },
        {
            name: "name2037",
            priority: 1,
            sourceIndex: 734,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dark_hall"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dark_hall"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in a poorly lit hall.  There is a faint scent of fresh paint.");
            },
        },
        {
            name: "name2038",
            priority: 0,
            sourceIndex: 735,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dark_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dark_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "smelly_room" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2039",
            priority: 0,
            sourceIndex: 736,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dark_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dark_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "main_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2040",
            priority: 1,
            sourceIndex: 737,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are on the landing of the stair case.");
            rt.write("\n", "stairs go up and down.");
            rt.write("\n", " ");
            rt.write("\n", "The stairs are squeeky! They seem about to collapse.");
            },
        },
        {
            name: "name2041",
            priority: 1,
            sourceIndex: 738,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"sound","op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The sound is coming from above you.");
            },
        },
        {
            name: "name2042",
            priority: 0,
            sourceIndex: 739,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"u"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "upper_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2043",
            priority: 0,
            sourceIndex: 740,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"d"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "main_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2045",
            priority: 1,
            sourceIndex: 741,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"},{"field":"visited","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "SQUEEK! These stairs are delicate!");
            },
        },
        {
            name: "name2046",
            priority: 0,
            sourceIndex: 742,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"},{"field":"state","op":"eq_const","value":"whole"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"jump"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "CRASH! You've collapsed the stairs.");
            rt.modify(m.$1, { "name": "stairs_debris" });
            rt.modify(m.$2, { "state": "collapsed" });
            rt.remove(m.$3);
            },
        },
        {
            name: "name2047",
            priority: 1,
            sourceIndex: 743,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"smelly_room"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"smelly_room"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in a room that smells of paint.");
            rt.write("\n", "There are no windows or door except the one you came through.");
            rt.write("\n", "The walls are wood panel.");
            },
        },
        {
            name: "name2048",
            priority: 0,
            sourceIndex: 744,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"smelly_room"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"smelly_room"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "dark_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2049",
            priority: 1,
            sourceIndex: 745,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in the library.  All the walls are lined with books.");
            rt.write("\n", "There is a bust of Homer within reach.");
            },
        },
        {
            name: "name2050",
            priority: 0,
            sourceIndex: 746,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "main_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2051",
            priority: 0,
            sourceIndex: 747,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"bust"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.write("\n", "The bust is too heavy to carry.");
            },
        },
        {
            name: "name2052",
            priority: 0,
            sourceIndex: 748,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"turn"},{"index":1,"op":"eq_const","value":"bust"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"closed"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "door": "open" });
            },
        },
        {
            name: "name2053",
            priority: 0,
            sourceIndex: 749,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"enter"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$4, { "going": "e", "went": "e" });
            },
        },
        {
            name: "name2054",
            priority: 0,
            sourceIndex: 750,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wetsuit"},{"field":"wears","op":"eq_const","value":"t"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$4, { "going": null });
            rt.write("\n", "You can't fit into the opening.");
            },
        },
        {
            name: "name2055",
            priority: 0,
            sourceIndex: 751,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wetsuit"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$4, { "going": null });
            rt.write("\n", "Something you're carrying is to big to fit through the door.");
            },
        },
        {
            name: "name2056",
            priority: 0,
            sourceIndex: 752,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "secret_stairs" });
            rt.modify(m.$3, { "going": null });
            rt.modify(m.$4, { "visited": "t" });
            },
        },
        {
            name: "name2057",
            priority: 0,
            sourceIndex: 753,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"turn"},{"index":1,"op":"eq_const","value":"bust"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "door": "closed" });
            rt.write("\n", "The shelves close.");
            },
        },
        {
            name: "name2058",
            priority: 0,
            sourceIndex: 754,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The east wall of books is open!");
            },
        },
        {
            name: "name2059",
            priority: 0,
            sourceIndex: 755,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"bust"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "I'll bust you if you don't watch it.");
            },
        },
        {
            name: "name2060",
            priority: 0,
            sourceIndex: 756,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"rub"},{"index":1,"op":"eq_const","value":"bust"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "That isn't very rewarding, nothing happens.");
            },
        },
        {
            name: "name2061",
            priority: 0,
            sourceIndex: 757,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kiss"},{"index":1,"op":"eq_const","value":"bust"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "That might turn on a frog, but homer is unmoved.");
            },
        },
        {
            name: "name2062",
            priority: 0,
            sourceIndex: 758,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"book","op":"eq_const","value":"nil"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"book"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "book": "t" });
            rt.remove(m.$2);
            rt.write("\n", "You get a book but discover it has only virtual pages.");
            rt.write("\n", "The book disappears.");
            },
        },
        {
            name: "name2063",
            priority: 0,
            sourceIndex: 759,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"book","op":"eq_const","value":"t"},{"field":"book2","op":"eq_const","value":"nil"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"book"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The title of the book is 'Vampires I have known'");
            rt.modify(m.$1, { "book2": "t" });
            rt.remove(m.$2);
            rt.make("object", { "name": "book", "place": "held" });
            },
        },
        {
            name: "name2064",
            priority: 0,
            sourceIndex: 760,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"book","op":"eq_const","value":"t"},{"field":"book2","op":"eq_const","value":"t"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"book"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "All the rest of the books are fake.");
            rt.write("\n", "They seem to be wood.");
            },
        },
        {
            name: "name2065",
            priority: 1,
            sourceIndex: 761,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"secret_stairs"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"secret_stairs"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in the head of a secret staircase.");
            rt.write("\n", "The stairs go down.  A pole in the room goes through a hole in the ceiling.");
            },
        },
        {
            name: "name2066",
            priority: 0,
            sourceIndex: 762,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"secret_stairs"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"secret_stairs"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "library" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$4, { "visited": "t" });
            },
        },
        {
            name: "name2067",
            priority: 0,
            sourceIndex: 763,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"secret_stairs"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"d"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"secret_stairs"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "wine_cellar" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2068",
            priority: 0,
            sourceIndex: 764,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"secret_stairs"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"closed"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The stacks can't be opened from here.");
            },
        },
        {
            name: "name2069",
            priority: 0,
            sourceIndex: 765,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"secret_stairs"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"library"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The west wall is open.");
            },
        },
        {
            name: "name2070",
            priority: 0,
            sourceIndex: 766,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"secret_stairs"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"u"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.write("\n", "That isn't a bat pole, ROBIN.  You can only come down.");
            },
        },
        {
            name: "name2071",
            priority: 1,
            sourceIndex: 767,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs_debris"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs_debris"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are on wreckage of the stairs.");
            rt.write("\n", "To the south is the main hall, north is a small opening.");
            },
        },
        {
            name: "name2072",
            priority: 0,
            sourceIndex: 768,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs_debris"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs_debris"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "main_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2073",
            priority: 0,
            sourceIndex: 769,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs_debris"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs_debris"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "back_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2074",
            priority: 1,
            sourceIndex: 770,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"back_hall"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"back_hall"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "This is the back hall.  It connects the kitchen and");
            rt.write("\n", "dining room.  The kitchen is east and the dining room is west.");
            },
        },
        {
            name: "name2075",
            priority: 0,
            sourceIndex: 771,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"back_hall"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"},{"field":"state","op":"eq_const","value":"collapsed"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "To the south is the wreckage of the stairs.");
            },
        },
        {
            name: "name2076",
            priority: 0,
            sourceIndex: 772,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"back_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"back_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "kitchen" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2077",
            priority: 0,
            sourceIndex: 773,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"back_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"back_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "dining_room" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2078",
            priority: 0,
            sourceIndex: 774,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"back_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"back_hall"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"},{"field":"state","op":"eq_const","value":"collapsed"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "stairs_debris" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2079",
            priority: 1,
            sourceIndex: 775,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in a old kitchen.  All the windows are");
            rt.write("\n", "boarded up.  The only exit is west.");
            rt.write("\n", " ");
            rt.write("\n", "There is a refrigerator in the corner.");
            rt.write("\n", "A ventilation duct is open over the refrigerator.");
            },
        },
        {
            name: "name2080",
            priority: 0,
            sourceIndex: 776,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "back_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2081",
            priority: 0,
            sourceIndex: 777,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"exit"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "going": "w", "went": "w" });
            },
        },
        {
            name: "name2082",
            priority: 0,
            sourceIndex: 778,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rdoor"},{"field":"door","op":"eq_const","value":"closed"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The refrigirator door is closed.");
            },
        },
        {
            name: "name2083",
            priority: 0,
            sourceIndex: 779,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rdoor"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The door of the ice box is open.");
            },
        },
        {
            name: "name2084",
            priority: 0,
            sourceIndex: 780,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rdoor"},{"field":"door","op":"eq_const","value":"closed"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "door": "open" });
            },
        },
        {
            name: "name2085",
            priority: 0,
            sourceIndex: 781,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rdoor"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"close"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.modify(m.$2, { "door": "closed" });
            },
        },
        {
            name: "name2086",
            priority: 0,
            sourceIndex: 782,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rdoor"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"frig"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a small white cube in the refrigirator.");
            },
        },
        {
            name: "name2087",
            priority: 0,
            sourceIndex: 783,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rdoor"},{"field":"door","op":"eq_const","value":"open"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"frig"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"cube"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "You have a cube.");
            rt.modify(m.$3, { "place": "held" });
            },
        },
        {
            name: "name2088",
            priority: 0,
            sourceIndex: 784,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"u"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "ontop": "frig" });
            },
        },
        {
            name: "name2089",
            priority: 1,
            sourceIndex: 785,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"},{"field":"ontop","op":"eq_const","value":"frig"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are ontop the refrigirator.");
            rt.write("\n", "Going down will put you on the floor, going south will put you in the duct.");
            },
        },
        {
            name: "name2090",
            priority: 0,
            sourceIndex: 786,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]},{"cls":"input","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"mount"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$1, { "ontop": "frig" });
            },
        },
        {
            name: "name2091",
            priority: 0,
            sourceIndex: 787,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"},{"field":"ontop","op":"eq_const","value":"frig"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"kitchen"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            rt.modify(m.$1, { "name": "ductf2", "ontop": null });
            },
        },
        {
            name: "name2092",
            priority: 1,
            sourceIndex: 788,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dining_room"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dining_room"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in a large dining room.  The ceiling is very high.");
            rt.write("\n", "The hall is east.");
            },
        },
        {
            name: "name2093",
            priority: 0,
            sourceIndex: 789,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dining_room"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dining_room"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "back_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2094",
            priority: 1,
            sourceIndex: 790,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are at the upper hall.  You can see down the");
            rt.write("\n", "first steps of some stairs.  A circular staircase");
            rt.write("\n", "continues up.");
            rt.write("\n", " ");
            rt.write("\n", "There is a dark room to the south,");
            rt.write("\n", "a hall to the west, a stone wall to the east,");
            rt.write("\n", "and another room to the north.");
            },
        },
        {
            name: "name2095",
            priority: 0,
            sourceIndex: 791,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"},{"field":"state","op":"eq_const","value":"collapsed"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"d"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$3, { "going": null });
            rt.write("\n", "The stairs are collapsed.");
            },
        },
        {
            name: "name2096",
            priority: 0,
            sourceIndex: 792,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"d"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"stairs"},{"field":"state","op":"eq_const","value":"whole"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "stairs" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2097",
            priority: 0,
            sourceIndex: 793,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"s"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "dark_room" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2098",
            priority: 0,
            sourceIndex: 794,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "long_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2099",
            priority: 0,
            sourceIndex: 795,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"n"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "dull_room" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2100",
            priority: 0,
            sourceIndex: 796,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wall"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "secret_room" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2101",
            priority: 0,
            sourceIndex: 797,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wall"},{"field":"door","op":"eq_const","value":"closed"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"in_set","set":["move","pull","get"]},{"index":1,"op":"eq_const","value":"brick"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The brick moves, but can't be removed from the wall.");
            rt.write("\n", "A secret panel in the wall opens!");
            rt.write("\n", "There is a room ahead.");
            rt.modify(m.$2, { "door": "open" });
            },
        },
        {
            name: "name2102",
            priority: 0,
            sourceIndex: 798,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"close"},{"index":1,"op":"eq_const","value":"wall"}]},{"cls":"portal","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wall"},{"field":"door","op":"eq_const","value":"open"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.modify(m.$3, { "door": "closed" });
            rt.write("\n", "The wall closes and locks.");
            },
        },
        {
            name: "name2103",
            priority: 0,
            sourceIndex: 799,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"u"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "laboratory" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2104",
            priority: 1,
            sourceIndex: 800,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"upper_hall"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"sound","op":"eq_const","value":"on"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You hear clanking and screams coming from the hall.");
            },
        },
        {
            name: "name2105",
            priority: 1,
            sourceIndex: 801,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in the Laboratory.  The most notable feature is a huge ");
            rt.write("\n", "slab in the middle of the room.  There is a large ");
            rt.write("\n", "lever switch.  The stairs are the only obvious exit.  The ceiling");
            rt.write("\n", "is a glass dome painted black, much too high to reach.");
            },
        },
        {
            name: "name2106",
            priority: 0,
            sourceIndex: 802,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"d"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "upper_hall" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2107",
            priority: 0,
            sourceIndex: 803,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"w"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"wall","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"is"},{"index":1,"op":"eq_const","value":"down"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "bar" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2108",
            priority: 1,
            sourceIndex: 804,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"wall","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"is"},{"index":1,"op":"eq_const","value":"down"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The west wall has the shape of a running figure in it.");
            },
        },
        {
            name: "name2109",
            priority: 0,
            sourceIndex: 805,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"B"},{"index":1,"op":"in_set","set":["lever","switch"]}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("monster", ["live"].flat());
            },
        },
        {
            name: "name2110",
            priority: 0,
            sourceIndex: 806,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"lever"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The lever is stuck.");
            },
        },
        {
            name: "name2111",
            priority: 0,
            sourceIndex: 807,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"monster","isPositional":true,"prefixLength":1,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"live"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The lights dim.  A massive door on the east wall");
            rt.write("\n", "opens revealing a bank of computers, generators, and misc.");
            rt.write("\n", "electronic gear.  The generators start to scream.");
            rt.write("\n", "The lights dim more.  Suddenly sparks start to fly from the");
            rt.write("\n", "equipment.  The body on the table starts to jerk around.");
            rt.write("\n", " ");
            rt.write("\n", "As suddenly as it started, the generators turn off, the");
            rt.write("\n", "wall closes.  And everything returns to normal.....");
            rt.write("\n", "Then the body rises, removes its sheet and it is a monster.");
            rt.write("\n", " ");
            rt.write("\n", "The monster approaches you and says 'Trick or Treat'");
            rt.make("object", { "name": "lever", "state": "thrown" });
            },
        },
        {
            name: "name2112",
            priority: 0,
            sourceIndex: 808,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":true,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is the shape of a body on the slab, covered with a sheet.");
            },
        },
        {
            name: "name2113",
            priority: 0,
            sourceIndex: 809,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"candy"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"give"},{"index":1,"op":"eq_const","value":"candy"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.remove(m.$2);
            rt.remove(m.$5);
            rt.write("\n", "The monster is pleased.", "He eats the candy, walks through the west wall");
            rt.write("\n", "and disappears.");
            rt.make("wall", ["is", "down"].flat());
            },
        },
        {
            name: "name2114",
            priority: 0,
            sourceIndex: 810,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_var","var":"x"},{"index":1,"op":"eq_const","value":"monster"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$4);
            rt.write("\n", "The monster is frightened and holds his breath until he turns");
            rt.write("\n", "blue.  He then disappears.");
            },
        },
        {
            name: "name2115",
            priority: 0,
            sourceIndex: 811,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The lever has been thrown, and is stuck in that position.");
            },
        },
        {
            name: "name2116",
            priority: 0,
            sourceIndex: 812,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"football"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kick"},{"index":1,"op":"eq_const","value":"football"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The football goes crashing through the glass dome.");
            rt.modify(m.$2, { "place": "lawn", "side": "in", "east": 7, "north": 4 });
            rt.make("object", { "name": "dome", "state": "broken" });
            },
        },
        {
            name: "name2117",
            priority: 0,
            sourceIndex: 813,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"football"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"rope"},{"field":"state","op":"eq_const","value":"tied"},{"field":"tied","op":"eq_const","value":"football"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"kick"},{"index":1,"op":"eq_const","value":"football"},{"index":2,"op":"eq_var","var":"p"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "Kicking the football tears the rope off of it.");
            rt.write("\n", "The football goes crashing through the glass dome.");
            rt.modify(m.$3, { "state": "untied" });
            rt.modify(m.$2, { "place": "lawn", "side": "in", "east": 7, "north": 4 });
            rt.make("object", { "name": "dome", "state": "broken" });
            },
        },
        {
            name: "name2118",
            priority: 0,
            sourceIndex: 814,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dracula"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dome"},{"field":"state","op":"eq_const","value":"broken"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The bat flies through the hole in the dome and escapes.");
            },
        },
        {
            name: "name2119",
            priority: 0,
            sourceIndex: 815,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dracula"},{"field":"place","op":"eq_const","value":"laboratory"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "There is a bat flying around in the dome, too high to reach.");
            },
        },
        {
            name: "name2120",
            priority: 0,
            sourceIndex: 816,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dracula"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"dracula"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "I said the bat was too high to reach, even on a stool.");
            },
        },
        {
            name: "name2121",
            priority: 0,
            sourceIndex: 817,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dracula"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"get"},{"index":1,"op":"eq_const","value":"bat"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$3);
            rt.write("\n", "The bat is much too high for you to get.");
            },
        },
        {
            name: "name2122",
            priority: 0,
            sourceIndex: 818,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dracula"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dome"},{"field":"state","op":"eq_const","value":"broken"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"morning","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.make("object", { "name": "ring", "place": "laboratory", "treasure": "t" });
            rt.write("\n", "The sun's rays cause the bat to shrivel.  Something falls to the floor.");
            },
        },
        {
            name: "name2123",
            priority: 0,
            sourceIndex: 819,
            conditions: [{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dracula"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dome"},{"field":"state","op":"eq_const","value":"broken"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"morning","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.make("object", { "name": "ring", "place": "laboratory", "treasure": "t" });
            },
        },
        {
            name: "name2124",
            priority: 0,
            sourceIndex: 820,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"},{"field":"visited","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "The monster is drooling on himself, saying 'Trick or Treat'");
            },
        },
        {
            name: "name2125",
            priority: 0,
            sourceIndex: 821,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"give"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.write("\n", "The monster doesn't like ", m.x, ".  ");
            rt.write("\n", "He is getting very angry.");
            },
        },
        {
            name: "name2126",
            priority: 0,
            sourceIndex: 822,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]},{"cls":"input","isPositional":true,"prefixLength":3,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"give"},{"index":1,"op":"eq_const","value":"monster"},{"index":2,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.make("input", ["give", m.x].flat());
            },
        },
        {
            name: "name2127",
            priority: 0,
            sourceIndex: 823,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]},{"cls":"input","isPositional":true,"prefixLength":4,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"give"},{"index":1,"op":"eq_var","var":"x"},{"index":2,"op":"eq_const","value":"to"},{"index":3,"op":"eq_const","value":"monster"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.make("input", ["give", m.x].flat());
            },
        },
        {
            name: "name2128",
            priority: 0,
            sourceIndex: 824,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"throw"},{"index":1,"op":"eq_var","var":"x"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$4);
            rt.make("input", ["give", m.x].flat());
            },
        },
        {
            name: "name2129",
            priority: 0,
            sourceIndex: 825,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dome"},{"field":"state","op":"eq_const","value":"broken"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"morning","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Light shows throught the hole.");
            },
        },
        {
            name: "name2130",
            priority: 0,
            sourceIndex: 826,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"matches"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"morning","op":"eq_const","value":"t"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "Even in the sun light the matches don't dry.");
            rt.write("\n", "The laboratory is damp and musty.");
            },
        },
        {
            name: "name2131",
            priority: 0,
            sourceIndex: 827,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"dry"},{"index":1,"op":"eq_const","value":"matches"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.write("\n", "The laboratory is very damp.");
            },
        },
        {
            name: "name2132",
            priority: 0,
            sourceIndex: 828,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"dome"},{"field":"state","op":"eq_const","value":"broken"}]},{"cls":"time","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"morning","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You can see the moon through the dome.");
            },
        },
        {
            name: "name2133",
            priority: 0,
            sourceIndex: 829,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"monster"},{"field":"place","op":"eq_const","value":"laboratory"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"cube"},{"field":"place","op":"eq_const","value":"held"}]},{"cls":"object","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"lever"},{"field":"state","op":"eq_const","value":"thrown"}]},{"cls":"input","isPositional":true,"prefixLength":2,"negated":false,"tests":[{"index":0,"op":"eq_const","value":"give"},{"index":1,"op":"eq_const","value":"cube"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$2);
            rt.remove(m.$3);
            rt.remove(m.$5);
            rt.write("\n", "The monster eats the cube.  He then starts saying 'ohhh, ahhhh'.");
            rt.write("\n", "'Out of sight man.' Then he jumps straight up through the dome.");
            rt.make("object", { "name": "dome", "state": "broken" });
            },
        },
        {
            name: "name2134",
            priority: 1,
            sourceIndex: 830,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bar"}]},{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bar"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bar"},{"field":"visited","op":"eq_const","value":"nil"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in a bar.  There isn't any booze.");
            },
        },
        {
            name: "name2135",
            priority: 0,
            sourceIndex: 831,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bar"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]},{"cls":"place","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"bar"}]}],
            action: async (m, wm, term) => {
                rt.modify(m.$1, { "name": "laboratory" });
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$3, { "visited": "t" });
            },
        },
        {
            name: "name2136",
            priority: 1,
            sourceIndex: 832,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wine_racks"}]}],
            action: async (m, wm, term) => {
                rt.write("\n", "You are in rows of wine racks that stretch out of sight in all directions.");
            },
        },
        {
            name: "name2137",
            priority: 0,
            sourceIndex: 833,
            conditions: [{"cls":"location","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"name","op":"eq_const","value":"wine_racks"},{"field":"east","op":"eq_var","var":"e"}]},{"cls":"status","isPositional":false,"prefixLength":null,"negated":false,"tests":[{"field":"going","op":"eq_const","value":"e"}]}],
            action: async (m, wm, term) => {
                rt.remove(m.$1);
            rt.modify(m.$2, { "going": null });
            rt.modify(m.$1, { "name": "wine_racks", "east": rt.compute(1, "+", m.e) });
            },
        },
    ];
}
