import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/game/player";
import { actions as tokenActions } from "redux/game/stage/token";
import { token as animation } from "game/config/animations";
import reach from "game/rules/player/reach";

/**
 * Move player along the path
 * @param {string} playerId
 * @param {Array.<string>} path - Array containing waypoint location ids
 */
export default (playerId, path) => {
	return new Promise(reachedDestination => {
		// Handle promise resolving when animation completed
		let animCompleted = null;
		dispatch(tokenActions.setOnMove(playerId, () => animCompleted && animCompleted()));

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
						// Set animation complete callback resolver
						// (2) animation done callback (async)
						animCompleted = animDone;
						// (1) Move player
						dispatch(playerActions.setPosition(playerId, location));
					}).then(() => {
						// Move animation done
						if (idx < path.length - 1) {
							reach(location, false);

							// (3) Wait before beginning next step
							window.setTimeout(stepCompleted, animation.PAUSE_BEFORE_NEXT_STEP);
						} else if (idx === path.length - 1) {
							reach(location, true);

							// This is already last step in queue,
							// so no more waiting
							stepCompleted();
						}
					});
				});
			});
		};

		// Initial value was set to a resolved promise
		// so that first item in queue can start immediately
		path.reduce(queueReducer, Promise.resolve())
		    // Clear callback handler
		    .then(() => dispatch(tokenActions.setOnMove(playerId, null)))
		    // Queue completed / reach destination
		    .then(reachedDestination);
	});
};