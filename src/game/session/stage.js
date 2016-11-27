import Deferred from "js/utils/deferred";

/**
 * Active instance of Stage object
 * @type {?Stage}
 */
let stage = null;

/** Subscribe to ready event */
let isReady;

export function setAsReady() {
	isReady = isReady || new Deferred();
	isReady.resolve();
}

export function waitStageDOMReady() {
	isReady = isReady || new Deferred();

	return isReady.promise;
}

/**
 * Get Stage instance
 * @return {?Stage}
 */
export const getStageInstance = () => stage;

/** Register Stage instance */
export function register(stageInstance) {
	stage = stageInstance;
}

/** Unregister Stage instance */
export function unregister() {
	stage = null;
	isReady = null;
}
