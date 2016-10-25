import dispatch from "../../../utils/dispatch";

import { actions } from "../../../../redux/game/player";

export default (playerId, position) => {
	dispatch(actions.setPosition(playerId, position));
};