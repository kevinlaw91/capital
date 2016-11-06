import passing from "game/rules/map/passing";
import stay from "game/rules/map/stay";

/**
 * Handle player stopover
 * @param {string} location - Location id
 * @param {boolean} isDestination - True if player reached the destination or false if only passing by
 */
export default (location, isDestination) => {
	if (!isDestination) {
		passing(location);
	} else {
		passing(location);
		stay(location);
	}
};