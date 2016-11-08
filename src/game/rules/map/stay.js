import getState from "redux/getState";
import { selectPlayerById } from "redux/game/session/players";
import { selectEntityById } from "redux/game/session/map";
import playerCanBuyLot from "game/rules/player/condition/lot_buy";
import purchaseLot from "game/rules/map/lot/purchase";

export default (player, location) => {
	if (location.startsWith("LOT-")) {
		const state = getState();
		const entLot = selectEntityById(state, location);
		const entPlayer = selectPlayerById(state, player);

		if (playerCanBuyLot(entPlayer, entLot)) {
			// TODO: Build UI
			const purchase = window.confirm("Buy?");
			if (purchase) {
				purchaseLot(location, player, entLot.price);
			}
		}
	}
};