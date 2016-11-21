/* eslint-disable */
import getState from "redux/getState";
import dispatch from "redux/dispatch";
import {
	selectAllPlayers,
	selectPlayerById,
} from "redux/game/session/players";
import {
	selectAllEntities,
	selectEntityById,
} from "redux/game/session/map";
import { selectTurnOrder } from "redux/game/session/turn";
import { actions as playerActions } from "redux/player";
import { actions as lotActions } from "redux/lot";

const DISABLE_DEBUG = false;

/** Developer debug entry */
export default (function () {
	if (DISABLE_DEBUG) { return; }

	const state = getState();

	// First player
	const firstPlayerId = selectTurnOrder(state)[0];
	const firstPlayer = selectPlayerById(state, firstPlayerId);

	// Second player
	const secondPlayerId = selectTurnOrder(state)[1];
	const secondPlayer = selectPlayerById(state, secondPlayerId);

	// South lot
	const lot = [
		"LOT-S0",
	    "LOT-S1",
	    "LOT-S2",
	    "LOT-S3",
	    "LOT-S4",
	    "LOT-S5",
	    "LOT-S6",
	    "LOT-S7",
	    "LOT-S8",
	];

	/*
	// South lot transformation
	lot.forEach(id => {
	});
	*/
})();