class Load extends Phaser.Scene {
    constructor() { super("loadScene"); }

    preload() {
        // Background Assets
        this.load.image("bg_far", "assets/free-steampunk-cityscape-pixel-backgrounds/background 1/origbig.png");
        this.load.image("bg_mid", "assets/free-steampunk-cityscape-pixel-backgrounds/background 2/origbig2.png");

        // Train Spritesheet (32x32 tiles)
        this.load.aseprite('trains', 'assets/trains-sheet.png', 'assets/trains.json');

        // Atlases for Ships, Characters, and Lasers
        this.load.atlasXML("space", "assets/kenney_space-shooter-extension/Spritesheet/spaceShooter2_spritesheet.png", "assets/kenney_space-shooter-extension/Spritesheet/spaceShooter2_spritesheet.xml");
        this.load.atlasXML("chars", "assets/kenney_pixel-vehicle-pack/Spritesheet/spritesheet_characters.png", "assets/kenney_pixel-vehicle-pack/Spritesheet/spritesheet_characters.xml");
        this.load.atlasXML("lasers", "assets/kenney_alien-ufo-pack/Spritesheets/spritesheet_lasers.png", "assets/kenney_alien-ufo-pack/Spritesheets/spritesheet_lasers.xml");

        // Audio Assets
        const audioPath = "assets/kenney_sci-fi-sounds/Audio/";
        this.load.audio("shoot", audioPath + "laserRetro_004.ogg");
        this.load.audio("explosion", audioPath + "lowFrequency_explosion_000.ogg");
        this.load.audio("hit", audioPath + "impactMetal_003.ogg");
        this.load.audio("spawn", audioPath + "thrusterFire_000.ogg");

        // Progress Bar (Visual Component)
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();
            loadingBar.fillStyle(0x00ffff, 1);
            loadingBar.fillRect(0, 290, 800 * value, 20);
        });
    }

    create() {
        // Create animations for the player [cite: 167]
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'chars', frame: 'man_walk1.png' },
                { key: 'chars', frame: 'man_walk2.png' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.scene.start("titleScene");
    }
}