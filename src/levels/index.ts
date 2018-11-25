import { GridPosition } from '../objects/UnitManager'
import * as level0 from './level0'

export const enum AI {
  Player,
  Idiot,
}

export interface IPlayerCharacterConfig {
  ai: AI
  name: string
  speed: number
  spriteSheet: string
  maxHealth: number
  startingPosition: GridPosition
}

export interface IEnemyCharacterConfig extends IPlayerCharacterConfig {
  round: number
}

export interface ILevel {
  tileData: Array<number[]>,
  tileSet: string
  playerCharacters: Array<IPlayerCharacterConfig>
  enemyCharacters: Array<IEnemyCharacterConfig>
}

export { level0 }