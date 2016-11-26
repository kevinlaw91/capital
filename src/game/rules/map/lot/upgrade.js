import dispatch from "redux/dispatch";
import getState from "redux/getState";
import { actions as playerActions } from "redux/player";
import { actions as lotActions } from "redux/lot";
import { actions as promptsAction } from "redux/ui/prompts";
import { selectEntityById } from "redux/game/session/map";
import { createOffer } from "game/session/player/offers";
import playerCanUpgradeLot from "game/rules/map/lot/condition/can_upgrade";
import getNextUpgrade from "game/rules/map/lot/getNextUpgrade";
import { LotUpgrade } from "ui/prompts/templates";

/**
 * @param {string} location
 * @param {string} player
 */
export function prompt(location, player) {
	// Create offer
	const offer = createOffer();

	// Resolve location
	const resolvedLocation = selectEntityById(getState(), location);

	// Get upgrade cost
	const next_tier = getNextUpgrade(resolvedLocation.tier);
	const upgrade_cost = resolvedLocation.upgrades[next_tier];

	return new Promise(dismiss => {
		// Show prompt
		// Data to be displayed on prompt box
		const fields = {
			location,
			cost: upgrade_cost,
		};

		dispatch(promptsAction.create(LotUpgrade, offer.id, fields));

		function onAccept() {
			// Re-evaluate requirements
			if (playerCanUpgradeLot(player, location)) {
				// Perform transaction
				dispatch(playerActions.deductGold(player, upgrade_cost));
				dispatch(lotActions.setTier(location, next_tier));
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
