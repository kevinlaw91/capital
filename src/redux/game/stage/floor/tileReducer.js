import Immutable from "seamless-immutable";

import { types } from "./index";

// Initial state
const initialState = Immutable({});

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.CHANGE_SYMBOL:
			return state.merge({
				symbol: action.symbol,
				variant: (typeof action.variant !== "undefined") ? action.variant : state.variant,
			});

		default:
			return state;
	}
}