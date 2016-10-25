import Immutable from "seamless-immutable";

import { types as sharedTypes } from "../../player";
import { types } from "./actions";

// Initial state
const initialState = Immutable({});

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			return initialState;

		case sharedTypes.SET_POSITION:
			return state.set("position", action.position);

		default:
			return state;
	}
}