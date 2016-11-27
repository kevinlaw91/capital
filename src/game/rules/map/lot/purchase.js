import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";
import { actions as lotActions } from "redux/lot";
import { actions as promptsAction } from "redux/ui/prompts";
import { createOffer } from "game/session/player/offers";
import playerCanBuyLot from "game/rules/map/lot/condition/can_buy";
import { templates as t } from "redux/ui/prompts";

/**
 * @param {Object} location
 * @param {Object} player
 */
export function prompt(location, player) {
	// Create offer
	const offer = createOffer();

	// Price
	const price = location.price;

	return new Promise(dismiss => {
		// Show prompt

		// Data to be displayed on prompt box
		const fields = {
			location: location.id,
		};

		dispatch(promptsAction.create(t.LOT_PURCHASE, offer.id, fields));

		function onAccept() {
			// Re-evaluate requirements
			if (playerCanBuyLot(player, location)) {
				// Perform transaction
				dispatch(playerActions.deductGold(player.id, price));
				dispatch(lotActions.setOwner(location.id, player.id));
			} else {
				console.warn("Cannot buy lot property. Conditions not met.");
			}

			// Dismiss prompt
			dismiss();
		}

		function onDecline() {
			// Dismiss prompt
			dismiss();
		}

		offer.response
		     .then(onAccept, onDecline);
	}).then(() => {
		// Dismiss prompt
		dispatch(promptsAction.remove(offer.id));

		// Return resolved promise after every prompt dismiss
		return Promise.resolve();
	});
}
