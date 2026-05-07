// main.js
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { 
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [Load, Title, Intro, Controls, Credits, GalleryShooter, BossScene, GameOver]
};

let game = new Phaser.Game(config);