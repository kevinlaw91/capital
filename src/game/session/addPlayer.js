import shortid from "shortid";

import getState from "../utils/getState";
import dispatch from "../utils/dispatch";

import {
	selectAllPlayers,
	actions as playerActions
} from "../../redux/game/session/players";

function generateUniqueId() {
	let id; // Generated id

	// Read current player list
	const players = selectAllPlayers(getState());
	do {
		// Generate a unique player id
		id = shortid.generate();
	} while (id in players);

	return id;
}

export default () => {
	const uniqueId = generateUniqueId();
	dispatch(playerActions.add(uniqueId));

	return uniqueId;
};