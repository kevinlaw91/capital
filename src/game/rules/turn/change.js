import dispatch from "../../utils/dispatch";
import getState from "../../utils/getState";

import { findWaypointsBySteps } from "../../rules/player/pathfinder";
import queueMove from "../../rules/player/queueMove";
import roll from "../../rules/dice/roll";
import { subscribe as waitForDiceOnClick } from "../../rules/dice/click";

import { selectPlayerById } from "../../../redux/game/session/players";
import { selectActivePlayerId } from "../../../redux/game/session/turn";
import { actions as diceButtonActions } from "../../../redux/ui/dice";

export default function () {
	return new Promise(pass => {
		waitForDiceOnClick()
			// Disable dice button
			.then(() => dispatch(diceButtonActions.disable()))

			// Roll dice
			.then(() => roll())

			// Move players by number of step obtained from dice roll
			.then(steps => {
				const state = getState();

				const activePlayerId = selectActivePlayerId(state);
				const activePlayer = selectPlayerById(state, activePlayerId);
				const currentPos = activePlayer.position;

				// Pathfinding
				const waypoints = findWaypointsBySteps(currentPos, steps);

				// Set dice button to indeterminate state
				dispatch(diceButtonActions.setIndeterminate(true));

				return queueMove(activePlayerId, waypoints)
					.then(() => {
						dispatch(diceButtonActions.setIndeterminate(false));
					});
			})
			// Reached destination
			// Re-enable dice button
			.then(() => dispatch(diceButtonActions.enable()))
			// Pass the turn to next person
			.then(pass);
	});
}