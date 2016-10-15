import Immutable from "seamless-immutable";

import corners from "./corners";
import * as lot from "./lot";

// Initial state
const initialState = Immutable({
	corners: corners,
	south: lot.SOUTH,
	west: lot.WEST,
	north: lot.NORTH,
	east: lot.EAST,
});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		default: return state;
	}
}