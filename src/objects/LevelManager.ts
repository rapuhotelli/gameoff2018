import { LEVEL_HEIGHT } from '../config'
import * as levelData from '../levels/'
import { PCM, PCManager, PlayerCharacter } from '../objects/PlayerCharacter'
import { debounce } from '../utils'
import { sceneBridge } from '../utils'

export default class LevelManager extends Phaser.Scene {

  private key: string
  private gridMap: Phaser.Tilemaps.Tilemap
  private levelData: levelData.ILevel
  private gridCursor: Phaser.GameObjects.Graphics
  private clickTile: () => void
  private cursorPosition: {x: number, y: number}
  private playerCharacters: PCM

  constructor(key: string) {
    super(key)
    this.key = key
    this.levelData = (<any>levelData)[this.key]
    this.cursorPosition = {x: 0, y: 0}

    // level specific ?
    this.playerCharacters = PCManager(this)
    this.playerCharacters.newCharacter( {
      spriteSheet: 'Bard-M-01',
      startingPosition: {x: 20, y: 16},
    })
  }

  /*
  getLevelData() {
    return (<any>levelData)[this.key]
  }
  */

  preload() {
    this.load.image('levelGraphic', 'assets/map1-sketch.png')
    this.load.image('gridSquare', 'assets/grid-wide.png')
    this.playerCharacters.preloadAll()
  }

  create() {
    // TODO
    const levelGraphic = this.add.image(512, 384, 'levelGraphic')
    // levelGraphic.displayHeight = levelGraphic.height - levelGraphic.height/8 // 640
    levelGraphic.displayHeight = LEVEL_HEIGHT

    console.log(this.levelData)

    this.gridMap = this.make.tilemap({ data: this.levelData.tileData, tileWidth: 32, tileHeight: 28 })
    const tiles = this.gridMap.addTilesetImage('gridSquare')
    const layer = this.gridMap.createStaticLayer(0, tiles, 0, levelGraphic.height/8/2)

    this.gridCursor = this.add.graphics({ lineStyle: { width: 2, color: 0x000000, alpha: 1 } })
    this.gridCursor.strokeRect(0, 0, 32, 28)
    this.gridCursor.setPosition(0, 0)

    this.clickTile = debounce(() => {
      const sourceTileX = this.gridMap.worldToTileX(this.cursorPosition.x)
      const sourceTileY = this.gridMap.worldToTileY(this.cursorPosition.y)
      // Clicks inside grid

      // this.scene.get('MainScene').debugger(`${sourceTileX} ${sourceTileY}`)
      sceneBridge.get('MainScene').debugger(`${sourceTileX} ${sourceTileY}`)
      this.data.set('selectedTile', {x: sourceTileX, y: sourceTileY})
    })

    this.playerCharacters.createAll(this.gridMap)

  }

  update() {
    this.input.activePointer.positionToCamera(this.cameras.main, this.cursorPosition)
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
