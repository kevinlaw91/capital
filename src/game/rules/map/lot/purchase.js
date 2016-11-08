import dispatch from "redux/dispatch";
import { actions as playerActions } from "redux/player";
import { actions as lotActions } from "redux/lot";

/**
 * @param {string} location
 * @param {string} owner
 * @param {number} price
 */
export default (location, owner, price) => {
	dispatch(playerActions.deductGold(owner, price));
	dispatch(lotActions.setOwner(location, owner));
};