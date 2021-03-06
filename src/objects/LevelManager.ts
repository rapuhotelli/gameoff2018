import * as Easystar from 'easystarjs'
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  GAME_WIDTH,
  HEADER_FOOTER_HEIGHT,
  LEVEL_HEIGHT,
} from '../config'
import * as levelData from '../levels/'
import { enemyCharacters } from '../levels/level0'
import { debounce } from '../utils'
import { ActionPhase } from './ActionPhase'
import { BEGIN_ACTION_PHASE, debugLog, globalEventEmitter } from './events'
import { GridPosition, UnitManager } from './UnitManager'
import { AI } from '../levels/'

enum GamePhase {
  // Init phase?
  Plan,
  Act,
}

export default class LevelManager extends Phaser.Scene {

  private readonly key: string
  private gridMap: Phaser.Tilemaps.Tilemap
  private levelData: levelData.ILevel
  private gridCursor: Phaser.GameObjects.Graphics
  private clickTile: () => void
  private readonly cursorPosition: {x: number, y: number}
  private unitManager: UnitManager
  private gamePhase: GamePhase
  private selectedPlayer: number | null
  private numberKeys: Array<Phaser.Input.Keyboard.Key>
  private endTurnKey: Phaser.Input.Keyboard.Key
  
  private cursorHoverTile: Phaser.Tilemaps.Tile
  private selectedTileIndicator: Phaser.GameObjects.Rectangle | null
  private easystar: Easystar.js
  private pathIndicators: Phaser.GameObjects.Rectangle[]
  private calculatedPath: Array<GridPosition>

  private currentRound: number
  
  constructor(key: string) {
    super(key)
    this.key = key
    this.levelData = (<any>levelData)[this.key]
    this.cursorPosition = {x: 0, y: 0}

    this.unitManager = new UnitManager(this)

    // preload sprites used for this level
    this.levelData.playerCharacters.forEach(pc => {
      this.unitManager.newUnit(pc)
    })
    this.levelData.enemyCharacters.forEach(ec => {
      this.unitManager.newUnit(ec)
    })
    
    this.gamePhase = GamePhase.Plan
    globalEventEmitter.on(BEGIN_ACTION_PHASE, this.endTurn, this)
    
    this.easystar = new Easystar.js()
    this.pathIndicators = []
    this.currentRound = 0
  }
 
  preload() {
    this.load.image('gridSquare', 'assets/grid-wide.png')
    this.load.image('tileset', `assets/${this.levelData.tileSet}.png`)
    /*
    const uniqueMobSprites = Array.from([...new Set(this.levelData.enemyCharacters.map(item => item.spriteSheet))])
    uniqueMobSprites.forEach(spriteName => this.load.image(spriteName, `assets/${spriteName}.png`))
    */
    this.unitManager.preloadAll()
  }

  create() {
    this.easystar.setGrid(this.levelData.tileData)    
    this.easystar.setAcceptableTiles([0])
    this.easystar.enableDiagonals()
    this.easystar.enableSync()
    
    this.gridMap = this.make.tilemap({ data: this.levelData.tileData, tileWidth: CELL_WIDTH, tileHeight: CELL_HEIGHT})
    const tiles = this.gridMap.addTilesetImage('tileset', undefined, CELL_WIDTH, CELL_HEIGHT)
    const layer = this.gridMap.createStaticLayer(0, tiles, 0, HEADER_FOOTER_HEIGHT)

    this.gridCursor = this.add.graphics({ lineStyle: { width: 2, color: 0x000000, alpha: 1 } })
    this.gridCursor.strokeRect(0, 0, CELL_WIDTH, CELL_HEIGHT)
    this.gridCursor.setPosition(0, 0)
    
    /*
    const grid = this.add.grid(0, HEADER_FOOTER_HEIGHT, GAME_WIDTH, LEVEL_HEIGHT, CELL_WIDTH, CELL_HEIGHT, 0x000000, 0, 0x333333, 0.3)
    grid.setOrigin(0, 0)
    */

    this.selectedPlayer = null

    this.clickTile = debounce(() => {
      const sourceTileX = this.gridMap.worldToTileX(this.cursorPosition.x)
      const sourceTileY = this.gridMap.worldToTileY(this.cursorPosition.y)
      const clickedTile = this.gridMap.getTileAt(sourceTileX, sourceTileY)

      const position = {x: sourceTileX, y: sourceTileY}

      debugLog(`${sourceTileX} ${sourceTileY}`)
      this.data.set('selectedTile', position) // remove

      if (this.selectedTileIndicator) {
        this.selectedTileIndicator.destroy()
        this.selectedTileIndicator = null
      }

      const unitInTile = this.unitManager.getUnitAt(position)

      if (unitInTile && unitInTile.options.ai === AI.Player) {
        this.selectedPlayer = this.unitManager.units.indexOf(unitInTile)
        this.unitManager.selectUnit(unitInTile)
        // add
      } else {
        if (this.selectedPlayer !== null) {
          /*
          this.selectedTileIndicator = this.add.rectangle(
            clickedTile.getCenterX(),
            clickedTile.getCenterY(),
            CELL_WIDTH, CELL_HEIGHT,
            0x22ff00,
            0.6,
          )
          this.selectedTileIndicator.setFillStyle(0x22ff00, 0.6)
          */
          this.pathIndicators.map(pi => pi.destroy())
          this.pathIndicators = []
          this.unitManager.units[this.selectedPlayer].setDestination(position, this.calculatedPath)
          this.selectedPlayer = null
          this.unitManager.deselect()
        }
      }
    })

    this.unitManager.createAll(this.gridMap)

    this.numberKeys = [
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
    ]
    this.endTurnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    // this.doRound()
  }

  doRound() {
    const newMobs = this.levelData.enemyCharacters.filter(enemyCharacter => {
      return enemyCharacter.round === this.currentRound
    })
    console.log(newMobs)
    return
    if (newMobs) {
      newMobs.forEach(newMob => {
        this.unitManager.newUnit(newMob)
      })
    }
    // this.levelData.enemyW
  }
  
  cursorChangedTile(cursorTile: Phaser.Tilemaps.Tile) {
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
    

    if (this.cursorHoverTile !== cursorTile && this.selectedPlayer !== null) {
      this.cursorHoverTile = cursorTile
      console.log('tile changed')

      this.pathIndicators.map(pi => pi.destroy())
      this.pathIndicators = []
      
      if (cursorTile) {
        const charpos = this.unitManager.units[this.selectedPlayer].getPosition()
        this.easystar.findPath(charpos.x, charpos.y, cursorTile.x, cursorTile.y, (path) => {
          this.calculatedPath = path
          if (path) {
            path.shift()
            this.pathIndicators = path.map(p => {
              const tile = this.gridMap.getTileAt(p.x, p.y)
              return this.add.rectangle(tile.getCenterX(), tile.getCenterY(), CELL_WIDTH, CELL_HEIGHT, 0x22ff00, 0.3)
            })
          }
        })
        this.easystar.calculate()
      }
    }
  }
  
  update(time: number, delta: number) {
    this.input.activePointer.positionToCamera(this.cameras.main, this.cursorPosition)
    const cursorTile = this.gridMap.getTileAtWorldXY(this.cursorPosition.x, this.cursorPosition.y)
    
    this.cursorChangedTile(cursorTile)
    
    this.numberKeys.forEach((key, index) => {
      if (key.isDown) {
        // this.selectedPlayer = index // restore this later
      }
    })

    if (this.endTurnKey.isDown) {
      this.endTurn()
    }

    if (this.input.manager.activePointer.isDown && cursorTile) {
      this.clickTile()
    }
    

    if (this.gamePhase === GamePhase.Act) {
      this.gridCursor.setVisible(false)
    }

    this.unitManager.updateAll(time, delta)
  }

  endTurn() {
    if (this.gamePhase !== GamePhase.Plan) {
      return
    }

    this.gamePhase = GamePhase.Act

    const moves = this.unitManager.getRoundMoveCount()
    
    debugLog(`Starting ActionPhase`)
    debugLog(`Moves: ${moves}`)

    const onComplete = () => {
      this.gamePhase = GamePhase.Plan
      // re-enable all selections, re-draw grid etc etc
    }
    // Go!
    const phase = new ActionPhase(moves, this.unitManager, onComplete)

    // TODO move phase after real act phase things are done

    setTimeout(() => {
      // this.unitManager.step()
      this.gamePhase = GamePhase.Plan
    }, 500)

  }
}
