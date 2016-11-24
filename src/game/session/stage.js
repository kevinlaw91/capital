/**
 * Active instance of Stage object
 * @type {?Stage}
 */
let stage = null;

/** Get Stage instance */
export const getStageInstance = () => stage;

/** Register Stage instance */
export function register(stageInstance) {
	stage = stageInstance;
}

/** Unregister Stage instance */
export function unregister() {
	stage = null;
}