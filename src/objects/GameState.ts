import { GRID_HEIGHT, GRID_WIDTH } from '../config'

export const createGridTileMap = (width = GRID_WIDTH, height = GRID_HEIGHT) => {
  const gridTileMap = []
  for (let y = 0; y < height; y++) {
    gridTileMap[y] = Array(width).fill(0)
  }
  return gridTileMap
}

const cell = [
  {
    type: 'pc',
    name: 'pc1',
  },
  {
    type: 'construct',
    name: 'derp',
  },
]

