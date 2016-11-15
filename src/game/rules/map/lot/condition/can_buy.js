import getState from "redux/getState";
import { selectPlayerById } from "redux/game/session/players";
import { selectEntityById } from "redux/game/session/map";

import lotIsTradable from "game/rules/map/lot/condition/is_tradable";
import lotIsUnowned from "game/rules/map/lot/condition/is_unowned";
import playerHaveGold from "game/rules/player/condition/have_gold";

export default (player, location) => {
	// Resolve id to entity
	const state = getState();
	const resolvedLocation = selectEntityById(state, location);
	const resolvedPlayer = selectPlayerById(state, player);

	// Rules
	const LOT_IS_TRADABLE = lotIsTradable(resolvedLocation);
	const LOT_IS_UNOWNED = lotIsUnowned(resolvedLocation);
	const PLAYER_HAVE_ENOUGH_GOLD = playerHaveGold(resolvedPlayer, resolvedLocation.price);

	return LOT_IS_TRADABLE &&
	       LOT_IS_UNOWNED &&
	       PLAYER_HAVE_ENOUGH_GOLD;
};