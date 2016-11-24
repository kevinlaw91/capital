import playerCanBuyLot from "game/rules/map/lot/condition/can_buy";
import lotIsUnowned from "game/rules/map/lot/condition/is_unowned";
import playerIsOwner from "game/rules/map/lot/condition/is_owner";
import { prompt as promptLotPurchase } from "game/rules/map/lot/purchase";
import payRent from "game/rules/map/lot/pay_rent";

export default (player, location) => {
	// Pending decisions
	// This need to be resolved by player before passing turn
	const pending = [];

	if (location.startsWith("LOT-")) {
		if (lotIsUnowned(location)) {
			// Unowned
			if (playerCanBuyLot(player, location)) {
				// Offer player to buy property
				pending.push(promptLotPurchase(location, player));
			}
		} else {
			// Have owner
			if (playerIsOwner(location, player)) {
				// Ask to upgrade
			} else {
				payRent(location, player);
			}
		}
	}

	// Make sure all pending decisions were already resolved by player
	return Promise.all(pending);
};