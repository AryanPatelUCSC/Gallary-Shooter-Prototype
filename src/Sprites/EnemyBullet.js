class EnemyBullet extends Phaser.Physics.Arcade.Sprite 
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, "space", "spaceMissiles_002.png");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // Flips the texture vertically so the missile points downwards
        this.setFlipY(true);
        this.body.setSize(this.width * 0.5, this.height * 0.8);
        this.body.setOffset(this.width * 0.25, this.height * 0.1);
    }

    fire(x, y) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityY(400); // Shoots down at player
    }

    update() {
        if (this.y > 650) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}