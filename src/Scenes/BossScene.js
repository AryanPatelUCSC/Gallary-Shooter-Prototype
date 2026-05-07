class BossScene extends Phaser.Scene {
    constructor() { super("bossScene"); }

    init(data) {
        this.score = data.score || 0;
        this.health = data.health || 3;
    }

    create() {
        // 1. BACKGROUNDS & HUD
        this.bgFar = this.add.tileSprite(400, 300, 800, 600, "bg_far").setDisplaySize(800, 600);
        this.bgMid = this.add.tileSprite(400, 300, 800, 600, "bg_mid").setDisplaySize(800, 600).setTint(0x444444);

        const hudStyle = { fontSize: '18px', fontFamily: 'Courier, monospace', fontStyle: 'bold' };
        this.scoreText = this.add.text(16, 20, `REBOOTS: ${this.score}`, { ...hudStyle, fill: '#00ffff' });
        this.hpText = this.add.text(784, 20, `INTEGRITY: ${Math.max(0, this.health * 33)}%`, { ...hudStyle, fill: '#ffc400' }).setOrigin(1, 0);
        
        this.hpBar = this.add.graphics();

        // 2. INFINITE ENVIRONMENT (Corrected JSON Frame Names)
        this.tracks = this.add.group();
        for (let i = 0; i < 14; i++) {
            // trains 15.png is the wooden rail in your JSON
            this.tracks.add(this.add.sprite(i * 80, 580, "trains", 'trains 15.png').setScale(2.5));
        }

        this.trainParts = this.add.group();
        const cargoList = ['trains 2.png', 'trains 3.png', 'trains 4.png', 'trains 5.png']; //
        for (let i = 0; i < 11; i++) {
            let car = this.add.sprite(i * 80, 540, "trains", Phaser.Utils.Array.GetRandom(cargoList)).setScale(2.5);
            this.physics.add.existing(car, true);
            this.trainParts.add(car);
        }

        // 3. PLAYER & PROJECTILES
        this.player = new Player(this, 400, 490);
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.bossBullets = this.physics.add.group({ classType: BossBullet, runChildUpdate: true });

        // 4. THE BOSS
        this.boss = this.physics.add.sprite(400, -150, "space", "ufoBlue.png").setScale(4);
        this.bossHP = 100;
        this.maxHP = 100;
        this.phase = 1; 
        this.isTransitioning = false;

        this.tweens.add({ targets: this.boss, y: 150, duration: 2000, ease: 'Back.easeOut' });

        // 5. ATTACK PATTERN REWRITE
        this.time.addEvent({
            delay: 1000, // Slightly slower delay to account for more bullets in Phase 2
            loop: true,
            callback: () => {
                if (this.boss.active && !this.isTransitioning && this.boss.y > 0) {
                    if (this.phase === 1) {
                        // Phase 1: Simple 3-round burst downward
                        for(let j=0; j<3; j++) {
                            this.time.delayedCall(j * 100, () => {
                                let b = this.bossBullets.get();
                                if (b) b.fire(this.boss.x + Phaser.Math.Between(-30, 30), this.boss.y + 40);
                            });
                        }
                    } else {
                        // Phase 2: CIRCLE SPREAD SHOT (8 Bullets)
                        for (let i = 0; i < 8; i++) {
                            let b = this.bossBullets.get();
                            if (b) {
                                let angle = i * 45; // 360 degrees divided by 8 bullets
                                b.fireAtAngle(this.boss.x, this.boss.y, angle, 300);
                            }
                        }
                    }
                    this.sound.play("shoot", { volume: 0.2 });
                }
            }
        });

        // 6. COLLISIONS
        this.physics.add.overlap(this.bullets, this.boss, this.hitBoss, null, this);
        this.physics.add.overlap(this.player, this.bossBullets, this.hitPlayer, null, this);
    }

    hitBoss(boss, bullet) {
        bullet.destroy();
        this.bossHP -= 2;

        if (this.bossHP <= 50 && this.phase === 1 && !this.isTransitioning) {
            this.isTransitioning = true;
            this.boss.setTint(0xff0000);
            this.cameras.main.shake(300, 0.005);

            this.tweens.add({
                targets: this.boss,
                x: 400, y: 200,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => {
                    this.phase = 2;
                    this.isTransitioning = false;
                }
            });
        }

        if (this.bossHP <= 0) this.scene.start("gameOverScene", { score: this.score + 10000 });
    }

    hitPlayer(player, bullet) {
        bullet.destroy();
        if (player.onHit()) {
            this.health--; // Damage from boss projectiles
            this.hpText.setText(`INTEGRITY: ${Math.max(0, this.health * 33)}%`);
            if (this.health <= 0) this.scene.start("gameOverScene", { score: this.score });
        }
    }

    update(time, delta) {
        this.bgFar.tilePositionX += 0.2;
        this.bgMid.tilePositionX += 0.8;
        this.tracks.getChildren().forEach(t => { t.x -= 6; if (t.x <= -80) t.x += 1120; });
        this.trainParts.getChildren().forEach(c => { c.x -= 6; if (c.x <= -80) c.x += 880; });

        this.player.update(this.keys);
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            let b = this.bullets.get();
            if (b) b.fire(this.player.x, this.player.y);
            this.sound.play("shoot", { volume: 0.3 });
        }

        if (!this.isTransitioning) {
            if (this.phase === 1) {
                this.boss.x = 400 + Math.sin(time / 500) * 200;
            } else if (this.phase === 2) {
                let t = time / 1000;
                this.boss.x = 400 + Math.cos(t) * 300;
                this.boss.y = 200 + Math.sin(2 * t) * 100;
            }
        }

        // Draw Health Bar
        this.hpBar.clear();
        this.hpBar.fillStyle(0x222222, 0.8);
        this.hpBar.fillRect(200, 60, 400, 12);
        this.hpBar.fillStyle(0xff0000, 1);
        let fillWidth = Math.max(0, (this.bossHP / this.maxHP) * 400);
        this.hpBar.fillRect(200, 60, fillWidth, 12);
    }
}