import 'phaser'
import LevelManager from '../objects/LevelManager'

import { createDebugger, sceneBridge } from '../utils'

export class MainScene extends Phaser.Scene {

  // private gridCursor: Phaser.GameObjects.Graphics
  private debugger: (message: string) => void


  constructor() {
    super({
      key: 'MainScene',
      active: true,
    })
    this.debugger = () => {console.warn('debugger unavailable'); return false}
    sceneBridge.connect(this, 'MainScene')
  }

  preload(): void {
    this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png')
    //this.load.image('gridSquare', 'assets/grid-wide.png')
    //this.load.image('levelGraphic', 'assets/map1-sketch.png')

    //Bard-M-01
  }

  public debug(text: string) {
    this.debugger(text)
  }

  create(): void {

    const GRID_WIDTH = 32
    const GRID_HEIGHT = 24 // 24

    /*
    const gridTileMap = []
    for (let y = 0; y < GRID_HEIGHT; y++) {
      gridTileMap[y] = Array(GRID_WIDTH).fill(0)
    }
    */

    // const gridTileMap = GameState.createGridTileMap()


    // this.scene.get('HUD')


    // console.log(this.input.activePointer.positionToCamera(this.cameras.main))

    this.debugger = createDebugger(true, this.add.text(50, 50, 'null'))

    const key = 'level0'
    const level = new LevelManager(key)
    this.scene.add(key, level, true)
    this.scene.bringToTop('MainScene')
  }

  update(): void {



  }
}

/*
const MainScene = createScene(MainSceneClass)
export { MainScene }
*/