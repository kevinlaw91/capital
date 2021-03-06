import dispatch from "redux/dispatch";
import getState from "redux/getState";
import { token as animation } from "game/config/animations";
import { findWaypointsBySteps } from "game/rules/map/pathfinder";
import stay from "game/rules/map/stay";
import queueMove from "game/rules/player/queueMove";
import roll from "game/rules/dice/roll";
import { subscribe as waitForDiceOnClick } from "game/rules/dice/click";
import { selectPlayerById } from "redux/game/session/players";
import { selectEntityById } from "redux/game/session/map";
import { selectActivePlayerId } from "redux/game/session/turn";
import { actions as diceButtonActions } from "redux/ui/dice";
import { actions as tokenActions } from "redux/player/token";

function wait(duration) {
	return function () {
		return new Promise(r => setTimeout(r, duration));
	};
}

export default function () {
	return new Promise(pass => {
		const state = getState();
		const activePlayerId = selectActivePlayerId(state);
		const activePlayer = selectPlayerById(state, activePlayerId);

		waitForDiceOnClick()
			.then(() => {
				// Disable dice button
				dispatch(diceButtonActions.disable());

				// Set idle to false to hide active indicator
				dispatch(tokenActions.setIdle(activePlayerId, false));
			})

			// Wait before start moving
			.then(wait(animation.ACTION_DELAY))

			// Move players by number of step obtained from dice roll
			.then(() => {
				// Roll dice
				const steps = roll();

				// Pathfinding
				const currentPos = activePlayer.position;
				const waypoints = findWaypointsBySteps(currentPos, steps);

				// Set dice button to indeterminate state
				dispatch(diceButtonActions.setIndeterminate(true));

				return queueMove(activePlayerId, waypoints)
					// Reset dice button indeterminate state
					.then(() => dispatch(diceButtonActions.setIndeterminate(false)));
			})
			// Reached destination
			.then(() => {
				// Token becomes idle
				dispatch(tokenActions.setIdle(activePlayerId, true));

				// Hide dice button
				dispatch(diceButtonActions.hide());

				// Resolve entities
				const state = getState();
				const resolvedPlayer = selectPlayerById(state, activePlayerId);
				const resolvedLocation = selectEntityById(state, resolvedPlayer.position);

				// Execute player stay rules
				return stay(resolvedPlayer, resolvedLocation);
			})
			// Wait before passing the turn
			.then(wait(animation.ACTION_DELAY))
			// Re-enable dice button
			.then(() => {
				// Show and enable dice button
				dispatch(diceButtonActions.show());
				dispatch(diceButtonActions.enable());
			})
			// Pass the turn to next person
			.then(pass);
	});
}
