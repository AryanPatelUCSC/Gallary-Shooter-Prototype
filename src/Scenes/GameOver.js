class GameOver extends Phaser.Scene {
    constructor() { super("gameOverScene"); }
    init(data) {
        this.score = data.score || 0;
        let high = localStorage.getItem('highScore') || 0;
        if (this.score > high) localStorage.setItem('highScore', this.score);
    }
    create() {
        this.add.text(400, 200, "REBOOT SEQUENCE COMPLETE", { fontSize: '48px', fill: '#00ffff' }).setOrigin(0.5);
        this.add.text(400, 300, `FINAL SCORE: ${this.score}`, { fontSize: '32px' }).setOrigin(0.5);
        this.add.text(400, 500, "PRESS SPACE TO RETURN TO COMMAND", { fontSize: '20px' }).setOrigin(0.5);
        this.input.keyboard.on('keydown-SPACE', () => this.scene.start("titleScene"));
    }
}