import getState from "redux/getState";
import { selectEntityById } from "redux/game/session/map";
import getNextUpgrade from "game/rules/map/lot/getNextUpgrade";

export default location => {
	let resolvedLocation;
	if (typeof location === "string") {
		// Resolve id to entity
		resolvedLocation = selectEntityById(getState(), location);
	} else {
		resolvedLocation = location;
	}

	// Current tier
	const currentTier = resolvedLocation.tier;

	// getNextUpgrade will return number if upgrade is available
	// or undefined if upgrade is not possible
	return (typeof getNextUpgrade(currentTier) === "number");
};
