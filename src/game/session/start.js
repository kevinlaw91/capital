import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";
import { panToSubject } from "game/camera";
import { getStageInstance } from "game/session/stage";
import {
	GameStatus,
	actions as gameStatusActions
} from "redux/game/session/status";
import turnChange from "game/rules/turn/change";
import getNextActivePlayer from "game/rules/turn/getNextActivePlayer";

let gameEnded = false;

function gameLoop() {
	// Game over condition to stop loop
	if (gameEnded) { return; }

	// Loop
	const nextPlayerId = getNextActivePlayer();
	dispatch(playerActions.setActive(nextPlayerId));
	turnChange().then(gameLoop);
}

export default function () {
	// Set status
	dispatch(gameStatusActions.setStatus(GameStatus.ACTIVE));

	if (typeof APP_DEBUG !== "undefined") {
		// In dev build only
		require("game/dev");
	}

	// Pan to token of first player
	const firstPlayerId = getNextActivePlayer();
	const firstPlayerToken = getStageInstance().tokens.find(firstPlayerId);
	panToSubject(firstPlayerToken);

	// Start game logic loop
	// Listen to dice button click etc...
	gameLoop();
}
