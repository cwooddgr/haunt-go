// BIOS-style boot sequence: fake hardware check before the game loads.

export async function playBootSequence(term) {
    const originalSpeed = term.speed;
    term.setSpeed(180);

    await sleep(350);
    term.println("CHEZ MOOSE TERMINAL MODEL IV");
    await sleep(120);
    term.println("PITTSBURGH DYNAMICS CORP.   (C) 1979");
    await sleep(240);
    term.blank();
    await sleep(100);

    term.print("MEMORY TEST ");
    await sleep(180);
    for (let i = 8; i <= 64; i += 8) {
        term.print(i + "K ");
        await sleep(70);
    }
    term.println(" OK");
    await sleep(150);

    term.println("CPU ............. MC 6809E    OK");
    await sleep(120);
    term.println("ACIA ............ MC 6850     OK");
    await sleep(120);
    term.println("CRT CONTROLLER .. MC 6845     OK");
    await sleep(120);
    term.println("DISK DRIVE 0 .... READY");
    await sleep(200);
    term.blank();

    term.print("LOADING HAUNT.OPS ");
    for (let i = 0; i < 6; i++) {
        await sleep(200);
        term.print(".");
    }
    await sleep(250);
    term.println(" OK");
    await sleep(200);

    term.println("LOADING WORLD DATA .......... OK");
    await sleep(140);
    term.println("STARTING PRODUCTION SYSTEM .. OK");
    await sleep(300);
    term.blank();
    term.println("EXECUTING: HAUNT.OPS V4.6");
    await sleep(500);
    term.blank();
    term.blank();

    term.setSpeed(originalSpeed);
    await term._flushQueue();
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
