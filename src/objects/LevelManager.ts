import { HEADER_FOOTER_HEIGHT, LEVEL_HEIGHT } from '../config'
import * as levelData from '../levels/'
import { PCM, PCManager, PlayerCharacter } from '../objects/PlayerCharacter'
import { debounce } from '../utils'
import { sceneBridge } from '../utils'

enum GamePhase {
  // Init phase?
  Plan,
  Act,
}

export default class LevelManager extends Phaser.Scene {

  private key: string
  private gridMap: Phaser.Tilemaps.Tilemap
  private levelData: levelData.ILevel
  private gridCursor: Phaser.GameObjects.Graphics
  private clickTile: () => void
  private cursorPosition: {x: number, y: number}
  private playerCharacters: PCM
  private gamePhase: GamePhase
  private selectedPlayer: integer
  private numberKeys: Array<Phaser.Input.Keyboard.Key>

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
    this.playerCharacters.newCharacter( {
      spriteSheet: 'Bard-M-01',
      startingPosition: {x: 21, y: 16},
    })
    this.playerCharacters.newCharacter( {
      spriteSheet: 'Bard-M-01',
      startingPosition: {x: 22, y: 16},
    })
    this.playerCharacters.newCharacter( {
      spriteSheet: 'Bard-M-01',
      startingPosition: {x: 23, y: 16},
    })

    this.gamePhase = GamePhase.Plan

    sceneBridge.connect(this, 'LevelManager')
  }

  /*
  getLevelData() {
    return (<any>levelData)[this.key]
  }
  */

  preload() {
    // this.load.image('levelGraphic', 'assets/map1-sketch.png')
    this.load.image('gridSquare', 'assets/grid-wide.png')
    this.load.image('tileset', `assets/${this.levelData.tileSet}.png`)
    this.playerCharacters.preloadAll()
  }

  create() {
    // TODO
    // const levelGraphic = this.add.image(512, 384, 'levelGraphic')
    // levelGraphic.displayHeight = levelGraphic.height - levelGraphic.height/8 // 640
    // levelGraphic.displayHeight = LEVEL_HEIGHT

    console.log(this.levelData)

    this.gridMap = this.make.tilemap({ data: this.levelData.tileData, tileWidth: 32, tileHeight: 28 })
    const tiles = this.gridMap.addTilesetImage('tileset')
    const layer = this.gridMap.createStaticLayer(0, tiles, 0, HEADER_FOOTER_HEIGHT)

    this.gridCursor = this.add.graphics({ lineStyle: { width: 2, color: 0x000000, alpha: 1 } })
    this.gridCursor.strokeRect(0, 0, 32, 28)
    this.gridCursor.setPosition(0, 0)

    this.selectedPlayer = 0

    this.clickTile = debounce(() => {
      const sourceTileX = this.gridMap.worldToTileX(this.cursorPosition.x)
      const sourceTileY = this.gridMap.worldToTileY(this.cursorPosition.y)
      const position = {x: sourceTileX, y: sourceTileY}
      // Clicks inside grid

      // this.scene.get('MainScene').debugger(`${sourceTileX} ${sourceTileY}`)
      sceneBridge.get('MainScene').debugger(`${sourceTileX} ${sourceTileY}`)
      this.data.set('selectedTile', position)

      const characterInTile = this.playerCharacters.characters.find(character => character.getPosition().x === position.x && character.getPosition().y === position.y)
      if (characterInTile) {
        this.selectedPlayer = this.playerCharacters.characters.indexOf(characterInTile)
      } else {
        this.playerCharacters.characters[this.selectedPlayer].setDestination(position)
      }
    })

    this.playerCharacters.createAll(this.gridMap)

    this.numberKeys = [
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
    ]
  }

  update() {
    this.input.activePointer.positionToCamera(this.cameras.main, this.cursorPosition)
    const cursorTile = this.gridMap.getTileAtWorldXY(this.cursorPosition.x, this.cursorPosition.y)

    this.numberKeys.forEach((key, index) => {
      if (key.isDown) {
        this.selectedPlayer = index
      }
    })

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

    if (this.gamePhase === GamePhase.Act) {
      this.gridCursor.setVisible(false)
    }

    this.playerCharacters.updateAll()

  }

  endTurn() {
    if (this.gamePhase !== GamePhase.Plan) {
      return
    }

    this.gamePhase = GamePhase.Act

    // TODO move phase after real act phase things are done
    setTimeout(() => {
      this.playerCharacters.move()
      this.gamePhase = GamePhase.Plan
    }, 500)
  }
}
