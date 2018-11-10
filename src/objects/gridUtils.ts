import Tile = Phaser.Tilemaps.Tile

import { gridSize } from '../scenes/mainScene'

export function getWorldCenterForTile(tile: Tile) {
  return {
    x: tile.getLeft() + gridSize.width / 2,
    y: tile.getTop() + gridSize.height / 2,
  }
}

