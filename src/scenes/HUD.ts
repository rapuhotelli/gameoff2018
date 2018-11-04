export class HUD extends Phaser.Scene {
  constructor() {
    super({
      key: 'HUD',
    })
  }

  create = () => {
    console.log('creating hud!!')
    this.add.text(100, 100, 'woooo', {fill: '#ffffff'})
  }
}