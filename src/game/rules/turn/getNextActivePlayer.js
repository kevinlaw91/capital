import getState from "../../utils/getState";

import {
	selectTurnOrder,
	selectActivePlayerId,
} from "../../../redux/game/session/turn";

export default function () {
	// Set active player
	const state = getState();

	const turnOrder = selectTurnOrder(state);
	const activePlayerId = selectActivePlayerId(state);
	const activePlayerIndex = turnOrder.indexOf(activePlayerId);

	let nextPlayer = turnOrder[activePlayerIndex + 1];

	if (!nextPlayer) {
		// Reached the end of sequence
		// start over from beginning
		nextPlayer = turnOrder[0];
	}

	return nextPlayer;
}