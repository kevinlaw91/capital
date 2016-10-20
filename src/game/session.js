import shortid from "shortid";
import { batchActions } from "redux-batched-actions";

import dispatch from "./utils/dispatch";
import getState from "./utils/getState";

import { actions as playerActions } from "../redux/game/session/players";
import { actions as tokenActions } from "../redux/game/stage/tokens";

import generateMap from "./map/generate";

/**
 * Current active game session
 * @type {Object}
 * @public
 */
export let active = null;

/** Create new game session */
export function create() {
	// Generate map
	dispatch(batchActions(generateMap()));

	// Create a demo player

	// Retrieve state tree
	let state = getState();
	let players = state.game.session.players;

	// Generate a player id
	let uniqueId;

	// Make sure id is unique and not yet taken
	do {
		uniqueId = shortid.generate();
	} while (uniqueId in players);

	dispatch(playerActions.add(uniqueId));

	state = getState();
	players = state.game.session.players;

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