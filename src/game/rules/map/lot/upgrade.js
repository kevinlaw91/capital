import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";
import { actions as lotActions } from "redux/lot";
import { actions as promptsAction } from "redux/ui/prompts";
import { createOffer } from "game/session/player/offers";
import playerCanUpgradeLot from "game/rules/map/lot/condition/can_upgrade";
import getNextUpgrade from "game/rules/map/lot/getNextUpgrade";
import { LotUpgrade } from "ui/prompts/templates";

/**
 * @param {Object} location
 * @param {Object} player
 */
export function prompt(location, player) {
	// Create offer
	const offer = createOffer();

	// Get upgrade cost
	const next_tier = getNextUpgrade(location);
	const upgrade_cost = location.upgrades[next_tier];

	return new Promise(dismiss => {
		// Show prompt

		// Data to be displayed on prompt box
		const fields = {
			location: location.id,
			cost: upgrade_cost,
		};

		dispatch(promptsAction.create(LotUpgrade, offer.id, fields));

		function onAccept() {
			if (playerCanUpgradeLot(player, location)) {
				// Perform transaction
				dispatch(playerActions.deductGold(player.id, upgrade_cost));
				dispatch(lotActions.setTier(location.id, next_tier));
			} else {
				console.warn("Cannot upgrade lot property. Conditions not met.");
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
