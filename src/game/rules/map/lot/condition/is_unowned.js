import getState from "redux/getState";
import { selectEntityById } from "redux/game/session/map";

export default location => {
	let resolvedLocation;
	if (typeof location === "string") {
		// Resolve id to entity
		resolvedLocation = selectEntityById(getState(), location);
	} else {
		resolvedLocation = location;
	}

	return !resolvedLocation.owner;
};