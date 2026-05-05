class GalleryShooter extends Phaser.Scene {
    constructor() { super("galleryScene"); }

    create() 
    {
        // 1. Layers (Parallax)
        this.bgFar = this.add.tileSprite(400, 300, 800, 600, "bg_far").setDisplaySize(800, 600);
        this.bgMid = this.add.tileSprite(400, 300, 800, 600, "bg_mid").setDisplaySize(800, 600);

        // 2. FOOLPROOF TRACKS: Spawns 14 tracks (more than enough to fill 800px)
        this.tracks = this.add.group();
        for (let i = 0; i < 14; i++) {
            let track = this.add.sprite(i * 80, 560, "trains", 16).setScale(2.5);
            this.tracks.add(track);
        }

        // 3. HUD & Score State
        this.score = 0;
        this.health = 3;
        this.scoreMultiplier = 1; 

        // 4. CINEMATIC TRAIN SETUP
        this.trainParts = this.add.group();
        // Spawn 16 cars. i=0 is the absolute front of the train.
        for (let i = 0; i < 16; i++) {
            let frame;
            if (i === 0) frame = 13;      // Absolute Front (Orange Engine Cab)
            else if (i === 1) frame = 12; // Engine Back (Orange Exhaust)
            else frame = Phaser.Math.RND.pick([0, 1, 2, 3, 4, 5]); // Random Cargo
            
            // Place the Engine just off-screen to the left (x = -80). 
            // The rest of the cargo trails behind it to the left (-160, -240, etc.)
            let car = this.add.sprite(-80 - (i * 80), 560, "trains", frame).setScale(2.5);
            
            // Tight-fitting AABBs for precise collision
            this.physics.add.existing(car); 
            car.body.allowGravity = false;
            car.body.immovable = true;
            car.body.setSize(30, 20); 
            car.body.setOffset(1, 6);
            
            this.trainParts.add(car);
        }
        
        // HUD Formatting
        const hudStyle = { fontSize: '18px', fontFamily: 'Courier, monospace', fontStyle: 'bold' };
        this.scoreText = this.add.text(16, 20, "NEURAL REBOOTS: 0", { ...hudStyle, fill: '#00ffff' }).setOrigin(0, 0);
        this.multiplierText = this.add.text(400, 20, "", { ...hudStyle, fill: '#ff0000b5' }).setOrigin(0.5, 0);
        this.hpText = this.add.text(784, 20, "INTEGRITY: 100%", { ...hudStyle, fill: '#ffc400' }).setOrigin(1, 0);

        // 5. Player (Invisible at start)
        this.player = new Player(this, 400, 520);
        this.player.setVisible(false).setActive(false);
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.a = this.input.keyboard.addKey('A');
        this.keys.d = this.input.keyboard.addKey('D');

        // 6. Groups & Particles
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemyBullets = this.physics.add.group({ classType: EnemyBullet, runChildUpdate: true });
        this.enemies = this.physics.add.group();

        this.emitter = this.add.particles(0, 0, "space", {
            frame: 'spaceMissiles_012.png',
            speed: { min: -100, max: 100 },
            scale: { start: 0.5, end: 0 },
            lifespan: 600,
            emitting: false
        });

        // 7. Physics Overlaps
        this.physics.add.overlap(this.bullets, this.enemies, this.onEnemyHit, null, this);
        this.physics.add.overlap(this.player, this.enemyBullets, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.bullets, this.enemyBullets, this.bulletClash, null, this);

        // This blocks the player and enemies from acting until the train passes
        this.gameStarted = false;
    }

    bulletClash(playerBullet, enemyBullet) {
        if (!playerBullet.active || !enemyBullet.active) return;
        this.emitter.emitParticleAt(playerBullet.x, playerBullet.y, 5);
        this.sound.play("hit", { volume: 0.2 });
        playerBullet.destroy();
        enemyBullet.destroy();
        this.scoreMultiplier++;
        this.multiplierText.setText(`MULTIPLIER: ${this.scoreMultiplier}X!`);
        this.tweens.add({ targets: this.multiplierText, scale: { start: 1.5, end: 1 }, duration: 200, ease: 'Bounce.easeOut' });
    }

    onEnemyHit(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;
        this.emitter.emitParticleAt(enemy.x, enemy.y, 15);
        this.sound.play("explosion", { volume: 0.5 });
        this.cameras.main.shake(100, 0.005);
        this.score += (100 * this.scoreMultiplier);
        this.scoreText.setText(`NEURAL REBOOTS: ${this.score}`);
        this.scoreMultiplier = 1;
        this.multiplierText.setText("");
        bullet.destroy();
        enemy.destroy();
        if (this.enemies.countActive() === 0) this.spawnWave();
    }

    handlePlayerHit(player, enemyBullet) {
        if (!enemyBullet.active) return;
        enemyBullet.destroy();
        if (player.onHit()) { 
            this.health--;
            this.sound.play("hit");
            this.cameras.main.shake(150, 0.01);
            this.scoreMultiplier = 1;
            this.multiplierText.setText("");
            if (this.hpText) this.hpText.setText(`INTEGRITY: ${this.health * 33}%`);
            if (this.health <= 0) this.scene.start("gameOverScene", { score: this.score });
        }
    }

    spawnWave() {
        this.sound.play("spawn", { volume: 0.3 }); 
        let path = new Phaser.Curves.Spline([0, 100, 400, 350, 800, 100]);
        for(let i=0; i<5; i++) {
            let frame = (i % 2 === 0) ? "spaceShips_001.png" : "spaceShips_002.png";
            let e = new Enemy(this, 100 + (i*150), 100, "space", frame, 100, this.enemyBullets);
            this.enemies.add(e);
            if (i === 2) e.startDive(path);
        }
    }

    update(time, delta) {
        // Background Parallax
        this.bgFar.tilePositionX += 0.2; 
        this.bgMid.tilePositionX += 0.8;

        // DYNAMIC TRACK WRAPPING (Guarantees zero gaps)
        this.tracks.getChildren().forEach(track => {
            track.x -= 6;
            if (track.x <= -80) {
                let maxX = -9999;
                this.tracks.getChildren().forEach(t => { if(t.x > maxX) maxX = t.x; });
                track.x = maxX + 80;
            }
        });

        // DYNAMIC TRAIN WRAPPING
        this.trainParts.getChildren().forEach(car => {
            car.x += 2; 
            
            // When a car goes completely off the right side of the screen
            if (car.x > 880) {
                // Snap it exactly 80px behind the last car
                let minX = 9999;
                this.trainParts.getChildren().forEach(c => { if(c.x < minX) minX = c.x; });
                car.x = minX - 80;

                let oldFrame = car.frame.name;

                // If an Engine piece leaves the screen, convert it to random cargo
                if (oldFrame === 12 || oldFrame === 13) {
                    car.setFrame(Phaser.Math.RND.pick([0, 1, 2, 3, 4, 5]));
                    
                    // ONCE the back of the engine leaves the screen, start the game
                    if (oldFrame === 12 && !this.gameStarted) {
                        this.gameStarted = true;
                        this.player.setVisible(true).setActive(true);
                        this.spawnWave(); 
                    }
                }
            }
        });

        // Player Logic (Only runs after the engine passes and the game triggers)
        if (this.gameStarted) {
            this.player.update(this.keys, delta);

            if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
                let b = this.bullets.get();
                if (b) {
                    b.fire(this.player.x, this.player.y);
                    this.sound.play("shoot", { volume: 0.3 });
                }
            }
        }
    }
}