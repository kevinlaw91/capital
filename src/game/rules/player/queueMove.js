import playerMove from "../../rules/player/actions/move";

const PLAYER_MOVE_INTERVAL = 500;

/**
 * Move player along the path
 * @param {string} playerId
 * @param {Array.<string>} path - Array containing id of location points
 */
export default (playerId, path) => {
	return new Promise(reachedDestination => {
		// Go to each waypoints in sequence
		path.reduce(
			(queue, location, idx) => {
				return queue.then(() => {
					return new Promise(nextStep => {
						// Move player
						playerMove(playerId, location);

						if (idx === path.length -1) {
							// No delay for last step in queue
							nextStep();
						} else {
							// Animation delay for each step
							window.setTimeout(nextStep, PLAYER_MOVE_INTERVAL);
						}
					});
				});
			}
			, Promise.resolve()
		).then(reachedDestination);
	});
};