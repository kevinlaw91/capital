import Immutable from "seamless-immutable";

import { types } from "./index";

// Initial state
const initialState = Immutable({
	color: "white",
	x: 0,
	y: 0,
});

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			return initialState;

		case types.SET_POSITION:
			return state.merge({
				x: action.x,
				y: action.y,
			});

		default:
			return state;
	}
}