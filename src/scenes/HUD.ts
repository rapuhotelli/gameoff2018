import 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../config'
import { EndTurnButton } from '../objects/Button'
import { sceneBridge } from '../utils'

export class HUD extends Phaser.Scene {
  
  private endTurnButton: EndTurnButton
  
  constructor() {
    super({
      key: 'HUD',
      active: true,
    })
  }

  create() {
    // this.add.text(100, 100, 'I am an UI scene!', {fill: '#ffffff'})
    
    this.endTurnButton = new EndTurnButton(this)
    this.endTurnButton.setOnPress(() => {
      sceneBridge.get('main').debugger('END TURN')
    })
    this.endTurnButton.create()
  }
  
  update() {
    this.endTurnButton.update()
  }
}