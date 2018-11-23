import { UnitManager } from './UnitManager'

enum Actions {
  Movement,
  Attack,
}

export class ActionPhase {
  private sequenceIndex: number
  private unitManager: UnitManager
  private sequence: Actions[]
  private onComplete: () => void

  constructor(steps: number, unitManager: UnitManager, onComplete: () => void) {
    this.unitManager = unitManager
    this.onComplete = onComplete
    this.sequenceIndex = 0
    this.sequence = []
    for (let i = 0; i < steps; i++) {
      this.sequence.push(Actions.Movement, Actions.Attack)
    }
    this.nextAction()
  }

  begin() {

  }

  nextAction() {
    if (this.sequenceIndex === this.sequence.length * 2) {
      return this.onComplete()
    }

    ei näin, peräkkäin vain move ja action
    switch (this.sequence[this.sequenceIndex++]) {
      case Actions.Movement:
        this.doMovementAction()
        break
      case Actions.Attack:
        this.doAttackAction()
        break
    }
  }

  doMovementAction() {
    console.log('doMovementAction')
    this.unitManager.move() then attackAction

  }

  doAttackAction() {
    const attacks = this.unitManager.getAttacks() // [0] = first attack (who attacks which tile), [1] = second attack..
    attacks promise chain until all attacks are exhausted ?

  }
}