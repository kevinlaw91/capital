import dispatch from "./utils/dispatch";
import { actions as mapActions } from "../redux/game/session/map";

/**
 * Current active game session
 * @type {Object}
 * @public
 */
export let active = null;

/** Create new game session */
export function create() {
	// Generate map
	dispatch(mapActions.generate());
}

/** Destroy active game session */
export function destroy() {
	active = null;
}