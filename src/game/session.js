import generateMap from "./map/map-generator";

/**
 * Current active game session
 * @type {Object}
 * @public
 */
export let active = null;

/** Create new game session */
export function create() {
	active = {
		map: generateMap(),
	};
}

/** Destroy active game session */
export function destroy() {
	active = null;
}