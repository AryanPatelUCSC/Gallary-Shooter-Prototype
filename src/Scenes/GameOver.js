class GameOver extends Phaser.Scene 
{
    constructor() { super("gameOverScene"); }
    create(data) 
    {
        this.add.text(400, 250, "CONNECTION LOST", { fontSize: '48px' }).setOrigin(0.5);
        this.add.text(400, 320, `POPULATION REBOOTED: ${data.score}`, { fontSize: '24px' }).setOrigin(0.5);
        this.add.text(400, 450, "PRESS SPACE TO RETRY", { fontSize: '18px' }).setOrigin(0.5);
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start("loadScene"));
    }
}