import shortid from "shortid";
import { batchActions } from "redux-batched-actions";

import dispatch from "../utils/dispatch";
import getState from "../utils/getState";
import shuffle from "../../js/utils/shuffle";

import generateMap from "../map/generate";

import {
	selectAllPlayers,
	actions as playerActions
} from "../../redux/game/session/players";
import { actions as sharedPlayerActions } from "../../redux/game/player";
import { actions as tokenActions } from "../../redux/game/stage/tokens";
import { actions as playerTurnActions } from "../../redux/game/session/turn";

export default function () {
	// Generate map
	dispatch(batchActions(generateMap()));

	// Create a demo player

	// Read state tree
	let players = selectAllPlayers(getState());

	// Generate a player id
	let uniqueId;

	// Make sure id is unique and not yet taken
	do {
		uniqueId = shortid.generate();
	} while (uniqueId in players);

	dispatch(playerActions.add(uniqueId));

	// Generate player tokens
	players = selectAllPlayers(getState());

	Object.keys(players).forEach(id => {
		// Add token
		dispatch(tokenActions.add(id));

		// Move player to starting location
		dispatch(sharedPlayerActions.setPosition(id, "CORNER-BOTTOM"));
	});

	// Shuffle player order
	const turnOrder = shuffle(Object.keys(players));
	dispatch(playerTurnActions.setOrder(turnOrder));

	// Set active player
	dispatch(playerTurnActions.setActive(turnOrder[0]));
}