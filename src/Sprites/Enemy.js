class Enemy extends Phaser.GameObjects.PathFollower 
{
    constructor(scene, x, y, texture, frame, points, bulletGroup) 
    {
        super(scene, null, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(0.5);
        this.body.setSize(this.width * 0.7, this.height * 0.7);
        this.body.setOffset(this.width * 0.15, this.height * 0.15);

        this.points = points;
        this.bulletGroup = bulletGroup;

        // Set a random firing interval (between 2 and 5 seconds)
        this.fireTimer = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000),
            callback: this.shoot,
            callbackScope: this,
            loop: true
        });
        
        // Ensure the enemy is destroyed along with its timer
        this.on('destroy', () => {
            if (this.fireTimer) this.fireTimer.remove();
        });
    }

    shoot() 
    {
        if (!this.active) return;

        // Get a bullet from the group and fire it
        let bullet = this.bulletGroup.get();
        if (bullet) {
            bullet.fire(this.x, this.y + 20);
            // Optional: play a subtle sound if available
        }
    }

    startDive(path) 
    {
        this.setPath(path);
        this.startFollow({
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}