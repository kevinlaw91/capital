import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";
import { token as animation } from "game/config/animations";
import passing from "game/rules/map/passing";
import { find as findToken } from "ui/tokens";

/**
 * Move player along the path
 * @param {string} playerId
 * @param {Array.<string>} path - Array containing waypoint location ids
 */
export default (playerId, path) => {
	// Reducer that accepts every waypoint id in the path
	// and chain it into a promise
	const queueReducer = (queue, location, idx) => {
		// Chain future steps into move queue
		return queue.then(() => {
			//
			// Sequenced actions for each waypoint
			//

			/** Move player token by animation */
			const moveToken = () => new Promise(resolve => {
				// Set animation complete callback
				findToken(playerId)
					.onAnimationComplete()
					.then(resolve);
				// Move player
				dispatch(playerActions.setPosition(playerId, location));
			});

			/** Will be called when player passing a location */
			const tokenPassing = () => {
				// Execute player passing rules
				passing(playerId, location);
			};

			/** Delay between each steps */
			const wait = () => new Promise(resolve => {
				const haveMoreSteps = idx < path.length - 1;
				if (haveMoreSteps) {
					// Wait before continue
					window.setTimeout(resolve, animation.PAUSE_BEFORE_NEXT_STEP);
				} else {
					// Already reached last step in queue
					// No delay needed
					resolve();
				}
			});

			// Execute these sequences for each waypoints
			return moveToken()
				.then(tokenPassing)
				.then(wait);
		});
	};

	// Reaching destination as a promise
	return new Promise(reach => {
		// Initial value was set to a resolved promise
		// so that first item in queue can start immediately
		path.reduce(queueReducer, Promise.resolve())
		    .then(reach);
	});
};