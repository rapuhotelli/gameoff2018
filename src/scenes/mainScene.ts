import 'phaser'
import LevelManager from '../objects/LevelManager'


export class MainScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'MainScene',
      active: true,
    })
  }

  preload(): void {
    this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png')
  }

  create(): void {
    
    const key = 'level0'
    const level = new LevelManager(key)
    this.scene.add(key, level, true)
    level.scene.moveBelow('HUD', key)
  }

  update(): void {



  }
}
