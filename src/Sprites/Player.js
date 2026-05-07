class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "chars", "man.png");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(3.5);
        this.speed = 400;
        this.isInvincible = false;

        // Tight AABB for fair collisions
        this.body.setSize(this.width * 0.6, this.height * 0.8);
        this.body.setOffset(this.width * 0.2, this.height * 0.2);
    }

    update(keys) {
        if (!keys) return;

        // Support for both Arrows and A/D keys
        let left = (keys.left && keys.left.isDown) || (keys.a && keys.a.isDown);
        let right = (keys.right && keys.right.isDown) || (keys.d && keys.d.isDown);

        if (left) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
            // THE FIX: 'true' ensures the animation loops instead of restarting [cite: 3]
            this.play('walk', true); 
        } else if (right) {
            this.setVelocityX(this.speed);
            this.flipX = false;
            this.play('walk', true); 
        } else {
            this.setVelocityX(0);
            this.stop(); // Stops animation loop
            this.setFrame("man.png"); // Resets to standing pose
        }
        
        this.x = Phaser.Math.Clamp(this.x, 20, 780);
    }

    onHit() {
        if (this.isInvincible) return false;
        this.isInvincible = true;
        this.scene.tweens.add({
            targets: this,
            alpha: 0.2,
            duration: 100,
            yoyo: true,
            repeat: 8,
            onComplete: () => { this.isInvincible = false; this.alpha = 1; }
        });
        return true;
    }
}