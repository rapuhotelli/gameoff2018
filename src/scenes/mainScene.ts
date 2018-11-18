import 'phaser'
import LevelManager from '../objects/LevelManager'

import { sceneBridge } from '../utils'

export class MainScene extends Phaser.Scene {

  // private gridCursor: Phaser.GameObjects.Graphics
  private debugger: (message: string) => void


  constructor() {
    super({
      key: 'MainScene',
      active: true,
    })
    sceneBridge.connect(this, 'MainScene')
  }

  preload(): void {
    this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png')
    //this.load.image('gridSquare', 'assets/grid-wide.png')
    //this.load.image('levelGraphic', 'assets/map1-sketch.png')

    //Bard-M-01
  }

  create(): void {
    
    const key = 'level0'
    const level = new LevelManager(key)
    this.scene.add(key, level, true)
    level.scene.moveBelow('HUD', key)
    // this.scene.bringToTop('MainScene')
  }

  update(): void {



  }
}
