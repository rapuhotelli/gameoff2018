import { UnitManager } from './UnitManager'

enum Actions {
  Movement,
  Attack,
}

export class ActionPhase {
  private currentMove: number
  private moves: number
  private unitManager: UnitManager
  private onComplete: () => void

  constructor(moves: number, unitManager: UnitManager, onComplete: () => void) {
    this.unitManager = unitManager
    this.onComplete = onComplete
    this.moves = moves
    this.currentMove = 0
    this.nextAction()
  }

  begin() {

  }

  nextAction() {
    if (this.currentMove === this.moves) {
      return this.onComplete()
    }
    
    this.doMovementAction()
      .then(() => {
        console.log('doMovementAction done')
        /*
        this.doAttackAction().then(() => {
          this.currentMove++
          this.nextAction()
        })
        */
      })
  }

  doMovementAction(): Promise<void> {
    console.log('doMovementAction')
    return new Promise(resolve => {
      this.unitManager.move(resolve) // then attackAction
    })
  }

  doAttackAction() {
    // const attacks = this.unitManager.getAttacks() // [0] = first attack (who attacks which tile), [1] = second attack..
    // attacks promise chain until all attacks are exhausted ?
  }
}