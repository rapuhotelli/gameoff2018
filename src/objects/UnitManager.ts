
// ToDo: add character layer
import { getWorldCenterForTile } from '../utils'
import LevelManager from './LevelManager'

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
  private gridMap: Phaser.Tilemaps.Tilemap | null // reference to scene grid map (todo make own layer?)
  private targetPosition: Phaser.Tilemaps.Tile // position to end up at after movement
  private position: Phaser.Tilemaps.Tile // current game state position
  private unitSprite: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, characterIndex: number, options: Options) {
    this.scene = scene
    this.key = `pc${characterIndex}`
    this.options = options
  }

  preload() {
    this.scene.load.spritesheet(this.key, `assets/${this.options.spriteSheet}.png`, { frameWidth: 24, frameHeight: 32 })
  }

  create(gridMap: Phaser.Tilemaps.Tilemap) {
    this.gridMap = gridMap
    this.position = gridMap.getTileAt(this.options.startingPosition.x, this.options.startingPosition.y)
    this.targetPosition = gridMap.getTileAt(this.options.startingPosition.x, this.options.startingPosition.y)

    const positionInWorld = getWorldCenterForTile(this.position)
    this.unitSprite = this.scene.add.sprite(positionInWorld.x, positionInWorld.y, this.key)
  }

  update(time: number, delta: number) {
    const positionInWorld = getWorldCenterForTile(this.position)
    this.unitSprite.setPosition(positionInWorld.x, positionInWorld.y)

    const walkingFrame = Math.floor(time / 150) % 4
    const frame = walkingFrame === 3 ? 1 : walkingFrame
    this.unitSprite.setFrame(12 + frame)
  }

  getPosition() {
    return this.position
  }

  setDestination(position: GridPosition) {
    if (this.gridMap) {
      this.targetPosition = this.gridMap.getTileAt(position.x, position.y)
    }
  }

  move() {
    this.position = this.targetPosition
  }


}