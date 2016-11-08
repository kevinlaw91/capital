import playerHaveGold from "game/rules/player/condition/player_have_gold_amount";

// Rule: Lot is tradable
function lotIsTradable(location) {
	return location.tradable;
}

// Rule: Lot is unowned
function lotIsUnowned(location) {
	return !location.owner;
}

// Rule: Player have enough gold
const playerHasEnoughGold = playerHaveGold;

/**
 * @param {object} player - Resolved player
 * @param {object} location - Resolved lot
 * @return {bool} Offer lot to player?
 */
export default (player, location) => {
	return lotIsTradable(location) &&
	       lotIsUnowned(location) &&
	       playerHasEnoughGold(player, location.price);
};