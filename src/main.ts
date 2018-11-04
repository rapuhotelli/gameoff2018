import 'phaser'
import { HUD } from './scenes/HUD'
import { MainScene } from './scenes/mainScene'
// main game configuration
const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MainScene, HUD],
  backgroundColor: '#663399',
    // @ts-ignore
  audio: {
    disableWebAudio: true,
  },
   
}

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config)
  }
}

// when the page is loaded, create our game instance
new Game(config)
// */