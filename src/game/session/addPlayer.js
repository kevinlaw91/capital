import shortid from "shortid";

import getState from "../utils/getState";
import dispatch from "../utils/dispatch";

import {
	selectAllPlayers,
	actions as playerCollection
} from "../../redux/game/session/players";
import { actions as playerActions } from "../../redux/game/player";

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

export default props => {
	const uniqueId = generateUniqueId();
	dispatch(playerCollection.add(uniqueId));
	dispatch(playerActions.setColor(uniqueId, props.color));

	return uniqueId;
};