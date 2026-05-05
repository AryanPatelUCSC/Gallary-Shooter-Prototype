"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [Load, Intro, GalleryShooter, GameOver]
}

const game = new Phaser.Game(config);