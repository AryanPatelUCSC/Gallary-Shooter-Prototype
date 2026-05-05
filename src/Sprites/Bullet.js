class Bullet extends Phaser.Physics.Arcade.Sprite 
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, "space", "spaceMissiles_001.png");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(this.width * 0.5, this.height * 0.8);
        this.body.setOffset(this.width * 0.25, this.height * 0.1);
    }

    fire(x, y) 
    {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityY(-600);
    }

    update() 
    {
        if (this.y < -50) 
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}