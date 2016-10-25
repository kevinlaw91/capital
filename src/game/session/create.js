import { batchActions } from "redux-batched-actions";

import dispatch from "../utils/dispatch";
import getState from "../utils/getState";
import shuffle from "../../js/utils/shuffle";

import generateMap from "../map/generate";
import addPlayer from "./addPlayer";

import { selectAllPlayers } from "../../redux/game/session/players";
import { actions as sharedPlayerActions } from "../../redux/game/player";
import { actions as tokenActions } from "../../redux/game/stage/tokens";
import { actions as playerTurnActions } from "../../redux/game/session/turn";

export default function () {
	// Generate map
	dispatch(batchActions(generateMap()));

	// Create players
	const playerCount = 4;
	let playerColors = shuffle([
		"black",
		"blue",
		"brown",
		"green",
		"pink",
		"purple",
		"red",
		"yellow",
	]);
	for (let idx = 0; idx < playerCount; idx++) {
		addPlayer({
			color: playerColors[idx],
		});
	}

	// Generate player tokens
	const players = selectAllPlayers(getState());

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