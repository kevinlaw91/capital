
/**
 * Current active game session
 * @type {Object}
 * @public
 */
export let active = null;

/** Create new game session */
export function create() {
}

/** Destroy active game session */
export function destroy() {
	active = null;
}