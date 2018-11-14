
// ToDo: add character layer
import { getWorldCenterForTile } from '../utils'
import LevelManager from './LevelManager'

export interface PCM {
  newCharacter: (options: Options) => void
  preloadAll: () => void
  createAll: (gridMap: Phaser.Tilemaps.Tilemap) => void
  updateAll: () => void
  characters: Array<PlayerCharacter>
  move: () => void
}

interface GridPosition {
  x: number,
  y: number,
}

interface Options {
  startingPosition: GridPosition
  spriteSheet: string
  // position: Phaser.Tilemaps.Tile
}


export function PCManager(scene: Phaser.Scene):PCM {
  let characterIndex = 0
  const characters: Array<PlayerCharacter> = []

  // ToDo add better options
  function newCharacter(options: Options) {
    characters[characterIndex] = new PlayerCharacter(scene, characterIndex++, options)
  }

  function preloadAll() {
    characters.map((pc: PlayerCharacter) => pc.preload())
  }

  function createAll(gridMap: Phaser.Tilemaps.Tilemap) {
    characters.map((pc: PlayerCharacter) => pc.create(gridMap))
  }

  function updateAll() {
    characters.map((pc: PlayerCharacter) => pc.update())
  }

  function move() {
    characters.map((pc: PlayerCharacter) => pc.move())
  }

  return {
    newCharacter,
    preloadAll,
    createAll,
    updateAll,
    characters,
    move,
  }
}

export class PlayerCharacter {
  private scene: Phaser.Scene
  private readonly sheet: string
  private readonly key: string
  private options: Options
  private gridMap: Phaser.Tilemaps.Tilemap | null // reference to scene grid map (todo make own layer?)
  private targetPosition: Phaser.Tilemaps.Tile // position to end up at after movement
  private position: Phaser.Tilemaps.Tile // current game state position
  private characterSprite: Phaser.GameObjects.Sprite

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
    this.characterSprite = this.scene.add.sprite(positionInWorld.x, positionInWorld.y, this.key)
  }

  update() {
    // tee coordinate mapper homma
    const positionInWorld = getWorldCenterForTile(this.position)
    this.characterSprite.setPosition(positionInWorld.x, positionInWorld.y)
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