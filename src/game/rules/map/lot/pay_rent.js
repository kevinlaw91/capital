import getState from "redux/getState";
import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";
import { selectPlayerById } from "redux/game/session/players";
import { selectEntityById } from "redux/game/session/map";
import { getStageInstance } from "game/session/stage";
import { templates } from "redux/game/stage/floaters";
import getRent from "game/rules/map/lot/getRent";
import { getScreenOffset } from "game/map/tile/tokenPosition";

export default (location, player) => {
	// Resolve id to entity
	const state = getState();
	const resolvedLocation = selectEntityById(state, location);
	const resolvedPlayer = selectPlayerById(state, player);

	// Amount
	const amount = getRent(resolvedLocation);

	// Deduct gold
	dispatch(playerActions.deductGold(player, amount));

	// Render GoldChangeText floater
	let x, y;
	({ x, y } = getScreenOffset(location));

	getStageInstance().floaters.addItem(templates.GOLD_CHANGE_TEXT, {
		x, y,
		text: `-${amount}`,
		color: resolvedPlayer.color,
	});
};
