import dispatch from "./utils/dispatch";
import getState from "./utils/getState";

import { actions as mapActions } from "../redux/game/session/map";
import { actions as playerActions } from "../redux/game/session/players";
import { actions as tokenActions } from "../redux/game/stage/tokens";

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

	// Retrieve state tree
	const state = getState();
	const players = state.game.session.players;

	// Generate player tokens
	Object.keys(players).forEach(id => {
		// Add token
		dispatch(tokenActions.add(id));

		// Move tokens to starting location
		dispatch(tokenActions.setPosition(id, players[id].position));
	});
}

/** Destroy active game session */
export function destroy() {
	active = null;
}