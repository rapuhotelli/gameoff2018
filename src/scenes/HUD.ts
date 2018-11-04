import 'phaser'

export class HUD extends Phaser.Scene {
  constructor() {
    super({
      key: 'HUD',
      active: true,
    })
  }

  create = () => {
    console.log('creating hud!!')
    this.add.text(100, 100, 'I am an UI scene!', {fill: '#ffffff'})
  }
}