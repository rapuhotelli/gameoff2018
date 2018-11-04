import 'phaser'
import { HUD } from './scenes/HUD'
import { MainScene } from './scenes/mainScene'
// main game configuration
const config: GameConfig = {
  width: 1024,
  height: 768,
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
function resize(game) {
  var canvas = document.querySelector('canvas')
  var windowWidth = window.innerWidth
  var windowHeight = window.innerHeight
  var windowRatio = windowWidth / windowHeight
  // @ts-ignore
  var gameRatio = game.config.width / game.config.height
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px'
    canvas.style.height = (windowWidth / gameRatio) + 'px'
  } else {
    canvas.style.width = (windowHeight * gameRatio) + 'px'
    canvas.style.height = windowHeight + 'px'
  }
}

window.onload = () => {
  const game = new Game(config)
  resize(game)
}
// */