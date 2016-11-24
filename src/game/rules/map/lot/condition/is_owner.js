import getState from "redux/getState";
import { selectEntityById } from "redux/game/session/map";

export default (location, player) => {
	// Resolve id to entity
	const state = getState();
	const resolvedLocation = selectEntityById(state, location);

	return resolvedLocation.owner && resolvedLocation.owner === player;
};