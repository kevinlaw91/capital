import Immutable from "seamless-immutable";

import coordinate from "../../../../game/coordinates";

// Initial state
const initialState = Immutable([
	{
		id: "p01",
		color: "white",
		position: {
			x: coordinate(13, 13)[0],
			y: coordinate(13, 13)[1],
		}
	}
]);

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		default: return state;
	}
}