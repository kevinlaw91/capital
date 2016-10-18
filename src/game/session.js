import dispatch from "./utils/dispatch";
import { actions as mapActions } from "../redux/game/session/map";
import { actions as playerActions } from "../redux/game/session/players";

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

	// Create a demo player
	dispatch(playerActions.add());
}

/** Destroy active game session */
export function destroy() {
	active = null;
}