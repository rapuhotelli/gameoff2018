import { CELL_HEIGHT, CELL_WIDTH } from '../config'
import { getWorldCenterForTile } from '../utils'
import { GridPosition, IUnitOptions } from './UnitManager'

export class Unit {
  private scene: Phaser.Scene
  private readonly sheet: string
  private readonly key: string
  private options: IUnitOptions
  private gridMap: Phaser.Tilemaps.Tilemap // reference to scene grid map (todo make own layer?)
  private targetPosition: Phaser.Tilemaps.Tile // position to end up at after movement
  private position: Phaser.Tilemaps.Tile // current game state position

  private unitSprite: Phaser.GameObjects.Sprite
  private selectionCircle: Phaser.GameObjects.Graphics | null
  private unitContainer: Phaser.GameObjects.Container
  private isSelected: boolean

  private calculatedPath: Array<GridPosition>
  private pathIndicators: Phaser.GameObjects.Rectangle[]

  constructor(scene: Phaser.Scene, characterIndex: number, options: IUnitOptions) {
    this.scene = scene
    this.key = `pc${characterIndex}`
    this.options = options
    this.pathIndicators = []
    this.selectionCircle = null
  }

  preload() {
    this.scene.load.spritesheet(this.key, `assets/${this.options.spriteSheet}.png`, { frameWidth: 24, frameHeight: 32 })
  }

  create(gridMap: Phaser.Tilemaps.Tilemap) {
    this.gridMap = gridMap
    this.position = gridMap.getTileAt(this.options.startingPosition.x, this.options.startingPosition.y)
    this.targetPosition = gridMap.getTileAt(this.options.startingPosition.x, this.options.startingPosition.y)

    const positionInWorld = getWorldCenterForTile(this.position)
    // tee: grouppi hahmovalinnalle ja spritelle
    // this.character = this.scene.add.group({ key: 'invader', frame: 0, repeat: 53 });
    this.unitSprite = this.scene.add.sprite(0, -CELL_HEIGHT/2, this.key).setDepth(1)

    this.unitContainer = this.scene.add.container(positionInWorld.x, positionInWorld.y)
    this.unitContainer.add(this.unitSprite)
  }

  update(time: number, delta: number) {
    const positionInWorld = getWorldCenterForTile(this.position)
    this.unitContainer.setPosition(positionInWorld.x, positionInWorld.y)


    const walkingFrame = Math.floor(time / 150) % 4
    const frame = walkingFrame === 3 ? 1 : walkingFrame
    this.unitSprite.setFrame(12 + frame)
  }

  setSelected(select: boolean) {
    if (select) {
      this.selectionCircle = this.scene.add.graphics({lineStyle: {width: 1, color: 0x22ff00, alpha: 1}})
      .strokeEllipse(0, 0, CELL_WIDTH, CELL_HEIGHT, 16)
      .setDepth(0)
      this.unitContainer.add(this.selectionCircle)
    } else {
      if (this.selectionCircle) {
        this.unitContainer.remove(this.selectionCircle, true)
      }
      this.selectionCircle = null
    }
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