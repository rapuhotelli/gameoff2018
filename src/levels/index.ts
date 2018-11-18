import { GridPosition } from '../objects/UnitManager'
import * as level0 from './level0'

export interface IPlayerCharacterConfig {
  name: string
  speed: number
  spriteSheet: string
  maxHealth: number
  startingPosition: GridPosition
}
export interface ILevel {
  tileData: Array<number[]>,
  tileSet: string
  playerCharacters: Array<IPlayerCharacterConfig>
}

export { level0 }