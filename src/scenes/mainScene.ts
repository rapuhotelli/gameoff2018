import 'phaser'

const minusEighth = (number: number) => number - number/8

export class MainScene extends Phaser.Scene {
    // private phaserSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: 'MainScene',
      active: true,
    })
  }

  preload(): void {
    this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png')
    this.load.image('gridSquare', 'assets/grid.png')
    this.load.image('levelGraphic', 'assets/map1-sketch.png')
  }

  create(): void {
    const levelGraphic = this.add.image(512, 384, 'levelGraphic')

    levelGraphic.displayHeight = levelGraphic.height - levelGraphic.height/8 // 640
    const GRID_WIDTH = 32
    const GRID_HEIGHT = 24 // 24

    const gridTileMap = []
    for (let y = 0; y < GRID_HEIGHT; y++) {
      gridTileMap[y] = Array(GRID_WIDTH).fill(0)
    }

    const map = this.make.tilemap({ data: gridTileMap, tileWidth: 32, tileHeight: 32 - (32/8) })
    const tiles = map.addTilesetImage('gridSquare')
    const layer = map.createStaticLayer(0, tiles, 0, levelGraphic.height/8/2)
  }
}