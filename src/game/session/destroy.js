import dispatch from "../utils/dispatch";
import { batchActions } from "redux-batched-actions";

import { actions as playerActions } from "../../redux/game/session/players";
import { actions as tokenActions } from "../../redux/game/stage/tokens";
import { actions as mapActions } from "../../redux/game/session/map";

export default function () {
	// Reset map
	dispatch(batchActions(mapActions.reset()));

	// Clear player list
	dispatch(batchActions(playerActions.clear()));

	// Clear player tokens
	dispatch(batchActions(tokenActions.clear()));
}