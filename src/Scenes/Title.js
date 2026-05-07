class Title extends Phaser.Scene {
    constructor() { super("titleScene"); }

    create() {
        this.bg = this.add.tileSprite(400, 300, 800, 600, "bg_far").setDisplaySize(800, 600);
        this.add.text(400, 150, "NEURAL RAILGUN", { fontSize: '64px', fill: '#00ffff', fontStyle: 'bold' }).setOrigin(0.5);

        // Simple High Score (Bonus)
        let topScore = localStorage.getItem('highScore') || 0;
        this.add.text(400, 230, `SYSTEM HIGH SCORE: ${topScore}`, { fontSize: '20px', fill: '#ffff00' }).setOrigin(0.5);

        this.createButton(400, 350, "INITIALIZE MISSION", () => this.scene.start("introScene"));
        this.createButton(400, 420, "VIEW CONTROLS", () => this.scene.start("controlsScene"));
        this.createButton(400, 490, "CREDITS", () => this.scene.start("creditsScene"));
    }

    createButton(x, y, label, callback) {
        let btn = this.add.text(x, y, label, { fontSize: '24px', fill: '#ffffff' })
            .setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setStyle({ fill: '#00ffff' }))
            .on('pointerout', () => btn.setStyle({ fill: '#ffffff' }))
            .on('pointerdown', () => callback());
    }

    update() { this.bg.tilePositionX += 0.5; }
}