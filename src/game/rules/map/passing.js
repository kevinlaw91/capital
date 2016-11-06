import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";

export default (player, location) => {
	switch (location) {
		case "CORNER-BOTTOM":
			// Roundtrip bonus gold
			dispatch(playerActions.addGold(player, 2000));
			break;
	}
};