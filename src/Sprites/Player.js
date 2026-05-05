class Player extends Phaser.Physics.Arcade.Sprite 
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, "chars", "man.png");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(3.5);
        this.body.setSize(this.width * 0.6, this.height * 0.8);
        this.body.setOffset(this.width * 0.2, this.height * 0.2);

        this.speed = 400;
        this.isInvincible = false;
    }

    update(keys, delta) 
    {
        // 1D Movement
        if (keys.left.isDown || keys.a.isDown) 
        {
            this.setVelocityX(-this.speed);
            this.flipX = true;
            if (this.anims.currentAnim?.key !== 'walk') this.play('walk');
        } 
        else if (keys.right.isDown || keys.d.isDown) 
        {
            this.setVelocityX(this.speed);
            this.flipX = false;
            if (this.anims.currentAnim?.key !== 'walk') this.play('walk');
        } 
        else 
        {
            this.setVelocityX(0);
            this.stop();
            this.setFrame("man.png");
        }

        // FIX: Expanded the clamp so the player can reach the full edges of the 800px screen!
        this.x = Phaser.Math.Clamp(this.x, 20, 780);
    }

    onHit() 
    {
        if (this.isInvincible) return false;
        this.isInvincible = true;
        
        this.scene.tweens.add({
            targets: this,
            alpha: 0.2,
            duration: 100,
            yoyo: true,
            repeat: 8,
            onComplete: () => { 
                this.isInvincible = false; 
                this.alpha = 1; 
            }
        });
        
        return true;
    }
}