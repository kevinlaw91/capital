import getState from "../../utils/getState";

import playerfindNextMove from "../../rules/player/findNextMove";
import playerMove from "../../rules/player/actions/move";

import { selectAllPlayers, selectPlayerById } from "../../../redux/game/session/players";

export default () => {
	const state = getState();

	const firstPlayerId = Object.keys(selectAllPlayers(state))[0];
	const firstPlayer = selectPlayerById(state, firstPlayerId);
	const currentPos = firstPlayer.position;
	const nextMove = playerfindNextMove(currentPos);

	playerMove(firstPlayerId, nextMove);
}