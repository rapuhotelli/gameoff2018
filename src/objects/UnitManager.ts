
// ToDo: add character layer
import { CELL_HEIGHT, CELL_WIDTH } from '../config'
import { getWorldCenterForTile } from '../utils'
import { Unit } from './Unit'
import Grid = Phaser.GameObjects.Grid

export interface IUnitManager {
  newUnit: (options: IUnitOptions) => void
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

export interface IUnitOptions {
  startingPosition: GridPosition
  spriteSheet: string
  // position: Phaser.Tilemaps.Tile
}

export class UnitManager {
  private characterIndex: number
  public units: Array<Unit>
  private scene: Phaser.Scene
  private isMoving: boolean

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.characterIndex = 0
    this.units = []
    this.isMoving = false
  }

  // ToDo add better options
  newUnit(options: IUnitOptions) {
    this.units[this.characterIndex] = new Unit(this.scene, this.characterIndex++, options)
  }

  preloadAll() {
    this.units.map((unit: Unit) => unit.preload())
  }

  createAll(gridMap: Phaser.Tilemaps.Tilemap) {
    this.units.map((unit: Unit) => unit.create(gridMap))
  }

  updateAll(time: number, delta: number) {
    this.units.map((unit: Unit) => unit.update(time, delta))
  }

  move() {
    this.units.map((unit: Unit) => unit.move())
  }

  getUnitAt(position: GridPosition) {
    return this.units.find(unit => {
      return unit.getPosition().x === position.x && unit.getPosition().y === position.y
    })
  }

  setSelectedUnit(selectUnit: Unit) {
    this.units.map((unit: Unit) => {
      unit.setSelected(false)
      // unit.getPosition().x === position.x && unit.getPosition().y === position.y
    })
    selectUnit.setSelected(true)
  }

  getRoundMoveCount() {
    let moves = 0
    this.units.forEach((unit: Unit) => {
      if (unit.calculatedPath.length > moves) {
        moves = unit.calculatedPath.length
      }
    })
    return moves
  }
}

