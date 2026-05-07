class BossBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Use a different frame (e.g., a green laser or heavy missile)
        super(scene, x, y, "space", "spaceMissiles_015.png"); 
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(1.5);
        this.setFlipY(true); // Points down
        
        // Tight AABB for boss projectiles
        this.body.setSize(this.width * 0.5, this.height * 0.8);
    }

    fire(x, y) {
        this.body.reset(x, y);
        this.setActive(true).setVisible(true);
        // Randomize speed slightly for a chaotic pattern
        this.setAngle(0);
        this.setVelocityY(Phaser.Math.Between(450, 600)); 
    }

    // Angled fire for the Phase 2 Circle Shot
    fireAtAngle(x, y, angle, speed) {
        this.body.reset(x, y);
        this.setActive(true).setVisible(true);
        this.setAngle(angle + 90); // Rotate sprite to face travel direction
        
        // Convert angle to velocity vector
        this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity);
    }

    update() {
        // Clean up bullets that leave the screen area
        if (this.y > 650 || this.y < -50 || this.x < -50 || this.x > 850) {
            this.setActive(false).setVisible(false);
        }
    }
}