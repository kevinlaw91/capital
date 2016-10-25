import dispatch from "../../utils/dispatch";

import { actions as playerSharedActions } from "../../../redux/game/player";
import { actions as tokenActions } from "../../../redux/game/stage/tokens";

const PLAYER_MOVE_WAIT = 200;

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
						dispatch(playerSharedActions.setPosition(playerId, location));
					}).then(() => {
						// Player done moving
						// (3) Wait before beginning next step
						if (idx <= path.length - 1) {
							window.setTimeout(stepCompleted, PLAYER_MOVE_WAIT);
						} else {
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