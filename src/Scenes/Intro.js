class Intro extends Phaser.Scene {
    constructor() { super("introScene"); }
    create() {
        const story = ["THE YEAR IS 2026...", "THE WORLD IS TRAPPED IN A COMA.", "YOU ARE THE LAST NEURAL COURIER.", "PRESS SPACE TO INITIALIZE REBOOT"];
        let display = this.add.text(400, 300, "", { fontSize: '24px', align: 'center' }).setOrigin(0.5);
        this.showLines(display, story, 0);
        this.input.keyboard.on('keydown-SPACE', () => this.scene.start("galleryScene"));
    }
    showLines(obj, lines, i) {
        if (i >= lines.length) return;
        obj.setText(lines[i]).setAlpha(0);
        this.tweens.add({ targets: obj, alpha: 1, duration: 1000, yoyo: true, hold: 2000, onComplete: () => this.showLines(obj, lines, i + 1) });
    }
}