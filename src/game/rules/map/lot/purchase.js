import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";
import { actions as lotActions } from "redux/lot";

/**
 * @param {string} location
 * @param {string} player
 * @param {number} price
 */
export default (location, player, price) => {
	dispatch(playerActions.deductGold(player, price));
	dispatch(lotActions.setOwner(location, player));
};