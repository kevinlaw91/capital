import playerCanBuyLot from "game/rules/map/lot/condition/can_buy";
import { prompt as promptLotPurchase } from "game/rules/map/lot/purchase";

export default (player, location) => {
	// Pending decisions
	// This need to be resolved by player before passing turn
	const pending = [];

	if (location.startsWith("LOT-")) {
		if (playerCanBuyLot(player, location)) {
			// Offer player to buy property
			pending.push(promptLotPurchase(location, player));
		}
	}

	// Make sure all pending decisions were already resolved by player
	return Promise.all(pending);
};