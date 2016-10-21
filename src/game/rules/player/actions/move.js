import dispatch from "../../../utils/dispatch";

import { actions as playerActions } from "../../../../redux/game/session/players";
import { actions as tokenActions } from "../../../../redux/game/stage/tokens";

export default (playerId, position) => {
	dispatch(playerActions.setPosition(playerId, position));
	dispatch(tokenActions.setPosition(playerId, position));
};