class GalleryShooter extends Phaser.Scene {
    constructor() { super("galleryScene"); }

    create() {
        this.init_game();
    }

    init_game() {
        this.score = 0;
        this.health = 3;
        this.scoreMultiplier = 1;
        this.gameStarted = false;

        // Backgrounds
        this.bgFar = this.add.tileSprite(400, 300, 800, 600, "bg_far").setDisplaySize(800, 600);
        this.bgMid = this.add.tileSprite(400, 300, 800, 600, "bg_mid").setDisplaySize(800, 600);

        // Rails
        this.tracks = this.add.group();
        for (let i = 0; i < 14; i++) {
            this.tracks.add(this.add.sprite(i * 80, 580, "trains", 'trains 15.png').setScale(2.5));
        }

        // HUD - Tight single-line format
        const hudStyle = { fontSize: '18px', fontFamily: 'Courier, monospace', fontStyle: 'bold' };
        this.scoreText = this.add.text(16, 20, "NEURAL REBOOTS: 0", { ...hudStyle, fill: '#00ffff' }).setOrigin(0, 0);
        this.multiplierText = this.add.text(400, 20, "", { ...hudStyle, fill: '#ffff00' }).setOrigin(0.5, 0);
        this.hpText = this.add.text(784, 20, "INTEGRITY: 100%", { ...hudStyle, fill: '#ffc400' }).setOrigin(1, 0);

        // Train Assembly
        this.trainParts = this.add.group();
        // Cargo frames are 2, 3, 4, and 5
        const cargoTypes = ['trains 2.png', 'trains 3.png', 'trains 4.png', 'trains 5.png']; 

        for (let i = 0; i < 16; i++) {
            let frameName;
            // index 13 = nose, index 12 = cab
            if (i === 0) frameName = 'trains 13.png'; 
            else if (i === 1) frameName = 'trains 12.png';  
            else frameName = Phaser.Utils.Array.GetRandom(cargoTypes);
            
            // Y=540 sits the train on the rails
            let car = this.add.sprite(-80 - (i * 80), 560, "trains", frameName).setScale(2.5);
            this.physics.add.existing(car, true); 
            this.trainParts.add(car);
        }

        this.player = new Player(this, 400, 520);
        this.player.setVisible(false).setActive(false);
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemies = this.physics.add.group();
        this.enemyBullets = this.physics.add.group({ classType: EnemyBullet, runChildUpdate: true });

        // Collision logic using overlaps [cite: 131-145]
        this.physics.add.overlap(this.bullets, this.enemies, this.onEnemyHit, null, this);
        this.physics.add.overlap(this.player, this.enemyBullets, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.bullets, this.enemyBullets, this.bulletClash, null, this);
    }

    update(time, delta) {
        this.bgFar.tilePositionX += 0.2; this.bgMid.tilePositionX += 0.8;
        
        this.tracks.getChildren().forEach(t => { 
            t.x -= 6; 
            if (t.x <= -80) t.x += 1120; 
        });

        this.trainParts.getChildren().forEach(car => {
            car.x += 2;
            if (car.x > 880) {
                let minX = 9999; 
                this.trainParts.getChildren().forEach(c => { if(c.x < minX) minX = c.x; });
                car.x = minX - 80;
                
                // Detection using updated frame name
                if (car.frame.name === 'trains 12.png' && !this.gameStarted) {
                    this.gameStarted = true;
                    this.player.setVisible(true).setActive(true);
                    this.spawnWave();
                }
                
                // Once an engine part wraps, turn it into random cargo
                if (car.frame.name === 'trains 13.png' || car.frame.name === 'trains 12.png') {
                    car.setFrame(Phaser.Utils.Array.GetRandom(['trains 2.png', 'trains 3.png', 'trains 4.png', 'trains 5.png']));
                }
            }
        });

        if (this.gameStarted) {
            this.player.update(this.keys);
            if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
                let b = this.bullets.get();
                if (b) {
                    b.fire(this.player.x, this.player.y);
                    this.sound.play("shoot", { volume: 0.3 });
                }
            }
        }
    }

    onEnemyHit(bullet, enemy) {
        this.score += (100 * this.scoreMultiplier);
        this.scoreText.setText(`NEURAL REBOOTS: ${this.score}`);
        this.scoreMultiplier = 1; this.multiplierText.setText("");
        bullet.destroy(); enemy.destroy();
        if (this.enemies.countActive() === 0) this.scene.start("bossScene", { score: this.score });
        // Inside your onEnemyHit function in GalleryShooter.js:
        if (this.enemies.countActive() === 0) {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start("bossScene", { score: this.score });
            });
        }
    }

    bulletClash(b1, b2) {
        b1.destroy(); b2.destroy();
        this.scoreMultiplier++;
        this.multiplierText.setText(`MULTIPLIER: ${this.scoreMultiplier}X!`);
    }

    handlePlayerHit(p, b) {
        b.destroy();
        if (p.onHit()) {
            this.health--;
            this.hpText.setText(`INTEGRITY: ${this.health * 33}%`);
            if (this.health <= 0) this.scene.start("gameOverScene", { score: this.score });
        }
    }

    spawnWave() {
        for(let i=0; i<5; i++) {
            let e = new Enemy(this, 100 + (i*150), 100, "space", "spaceShips_001.png", 100, this.enemyBullets);
            this.enemies.add(e);
        }
    }
}