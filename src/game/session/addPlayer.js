import shortid from "shortid";
import dispatch from "redux/dispatch";
import { actions as playerCollection } from "redux/game/session/players";
import { actions as playerActions } from "redux/player";
import { actions as tokenActions } from "redux/game/stage/token/items";
import playerConfig from "game/config/player";

export default props => {
	// Generate a unique player id
	const id = shortid.generate();

	// Register player
	dispatch(playerCollection.add(id));

	// Register token
	dispatch(tokenActions.add(id));

	// Set color
	dispatch(playerActions.setColor(id, props.color));

	// Set starting gold
	dispatch(playerActions.setGold(id, playerConfig.STARTING_GOLD));

	// Move player to starting location
	dispatch(playerActions.setPosition(id, "CORNER-BOTTOM"));

	return id;
};