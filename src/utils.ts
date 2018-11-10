import { GRID_HEIGHT, GRID_WIDTH } from './config'

export const getWorldCenterForTile = (tile: Phaser.Tilemaps.Tile) => {
  return {
    x: tile.getLeft() + GRID_WIDTH / 2,
    y: tile.getTop() + GRID_HEIGHT / 2,
  }
}