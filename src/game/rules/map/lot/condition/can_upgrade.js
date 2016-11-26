import getNextUpgrade from "game/rules/map/lot/getNextUpgrade";
import lotIsUpgradable from "game/rules/map/lot/condition/is_upgradable";
import playerHaveGold from "game/rules/player/condition/have_gold";

export default (player, location) => {
	// Lot must be upgradable
	const LOT_IS_UPGRADABLE = lotIsUpgradable(location);

	if (LOT_IS_UPGRADABLE) {
		const next_tier = getNextUpgrade(location);
		const upgrade_cost = location.upgrades[next_tier];

		// Player must have enough gold for upgrade
		const PLAYER_HAVE_ENOUGH_GOLD = playerHaveGold(player, upgrade_cost);

		if (PLAYER_HAVE_ENOUGH_GOLD) {
			return true;
		}
	}

	return false;
};
