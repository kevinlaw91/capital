import dispatch from "redux/dispatch";
import getState from "redux/getState";
import { actions as playerActions } from "redux/player";
import { selectPlayerById } from "redux/game/session/players";
import { selectEntityById } from "redux/game/session/map";
import { getStageInstance } from "game/session/stage";
import { templates } from "redux/game/stage/floaters";
import getRent from "game/rules/map/lot/getRent";
import { getScreenOffset } from "game/map/tile/tokenPosition";

export default (location, player) => {
	// Amount
	const amount = getRent(location);

	// Deduct gold
	dispatch(playerActions.deductGold(player.id, amount));

	// Render GoldChangeText floaters
	const state = getState();
	const owner = selectPlayerById(state, location.owner);

	const offsetActivePlayer = getScreenOffset(location.id);
	const offsetOwner = getScreenOffset(owner.position);

	const floaters = getStageInstance().floaters;

	// Behind
	floaters.addItem(templates.GOLD_CHANGE_TEXT, {
		x: offsetOwner.x,
		y: offsetOwner.y,
		text: `+${amount}`,
		color: owner.color,
	});

	// Front
	floaters.addItem(templates.GOLD_CHANGE_TEXT, {
		x: offsetActivePlayer.x,
		y: offsetActivePlayer.y,
		text: `-${amount}`,
		color: player.color,
	});
};
