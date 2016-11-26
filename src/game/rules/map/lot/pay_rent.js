import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";
import { getStageInstance } from "game/session/stage";
import { templates } from "redux/game/stage/floaters";
import getRent from "game/rules/map/lot/getRent";
import { getScreenOffset } from "game/map/tile/tokenPosition";

export default (location, player) => {
	// Amount
	const amount = getRent(location);

	// Deduct gold
	dispatch(playerActions.deductGold(player.id, amount));

	// Render GoldChangeText floater
	let x, y;
	({ x, y } = getScreenOffset(location.id));

	getStageInstance().floaters.addItem(templates.GOLD_CHANGE_TEXT, {
		x, y,
		text: `-${amount}`,
		color: player.color,
	});
};
