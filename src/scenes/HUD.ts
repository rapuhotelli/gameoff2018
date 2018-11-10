import 'phaser'
import { Button } from '../objects/Button'

export class HUD extends Phaser.Scene {
  
  private endTurnButton: Button
  
  constructor() {
    super({
      key: 'HUD',
      active: true,
    })
  }

  create = () => {
    console.log('creating hud!!')
    this.add.text(100, 100, 'I am an UI scene!', {fill: '#ffffff'})
    
    this.endTurnButton = new Button(this)
    this.endTurnButton.setOnPress(() => console.log('wooo'))
    this.endTurnButton.setPosition(100, 100)
  }
}