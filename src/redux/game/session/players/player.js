import Immutable from "seamless-immutable";

import { types } from "./actions";

// Initial state
const initialState = Immutable({
	// Starting position
	position: "CORNER-BOTTOM",
});

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			return initialState;

		case types.SET_POSITION:
			return state.set("position", action.position);

		default:
			return state;
	}
}