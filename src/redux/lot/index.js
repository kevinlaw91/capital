import Immutable from "seamless-immutable";
import types from "./types";

// Re-export types and actions
export { types };
export { default as actions } from "./actions";

// Initial state
const initialState = Immutable({});

// Reducer
export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.SET_NAME:
			return state.set("name", action.name);

		case types.SET_TRADABLE:
			return state.set("tradable", action.tradable);

		case types.SET_PRICE:
			return state.set("price", action.price);

		case types.SET_UPGRADE_COST:
			return state.set("upgrades", action.upgrades, { deep: true });

		case types.SET_RENT:
			return state.set("rent", action.rent, { deep: true });

		default:
			return state;
	}
}