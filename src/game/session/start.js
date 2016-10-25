import dispatch from "../utils/dispatch";

import { actions as playerSharedActions } from "../../redux/game/player";

import turnChange from "../rules/turn/change";
import getNextActivePlayer from "../rules/turn/getNextActivePlayer";

let gameEnded = false;

function gameLoop() {
	// Game over condition to stop loop
	if (gameEnded) { return; }

	// Loop
	const nextPlayerId = getNextActivePlayer();
	dispatch(playerSharedActions.setActive(nextPlayerId));
	turnChange().then(gameLoop);
}

export default function () {
	// Start game logic loop
	// Listen to dice button click etc...
	gameLoop();
}