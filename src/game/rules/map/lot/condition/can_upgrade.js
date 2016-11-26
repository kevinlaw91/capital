import getState from "redux/getState";
import { selectPlayerById } from "redux/game/session/players";
import { selectEntityById } from "redux/game/session/map";
import getNextUpgrade from "game/rules/map/lot/getNextUpgrade";
import lotIsUpgradable from "game/rules/map/lot/condition/is_upgradable";
import playerHaveGold from "game/rules/player/condition/have_gold";

export default (player, location) => {
	// Resolve id to entity
	const state = getState();
	const resolvedLocation = selectEntityById(state, location);
	const resolvedPlayer = selectPlayerById(state, player);

	// Lot must be upgradable
	const LOT_IS_UPGRADABLE = lotIsUpgradable(resolvedLocation);

	if (LOT_IS_UPGRADABLE) {
		const next_tier = getNextUpgrade(resolvedLocation.tier);
		const upgrade_cost = resolvedLocation.upgrades[next_tier];

		// Player must have enough gold for upgrade
		const PLAYER_HAVE_ENOUGH_GOLD = playerHaveGold(resolvedPlayer, upgrade_cost);

		if (PLAYER_HAVE_ENOUGH_GOLD) {
			return true;
		}
	}

	return false;
};
