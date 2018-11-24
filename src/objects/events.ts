export const DEBUG_MESSAGE = 'events/debugMessage'
export const BEGIN_ACTION_PHASE = 'events/beginActionPhase'

export const globalEventEmitter = new Phaser.Events.EventEmitter()

export const debugLog = (text: string) => globalEventEmitter.emit(DEBUG_MESSAGE, text)

export const beginActionPhase = () => globalEventEmitter.emit(BEGIN_ACTION_PHASE)

