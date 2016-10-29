import Immutable from "seamless-immutable";

import { types as sharedTypes } from "../../player";
import { types } from "./items";

// Initial state
const initialState = Immutable({
	color: "white",
});

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			return initialState;

		case sharedTypes.SET_POSITION:
			return state.set("position", action.position);

		case sharedTypes.SET_COLOR:
			return state.set("color", action.color);

		case types.SET_ONMOVE:
			if (action.callback) {
				return state.set("onMove", action.callback);
			} else {
				return state.without("onMove");
			}

		default:
			return state;
	}
}