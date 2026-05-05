class Load extends Phaser.Scene 
{
    constructor() 
    {
        super("loadScene");
    }

    preload() 
    {
        this.load.image("bg_far", "assets/free-steampunk-cityscape-pixel-backgrounds/background 1/origbig.png");
        this.load.image("bg_mid", "assets/free-steampunk-cityscape-pixel-backgrounds/background 2/origbig2.png");

        this.load.spritesheet('trains', 'assets/trains.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });

        this.load.atlasXML(
            "space", 
            "assets/kenney_space-shooter-extension/Spritesheet/spaceShooter2_spritesheet.png", 
            "assets/kenney_space-shooter-extension/Spritesheet/spaceShooter2_spritesheet.xml"
        );

        // Characters (The Player animations)
        this.load.atlasXML(
            "chars", 
            "assets/kenney_pixel-vehicle-pack/Spritesheet/spritesheet_characters.png", 
            "assets/kenney_pixel-vehicle-pack/Spritesheet/spritesheet_characters.xml"
        );

        // Props (Highway/Rail Platform)
        this.load.atlasXML(
            "props", 
            "assets/kenney_pixel-vehicle-pack/Spritesheet/spritesheet_props.png", 
            "assets/kenney_pixel-vehicle-pack/Spritesheet/spritesheet_props.xml"
        );

        // Enemies (Aliens/Ghosts)
        this.load.atlasXML(
            "enemies", 
            "assets/kenney_platformer-art-extended-enemies/Spritesheets/enemies.png", 
            "assets/kenney_platformer-art-extended-enemies/Spritesheets/enemies.xml"
        );

        // Complete Pack (Used for bullets/lasers)
        this.load.atlasXML(
            "complete", 
            "assets/kenney_pixel-vehicle-pack/Spritesheet/spritesheet_complete.png", 
            "assets/kenney_pixel-vehicle-pack/Spritesheet/spritesheet_complete.xml"
        );
        
        this.load.atlasXML(
            "lasers",
            "assets/kenney_alien-ufo-pack/Spritesheets/spritesheet_lasers.png",
            "assets/kenney_alien-ufo-pack/Spritesheets/spritesheet_lasers.xml"
        );

        const audioPath = "assets/kenney_sci-fi-sounds/Audio/";
        
        this.load.audio("engine", audioPath + "spaceEngine_000.ogg");
        this.load.audio("shoot", audioPath + "laserRetro_004.ogg");
        this.load.audio("explosion", audioPath + "lowFrequency_explosion_000.ogg");
        this.load.audio("hit", audioPath + "impactMetal_003.ogg");
        this.load.audio("shield", audioPath + "forceField_001.ogg");
        this.load.audio("spawn", audioPath + "thrusterFire_000.ogg");

        // Simple Loading Progress Bar
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();
            loadingBar.fillStyle(0x00ffff, 1);
            loadingBar.fillRect(0, 290, 800 * value, 20);
        });
    }

    create() 
    {
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'chars', frame: 'man_walk1.png' },
                { key: 'chars', frame: 'man_walk2.png' }
            ],
            frameRate: 10,
            repeat: -1
        });

        // Move to the Intro Story Scene
        this.scene.start("introScene");
    }
}