import dispatch from "redux/dispatch";
import getState from "redux/getState";
import { actions as playerActions } from "redux/player";
import { actions as lotActions } from "redux/lot";
import { actions as promptsAction } from "redux/ui/prompts";
import { selectEntityById } from "redux/game/session/map";
import { createOffer } from "game/session/player/offers";
import playerCanBuyLot from "game/rules/map/lot/condition/can_buy";
import { LotPurchase } from "ui/prompts/templates";

/**
 * @param {string} location
 * @param {string} player
 */
export function prompt(location, player) {
	// Create offer
	const offer = createOffer();

	// Price
	const price = selectEntityById(getState(), location).price;

	return new Promise(dismiss => {
		// Show prompt
		// Data to be displayed on prompt box
		const fields = { location };
		dispatch(promptsAction.create(LotPurchase, offer.id, fields));

		function onAccept() {
			// Re-evaluate requirements
			if (playerCanBuyLot(player, location)) {
				// Perform transaction
				dispatch(playerActions.deductGold(player, price));
				dispatch(lotActions.setOwner(location, player));
			} else {
				console.warn("Cannot buy lot property. Condition not met.");
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