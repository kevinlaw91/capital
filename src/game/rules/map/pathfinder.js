import findNextMove from "game/rules/map/nextMove";

export function findWaypointsBySteps(from, steps) {
	const waypoints = [];
	while (steps > 0) {
		// Use last item in waypoint array as value for "from"
		let current = waypoints[waypoints.length - 1] || from;
		waypoints.push(findNextMove(current));
		steps--;
	}

	return waypoints;
}