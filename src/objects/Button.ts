import { GAME_HEIGHT, GAME_WIDTH, HEADER_FOOTER_HEIGHT } from '../config'

abstract class Button {
  onPress: () => void
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }
  
  abstract setOnPress(onPress:  () => void): void
  abstract create(): void
  abstract update(): void
}


export class EndTurnButton extends Button {
  private width: number
  private height: number
  
  constructor(scene: Phaser.Scene) {
    super(scene)
    this.width = 200
    this.height = HEADER_FOOTER_HEIGHT
  }
  
  setOnPress(onPress:  () => void): void {
    this.onPress = onPress
  }
  
  create(): void {
    
    const rect = this.scene.add.rectangle(
      GAME_WIDTH-(this.width/2),
      GAME_HEIGHT-(HEADER_FOOTER_HEIGHT/2),
      this.width,
      HEADER_FOOTER_HEIGHT, 
      0x993366)
      .setInteractive()
      .on('pointerup', () => {
        this.onPress()
      })
    
    
  }
  
  update() {
    
  }
}
