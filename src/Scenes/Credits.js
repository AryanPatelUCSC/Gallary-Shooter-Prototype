class Credits extends Phaser.Scene {
    constructor() { super("creditsScene"); }
    create() {
        this.add.text(400, 100, "CREDITS", { fontSize: '48px', fill: '#00ffff' }).setOrigin(0.5);
        this.add.text(400, 300, "Game Programming: Aryan Patel\nArt & Assets: Kenney.nl\nMusic & SFX: Kenney Sci-Fi Pack\nBackground: Penusbmic sci-fi Planetone\nTrains: Kaawan tiny trains", { fontSize: '24px', align: 'center' }).setOrigin(0.5);
        this.add.text(400, 500, "PRESS ANY KEY TO RETURN", { fontSize: '20px' }).setOrigin(0.5);
        this.input.keyboard.on('keydown', () => this.scene.start("titleScene"));
    }
}