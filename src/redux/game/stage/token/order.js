import Immutable from "seamless-immutable";
import { types as tokenTypes } from "./actions";
import { types as playerTypes } from "redux/player";

// Types
export const types = {
	"SET_ORDER": "game/stage/token/order/SET_ORDER",
	"CLEAR": "game/stage/token/order/CLEAR",
};

// Actions
export const actions = {
	setOrder: arr => ({
		type: types.SET_ORDER,
		order: arr,
	}),

	clear: () => ({ type: types.CLEAR }),
};

// Initial state
const initialState = Immutable([]);

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case tokenTypes.SET_ORDER:
			if (action.order) {
				return Immutable(action.order.reverse());
			}

			return state;

		case tokenTypes.CLEAR:
			return initialState;

		case playerTypes.SET_ACTIVE:
			// Move id entry towards the end when token is set to active
			if (action.id) {
				// Remove entry and re-insert at the end
				return state.filter(id => (id !== action.id))
				            .concat([action.id]);
			}

			return state;

		default:
			return state;
	}
}

// Selectors
export const selectOrder = state => state.game.stage.token.order;