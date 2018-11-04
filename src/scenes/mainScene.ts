import 'phaser'

export class MainScene extends Phaser.Scene {
    // private phaserSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: 'MainScene',
      active: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
        },
      },
    })
  }

  preload(): void {
    this.load.setBaseURL('http://labs.phaser.io')
    this.load.image('logo', 'assets/sprites/phaser3-logo.png')
  }

  create(): void {

    var logo = this.physics.add.image(400, 100, 'logo')

    logo.setVelocity(100, 200)
    logo.setBounce(1, 1)
    logo.setCollideWorldBounds(true)
  }
}