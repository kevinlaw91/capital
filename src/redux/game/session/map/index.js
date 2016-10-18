import Immutable from "seamless-immutable";

import mapDefinition from "./initialState";
import generateMap from "./generate";

// Types
export const types = {
	"GENERATE": "game/session/map/GENERATE",
	"RESET": "game/session/map/RESET",
};

// Actions
export const actions = {
	generate: () => ({ type: types.GENERATE }),
	reset: () => ({ type: types.RESET }),
};

// Initial state
const initialState = Immutable(mapDefinition);

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.GENERATE:
			return generateMap(state);

		case types.RESET:
			return initialState;

		default: return state;
	}
}