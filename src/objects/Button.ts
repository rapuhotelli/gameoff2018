

export class Button {
  private onPress: () => void
  private x: number
  private y: number
  
  constructor(scene: Phaser.Scene) {
    return this
  }
  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }
  
  setOnPress(onPress:  () => void): void {
    this.onPress = onPress
  }
  
  create() {
    
  }
  
  
}