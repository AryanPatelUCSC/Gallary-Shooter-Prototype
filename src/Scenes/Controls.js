class Controls extends Phaser.Scene {
    constructor() { super("controlsScene"); }
    create() {
        this.add.text(400, 300, "A / D or ARROWS: Move\nSPACE: Fire Neural Disruptor", { fontSize: '28px', align: 'center' }).setOrigin(0.5);
        this.add.text(400, 500, "PRESS ANY KEY", { fontSize: '18px' }).setOrigin(0.5);
        this.input.keyboard.on('keydown', () => this.scene.start("titleScene"));
    }
}