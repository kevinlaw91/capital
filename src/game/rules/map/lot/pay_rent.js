import getState from "redux/getState";
import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";
import { selectPlayerById } from "redux/game/session/players";
import { selectEntityById } from "redux/game/session/map";
import { renderGoldChangeText } from "ui/Stage/controllers/floater";
import { getScreenOffset } from "game/map/tile/tokenPosition";

export default (location, player) => {
	// Resolve id to entity
	const state = getState();
	const resolvedLocation = selectEntityById(state, location);
	const resolvedPlayer = selectPlayerById(state, player);

	// Amount
	// TODO: Replace with current tier
	const amount = resolvedLocation.rent.TIER_0;

	// Deduct gold
	dispatch(playerActions.deductGold(player, amount));

	// Render GoldChangeText floater
	let x, y;
	({ x, y } = getScreenOffset(location));

	renderGoldChangeText({
		x, y,
		text: `-${amount}`,
		color: resolvedPlayer.color,
	});
};