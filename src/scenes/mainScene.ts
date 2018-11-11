import 'phaser'
import { GRID_HEIGHT, GRID_WIDTH, LEVEL_HEIGHT } from '../config'
import * as GameState from '../objects/GameState'
import { PCM, PCManager, PlayerCharacter } from '../objects/PlayerCharacter'
import { createDebugger, createScene, debounce, sceneBridge } from '../utils'

class MainSceneClass extends Phaser.Scene {
    // private phaserSprite: Phaser.GameObjects.Sprite;
  // private debugText: Phaser.GameObjects.Text
  private gridMap: Phaser.Tilemaps.Tilemap
  private cursorPosition: {x: number, y: number}
  private gridCursor: Phaser.GameObjects.Graphics
  private playerCharacters: PCM
  private debugger: (message: string) => void
  private clickTile: () => void

  constructor() {
    super({
      key: 'MainScene',
      active: true,
    })
    this.cursorPosition = {x: 0, y: 0}
    this.playerCharacters = PCManager(this)
    this.playerCharacters.newCharacter( {
      spriteSheet: 'Bard-M-01',
      startingPosition: {x: 20, y: 16},
    })
    sceneBridge.connect(this, 'MainScene')
  }

  preload(): void {
    this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png')
    this.load.image('gridSquare', 'assets/grid-wide.png')
    this.load.image('levelGraphic', 'assets/map1-sketch.png')

    //Bard-M-01
    this.playerCharacters.preloadAll()
  }

  create(): void {
    const levelGraphic = this.add.image(512, 384, 'levelGraphic')
    // levelGraphic.displayHeight = levelGraphic.height - levelGraphic.height/8 // 640
    levelGraphic.displayHeight = LEVEL_HEIGHT
    const GRID_WIDTH = 32
    const GRID_HEIGHT = 24 // 24

    /*
    const gridTileMap = []
    for (let y = 0; y < GRID_HEIGHT; y++) {
      gridTileMap[y] = Array(GRID_WIDTH).fill(0)
    }
    */

    const gridTileMap = GameState.createGridTileMap()

    this.gridMap = this.make.tilemap({ data: gridTileMap, tileWidth: 32, tileHeight: 28 })
    const tiles = this.gridMap.addTilesetImage('gridSquare')
    const layer = this.gridMap.createStaticLayer(0, tiles, 0, levelGraphic.height/8/2)


    // this.debugText =
    this.debugger = createDebugger(true, this.add.text(50, 50, 'null'))

    // console.log(this.input.activePointer.positionToCamera(this.cameras.main))

    this.gridCursor = this.add.graphics({ lineStyle: { width: 2, color: 0x000000, alpha: 1 } })
    this.gridCursor.strokeRect(0, 0, 32, 28)
    this.gridCursor.setPosition(0, 0)

    this.playerCharacters.createAll(this.gridMap)

    this.clickTile = debounce(() => {
      const sourceTileX = this.gridMap.worldToTileX(this.cursorPosition.x)
      const sourceTileY = this.gridMap.worldToTileY(this.cursorPosition.y)
      // Clicks inside grid
      this.debugger(`${sourceTileX} ${sourceTileY}`)
      this.data.set('selectedTile', {x: sourceTileX, y: sourceTileY})
    })
  }

  update(): void {
    this.input.activePointer.positionToCamera(this.cameras.main, this.cursorPosition)
    // this.debugText.setText(`x:${this.cursorPosition.x}\n y:${this.cursorPosition.y}`)
    const cursorTile = this.gridMap.getTileAtWorldXY(this.cursorPosition.x, this.cursorPosition.y)

    if (this.input.manager.activePointer.isDown && cursorTile) {
      this.clickTile()
    }

    if (cursorTile) {
      if (!this.gridCursor.visible) {
        this.gridCursor.setVisible(true)
      }
      this.gridCursor.setPosition(cursorTile.getLeft(), cursorTile.getTop())
    } else {
      if (this.gridCursor.visible) {
        this.gridCursor.setVisible(false)
      }
    }

    this.playerCharacters.updateAll()

  }
}

const MainScene = createScene(MainSceneClass)
export { MainScene }
