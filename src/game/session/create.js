import { batchActions } from "redux-batched-actions";
import dispatch from "redux/dispatch";
import getState from "redux/getState";
import Deferred from "js/utils/deferred";
import shuffle from "js/utils/shuffle";
import generateMap from "game/map/generate";
import addPlayer from "./addPlayer";
import { selectAllPlayers } from "redux/game/session/players";
import { actions as playerTurnActions } from "redux/game/session/turn";
import { actions as tokenOrderActions } from "redux/game/stage/token/order";
import { waitStageDOMReady } from "game/session/stage";
import { init as setupCamera } from "game/camera";
import {
	GameStatus,
	actions as gameStatusActions
} from "redux/game/session/status";

export default function () {
	// TODO: Add start game button and remove this
	const game_init = new Deferred();

	// Set status
	dispatch(gameStatusActions.setStatus(GameStatus.INIT));

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
	dispatch(tokenOrderActions.setOrder(turnOrder));

	waitStageDOMReady()
		.then(setupCamera)
		.then(() => {
			// Set status
			dispatch(gameStatusActions.setStatus(GameStatus.PREGAME));

			// TODO: Add start game button and remove this
			game_init.resolve();
		});

	// This was added to chain command to start game automatically
	// This method should not actually be returning anything at all
	// Game should only be started after clicking a start game button
	// TODO: Add start game button and remove this
	return game_init.promise;
}
