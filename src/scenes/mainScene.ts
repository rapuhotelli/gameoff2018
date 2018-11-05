import 'phaser'

const minusEighth = (number: number) => number - number/8

export class MainScene extends Phaser.Scene {
    // private phaserSprite: Phaser.GameObjects.Sprite;
  private debugText: Phaser.GameObjects.Text
  private gridMap: Phaser.Tilemaps.Tilemap
  private cursorPosition: {x: number, y: number}
  private gridCursor: Phaser.GameObjects.Graphics

  constructor() {
    super({
      key: 'MainScene',
      active: true,
    })
    this.cursorPosition = {x: 0, y: 0}
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

    this.gridMap = this.make.tilemap({ data: gridTileMap, tileWidth: 32, tileHeight: 32 - (32/8) })
    const tiles = this.gridMap.addTilesetImage('gridSquare')
    const layer = this.gridMap.createStaticLayer(0, tiles, 0, levelGraphic.height/8/2)


    this.debugText = this.add.text(50, 50, 'null')
    console.log(this.input.activePointer.positionToCamera(this.cameras.main))

    this.gridCursor = this.add.graphics({ lineStyle: { width: 2, color: 0x000000, alpha: 1 } })
    this.gridCursor.strokeRect(0, 0, 32, 32 - (32/8))
    this.gridCursor.setPosition(0, 0)

  }
  update(): void {
    this.input.activePointer.positionToCamera(this.cameras.main, this.cursorPosition)
    // this.debugText.setText(`x:${this.cursorPosition.x} y:${this.cursorPosition.y}`)
    const cursorTile = this.gridMap.getTileAtWorldXY(this.cursorPosition.x, this.cursorPosition.y)

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
  }
}