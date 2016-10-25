import shortid from "shortid";

import getState from "../utils/getState";
import dispatch from "../utils/dispatch";

import {
	selectAllPlayers,
	actions as playerCollection
} from "../../redux/game/session/players";
import { actions as playerActions } from "../../redux/game/player";
import { actions as tokenActions } from "../../redux/game/stage/tokens";

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
	const id = generateUniqueId();

	// Register player
	dispatch(playerCollection.add(id));

	// Register token
	dispatch(tokenActions.add(id));

	// Set color
	dispatch(playerActions.setColor(id, props.color));

	// Move player to starting location
	dispatch(playerActions.setPosition(id, "CORNER-BOTTOM"));

	return id;
};