
// ToDo: add character layer
import { Unit } from './Unit'

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

  move(resolve: () => void): void {
    const movementPromises = this.units.map((unit: Unit) => {
      return unit.move()
    })
    Promise.all(movementPromises).then(() => resolve() )
  }

  getUnitAt(position: GridPosition) {
    return this.units.find(unit => {
      return unit.getPosition().x === position.x && unit.getPosition().y === position.y
    })
  }

  selectUnit(unit: Unit) {
    this.deselect()
    unit.setSelected(true)
  }
  
  deselect() {
    this.units.map((unit: Unit) => {
      unit.setSelected(false)
    })
  }
  
  getAttacks() {
    const attacks:any = []
    this.units.forEach((unit: Unit) => {
      // TODO get unit attack type and detect in different ways
      const vec = new Phaser.Math.Vector2(unit.getPosition().x, unit.getPosition().y)
      this.units.forEach((targetUnit: Unit) => {
        if (unit !== targetUnit) {
          if (vec.distance(new Phaser.Math.Vector2(targetUnit.getPosition().x, targetUnit.getPosition().y)) < 3) {
            attacks.push({from: unit.getPosition(), to: targetUnit.getPosition(), type: 'test'})
          }
        }
      })
    })
    return attacks
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

