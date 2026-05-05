class Intro extends Phaser.Scene 
{
    constructor() { super("introScene"); }

    create() 
    {
        this.sound.play("shield", { volume: 0.4 });
        const story = ["THE YEAR IS 2026.", "THE WORLD IS TRAPPED IN A COMA.", "YOU ARE THE LAST AWAKE.", "REBOOT THE WORLD.", "PRESS SPACE"];
        
        let display = this.add.text(400, 300, "", { fontSize: '24px', align: 'center' }).setOrigin(0.5);
        this.showLines(display, story, 0);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start("galleryScene");
        });
    }

    showLines(obj, lines, i) 
    {
        if (i >= lines.length) return;
        obj.setText(lines[i]).setAlpha(0);
        this.tweens.add({
            targets: obj, alpha: 1, duration: 1000, yoyo: true, hold: 1500,
            onComplete: () => this.showLines(obj, lines, i + 1)
        });
    }
}