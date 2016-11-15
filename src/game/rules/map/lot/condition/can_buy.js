import lotIsTradable from "game/rules/map/lot/condition/is_tradable";
import lotIsUnowned from "game/rules/map/lot/condition/is_unowned";
import playerHaveGold from "game/rules/player/condition/have_gold";

export default (player, location) => {
	// Rules
	const LOT_IS_TRADABLE = lotIsTradable(location);
	const LOT_IS_UNOWNED = lotIsUnowned(location);
	const PLAYER_HAVE_ENOUGH_GOLD = playerHaveGold(player, location.price);

	return LOT_IS_TRADABLE &&
	       LOT_IS_UNOWNED &&
	       PLAYER_HAVE_ENOUGH_GOLD;
};