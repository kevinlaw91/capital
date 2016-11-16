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
	return new Promise(reachedDestination => {
		// Reducer that accepts every waypoint id in the path
		// then generate move actions and add into a promise chain
		const queueReducer = (queue, location, idx) => {
			// Add each waypoints to move queue
			return queue.then(() => {
				// Wait for a step to complete before beginning another step
				return new Promise(stepCompleted => {
					// A step is complete when:
					// 1. Player position was updated
					// 2. Move animation done
					// 3. Wait is over (if still have next move in queue)
					return new Promise(animDone => {
						// Set animation complete callback
						findToken(playerId)
							.onAnimationComplete()
							.then(animDone);
						// Move player
						dispatch(playerActions.setPosition(playerId, location));
					}).then(() => {
						// Move animation done
						// Execute player passing rules
						passing(playerId, location);

						if (idx < path.length - 1) {
							// Wait before beginning next step
							window.setTimeout(stepCompleted, animation.PAUSE_BEFORE_NEXT_STEP);
						} else if (idx === path.length - 1) {
							// Reached destination
							// Already reached last step in queue, no delay needed
							stepCompleted();
						}
					});
				});
			});
		};

		// Initial value was set to a resolved promise
		// so that first item in queue can start immediately
		path.reduce(queueReducer, Promise.resolve())
		    // Queue completed / reach destination
		    .then(reachedDestination);
	});
};