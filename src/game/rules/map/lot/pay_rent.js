import dispatch from "redux/dispatch";
import getState from "redux/getState";
import { actions as playerActions } from "redux/player";
import { selectPlayerById } from "redux/game/session/players";
import { getStageInstance } from "game/session/stage";
import { templates } from "redux/game/stage/floaters";
import getRent from "game/rules/map/lot/getRent";
import { getScreenOffset } from "game/map/tile/tokenPosition";

export default (location, player) => {
	// Amount
	const amount = getRent(location);
	const owner = selectPlayerById(getState(), location.owner);

	// Deduct gold
	dispatch(playerActions.deductGold(player.id, amount));

	// Render GoldChangeText floater
	let x, y;
	({ x, y } = getScreenOffset(location.id));

	const floaters = getStageInstance().floaters;
	floaters.addItem(templates.GOLD_CHANGE_TEXT, {
		x, y,
		text: `+${amount}`,
		color: owner.color,
	});
	floaters.addItem(templates.GOLD_CHANGE_TEXT, {
		x, y,
		text: `-${amount}`,
		color: player.color,
	});
};
