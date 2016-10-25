import getState from "../utils/getState";
import dispatch from "../utils/dispatch";

import { actions as playerTurnActions } from "../../redux/game/session/turn";
import { selectTurnOrder } from "../../redux/game/session/turn";

import turnChange from "../rules/turn/change";

let gameEnded = false;

function gameLoop() {
	// Game over condition to stop loop
	if (gameEnded) { return; }

	// Loop
	turnChange().then(gameLoop);
}

export default function () {
	// Set active player
	const turnOrder = selectTurnOrder(getState());
	dispatch(playerTurnActions.setActive(turnOrder[0]));

	// Start game logic loop
	// Listen to dice button click etc...
	gameLoop();
}