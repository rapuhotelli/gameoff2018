import 'phaser'
// main game configuration
import { CELL_HEIGHT, CELL_WIDTH, GAME_HEIGHT, GAME_WIDTH, GRID_HEIGHT, GRID_WIDTH } from './config'
import { HUD } from './scenes/HUD'
import { MainScene } from './scenes/mainScene'

console.log('GAME SIZE', GAME_WIDTH, GAME_HEIGHT)
console.log('GRID SIZE', GRID_WIDTH, GRID_HEIGHT)
console.log('CELL SIZE', CELL_WIDTH, CELL_HEIGHT)

const config: GameConfig = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MainScene, HUD],
  // @ts-ignore
  zoom: 2,
  // @ts-ignore
  pixelArt: true,
  // @ts-ignore
  audio: {
    disableWebAudio: true,
  },
  backgroundColor: '#663399',
}

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config)
  }
}

// when the page is loaded, create our game instance
/*
function resize(game) {
  const canvas = document.querySelector('canvas')
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const windowRatio = windowWidth / windowHeight
  // @ts-ignore
  const gameRatio = game.config.width / game.config.height
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px'
    canvas.style.height = (windowWidth / gameRatio) + 'px'
  } else {
    canvas.style.width = (windowHeight * gameRatio) + 'px'
    canvas.style.height = windowHeight + 'px'
  }
}
*/
window.onload = () => {
  const game = new Game(config)
  // @ts-ignore
  game.canvas.style.width = (game.config.width * game.config.zoom).toString() + 'px'
  // @ts-ignore
  game.canvas.style.height = (game.config.height * game.config.zoom).toString() + 'px'
  // resize(game)
}
// */