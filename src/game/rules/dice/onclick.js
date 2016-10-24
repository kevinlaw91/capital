import dispatch from "../../utils/dispatch";
import getState from "../../utils/getState";

import playerfindNextMove from "../../rules/player/findNextMove";
import queueMove from "../../rules/player/queueMove";
import roll from "./roll";

import { selectAllPlayers, selectPlayerById } from "../../../redux/game/session/players";
import { actions as diceButtonActions } from "../../../redux/ui/dice";

/** @return {Promise} */
export default function () {
	const state = getState();

	const firstPlayerId = Object.keys(selectAllPlayers(state))[0];
	const firstPlayer = selectPlayerById(state, firstPlayerId);
	const currentPos = firstPlayer.position;

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

	return queueMove(firstPlayerId, nextMoves)
		.then(() => {
			dispatch(diceButtonActions.enable());
			dispatch(diceButtonActions.setIndeterminate(false));
		});
}