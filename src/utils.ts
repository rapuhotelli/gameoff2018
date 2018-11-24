import { CELL_HEIGHT, CELL_WIDTH, GRID_HEIGHT, GRID_WIDTH } from './config'
import { DEBUG_MESSAGE, globalEventEmitter } from './objects/events'
import LevelManager from './objects/LevelManager'

export const getWorldCenterForTile = (tile: Phaser.Tilemaps.Tile) => {
  return {
    x: tile.getLeft() + CELL_WIDTH / 2,
    y: tile.getTop() + CELL_HEIGHT / 2,
  }
}

export const getSpriteCenterForTile = (sprite: Phaser.GameObjects.Sprite) => {
  const bounds = sprite.getBounds()
  return {
    x: bounds.x,
    y: bounds.y,
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

export const registerDebugger = (textField: Phaser.GameObjects.Text) => {
  const messages: string[] = []
  const messageLimit = 20
  globalEventEmitter.on(DEBUG_MESSAGE, (text: string) => {
    messages.push(text)
    if (messages.length > messageLimit) {
      messages.shift()
    }
    textField.setText(messages.join('\n'))
  })
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
