import { CELL_HEIGHT, CELL_WIDTH, GRID_HEIGHT, GRID_WIDTH } from './config'

export const getWorldCenterForTile = (tile: Phaser.Tilemaps.Tile) => {
  return {
    x: tile.getLeft() + CELL_WIDTH / 2,
    y: tile.getTop() + CELL_HEIGHT / 2,
  }
}

export function createScene<T extends Phaser.Scene>(c: new () => T): T {
  return new c()
}

export const createDebugger = (enabled: boolean = false, textField: Phaser.GameObjects.Text) => {
  const messages: string[] = []
  const messageLimit = 20
  return function log(text: string) {
    if (!enabled) return
    messages.push(text)
    if (messages.length > messageLimit) {
      messages.shift()
    }
    textField.setText(messages.join('\n'))
  }
}

export function debounce(func: any, wait: number = 200, immediate: boolean = true) {
  let timeout: number | undefined
  return function() {
    // @ts-ignore
    const context = this
    const args = arguments
    const later = function() {
      timeout = undefined
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}


interface ISceneList {
  [name: string]: any // extends Phaser.Scene
}
const scenes: ISceneList = {}

export const sceneBridge = {
  connect: function<T extends Phaser.Scene>(scene: T, name: string) {
    console.log('Connecting ', name)
    scenes[name] = scene
  },
  get(name: string) {
    return scenes[name]
  },
}

const TurnManager = (options: any) => {
  let turn = 0


}