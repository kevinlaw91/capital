import dispatch from "../../utils/dispatch";
import getState from "../../utils/getState";

import playerfindNextMove from "../../rules/player/findNextMove";
import queueMove from "../../rules/player/queueMove";
import roll from "./roll";

import { selectPlayerById } from "../../../redux/game/session/players";
import { selectActivePlayerId } from "../../../redux/game/session/turn";
import { actions as diceButtonActions } from "../../../redux/ui/dice";

/** @return {Promise} */
export default function () {
	const state = getState();

	const activePlayerId = selectActivePlayerId(state);
	const activePlayer = selectPlayerById(state, activePlayerId);
	const currentPos = activePlayer.position;

	// Roll dice
	let steps = roll();

	// Pathfinding
	const nextMoves = [];
	while (steps > 0) {
		// Find next move start from current position
		let from = nextMoves[nextMoves.length - 1] || currentPos;
		nextMoves.push(playerfindNextMove(from));
		steps--;
	}

	dispatch(diceButtonActions.setIndeterminate(true));
	dispatch(diceButtonActions.disable());

	return queueMove(activePlayerId, nextMoves)
		.then(() => {
			dispatch(diceButtonActions.enable());
			dispatch(diceButtonActions.setIndeterminate(false));
		});
}