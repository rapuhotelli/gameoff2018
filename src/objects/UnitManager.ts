
// ToDo: add character layer
import { CELL_HEIGHT, CELL_WIDTH } from '../config'
import { getWorldCenterForTile } from '../utils'

export interface IUnitMananager {
  newUnit: (options: Options) => void
  preloadAll: () => void
  createAll: (gridMap: Phaser.Tilemaps.Tilemap) => void
  updateAll: (time: number, delta: number) => void
  units: Array<Unit>
  move: () => void
}

export interface GridPosition {
  x: number,
  y: number,
}

interface Options {
  startingPosition: GridPosition
  spriteSheet: string
  // position: Phaser.Tilemaps.Tile
}


export function UnitManager(scene: Phaser.Scene):IUnitMananager {
  let characterIndex = 0
  const units: Array<Unit> = []

  // ToDo add better options
  function newUnit(options: Options) {
    units[characterIndex] = new Unit(scene, characterIndex++, options)
  }

  function preloadAll() {
    units.map((pc: Unit) => pc.preload())
  }

  function createAll(gridMap: Phaser.Tilemaps.Tilemap) {
    units.map((pc: Unit) => pc.create(gridMap))
  }

  function updateAll(time: number, delta: number) {
    units.map((pc: Unit) => pc.update(time, delta))
  }

  function move() {
    units.map((pc: Unit) => pc.move())
  }

  return {
    newUnit,
    preloadAll,
    createAll,
    updateAll,
    units,
    move,
  }
}

export class Unit {
  private scene: Phaser.Scene
  private readonly sheet: string
  private readonly key: string
  private options: Options
  private gridMap: Phaser.Tilemaps.Tilemap // reference to scene grid map (todo make own layer?)
  private targetPosition: Phaser.Tilemaps.Tile // position to end up at after movement
  private position: Phaser.Tilemaps.Tile // current game state position
  private unitSprite: Phaser.GameObjects.Sprite
  private selectionCircle: Phaser.GameObjects.Graphics | null

  private calculatedPath: Array<GridPosition>
  private pathIndicators: Phaser.GameObjects.Rectangle[]

  constructor(scene: Phaser.Scene, characterIndex: number, options: Options) {
    this.scene = scene
    this.key = `pc${characterIndex}`
    this.options = options
    this.pathIndicators = []
  }

  preload() {
    this.scene.load.spritesheet(this.key, `assets/${this.options.spriteSheet}.png`, { frameWidth: 24, frameHeight: 32 })
  }

  create(gridMap: Phaser.Tilemaps.Tilemap) {
    this.gridMap = gridMap
    this.position = gridMap.getTileAt(this.options.startingPosition.x, this.options.startingPosition.y)
    this.targetPosition = gridMap.getTileAt(this.options.startingPosition.x, this.options.startingPosition.y)

    const positionInWorld = getWorldCenterForTile(this.position)
    tee: grouppi hahmovalinnalle ja spritelle
    this.character = this.scene.add.group({ key: 'invader', frame: 0, repeat: 53 });
    this.unitSprite = this.scene.add.sprite(positionInWorld.x, positionInWorld.y-CELL_HEIGHT/2, this.key)
    .setDepth(1)

    this.scene.add.graphics({ lineStyle: { width: 1, color: 0x22ff00, alpha: 1 } })
    .strokeEllipse(positionInWorld.x, positionInWorld.y, CELL_WIDTH, CELL_HEIGHT , 16)
    .setDepth(0)
  }

  update(time: number, delta: number) {
    const positionInWorld = getWorldCenterForTile(this.position)
    this.unitSprite.setPosition(positionInWorld.x, positionInWorld.y-CELL_HEIGHT/2)

    const walkingFrame = Math.floor(time / 150) % 4
    const frame = walkingFrame === 3 ? 1 : walkingFrame
    this.unitSprite.setFrame(12 + frame)
  }


  getPosition() {
    return this.position
  }

  setDestination(position: GridPosition, calculatedPath: Array<GridPosition>) {
    if (this.gridMap) {
      this.targetPosition = this.gridMap.getTileAt(position.x, position.y)
    }
    if (!calculatedPath) {
      return
    }
    this.pathIndicators.map(pi => pi.destroy())
    this.pathIndicators = []
    this.pathIndicators = calculatedPath.map(p => {
      const tile = this.gridMap.getTileAt(p.x, p.y)
      return this.scene.add.rectangle(tile.getCenterX(), tile.getCenterY(), CELL_WIDTH, CELL_HEIGHT, 0x2222ee, 0.3)
    })
  }

  move() {
    this.position = this.targetPosition
  }


}