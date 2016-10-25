import dispatch from "../utils/dispatch";

import { actions as playerCollection } from "../../redux/game/session/players";
import { actions as tokenCollection } from "../../redux/game/stage/token/items";
import { actions as map } from "../../redux/game/session/map";

export default function () {
	// Reset map
	dispatch(map.reset());

	// Clear player list
	dispatch(playerCollection.clear());

	// Clear player tokens
	dispatch(tokenCollection.clear());
}