import { batchActions } from "redux-batched-actions";

import dispatch from "../utils/dispatch";
import getState from "../utils/getState";
import shuffle from "../../js/utils/shuffle";

import generateMap from "../map/generate";
import addPlayer from "./addPlayer";

import { selectAllPlayers } from "../../redux/game/session/players";
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

	// Shuffle player order
	const players = selectAllPlayers(getState());
	const turnOrder = shuffle(Object.keys(players));
	dispatch(playerTurnActions.setOrder(turnOrder));
}