import Immutable from "seamless-immutable";

import tokenPosition from "./tokenPosition";
import coordinate from "../../../../game/map/coordinates";

import { types as sharedTypes } from "../../player";
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

		case sharedTypes.SET_POSITION:
			let screenOffset = [0, 0];

			if (typeof action.position === "string") {
				// Transform location id to x, y mapping in map
				const tokenPos = tokenPosition(action.position);
				screenOffset = coordinate(tokenPos.y, tokenPos.x);
			}

			return state.merge({
				x: screenOffset[0],
				y: screenOffset[1],
			});

		default:
			return state;
	}
}