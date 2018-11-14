import 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, HEADER_FOOTER_HEIGHT } from '../config'
import { EndTurnButton } from '../objects/Button'
import { createDebugger, sceneBridge } from '../utils'

export class HUD extends Phaser.Scene {
  
  private endTurnButton: EndTurnButton
  private mainScene: Phaser.Scene
  private debugger: (message: string) => void

  constructor() {
    super({
      key: 'HUD',
      active: true,
    })
    this.debugger = () => { console.warn('debugger unavailable'); return false }
    sceneBridge.connect(this, 'HUD')
  }

  public debug(text: string) {
    this.debugger(text)
  }

  private createButton(position: number, color: number) {
    const rect = this.add.rectangle(
      HEADER_FOOTER_HEIGHT * 3 * position,
      GAME_HEIGHT - HEADER_FOOTER_HEIGHT,
      HEADER_FOOTER_HEIGHT * 3,
      HEADER_FOOTER_HEIGHT,
      color,
    )
      .setOrigin(0, 0)
      .setInteractive()

    rect.on('pointerover', (e: any) => {
      rect.setFillStyle(0x999999)
    })

    rect.on('pointerout', (e: any) => {
      rect.setFillStyle(color)
    })
  }

  create() {
    // this.mainScene = sceneBridge.get('MainScene')

    this.debugger = createDebugger(true, this.add.text(50, 50, 'null'))

    this.endTurnButton = new EndTurnButton(this)
    this.endTurnButton.setOnPress(() => {
      sceneBridge.get('LevelManager').endTurn()
      this.debugger('END TURN')
    })
    this.endTurnButton.create()

    this.createButton(0, 0xdddddd)
    this.createButton(1, 0xcccccc)
    this.createButton(2, 0xbbbbbb)
    this.createButton(3, 0xaaaaaa)
  }
  
  update() {
    this.endTurnButton.update()
  }
}