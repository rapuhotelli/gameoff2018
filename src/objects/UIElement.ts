import { PCM, PlayerCharacter } from './PlayerCharacter'

abstract class UIElement {
  onPress:
}

export function UIElementManager(scene: Phaser.Scene):PCM {
  let elementIndex = 0
  const elements: Array<UIElement> = []

  // ToDo add better options
  function newCharacter(UI) {
    elements[characterIndex] = new PlayerCharacter(scene, characterIndex++, options)
  }

  function preloadAll() {
    elements.map((pc: PlayerCharacter) => pc.preload())
  }

  function createAll(gridMap: Phaser.Tilemaps.Tilemap) {
    elements.map((pc: PlayerCharacter) => pc.create(gridMap))
  }

  function updateAll() {
    elements.map((pc: PlayerCharacter) => pc.update())
  }

  return {
    newCharacter,
    preloadAll,
    createAll,
    updateAll,
    characters,
  }
}