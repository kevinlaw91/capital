import Immutable from "seamless-immutable";

import tokenPosition from "./tokenPosition";
import coordinate from "../../../../game/coordinates";

// Types
export const types = {
	"ADD": "game/stage/tokens/ADD",
	"CLEAR": "game/stage/tokens/CLEAR",
	"SET_POSITION": "game/stage/tokens/SET_POSITION",
};

// Actions
export const actions = {
	add: playerId => ({
		type: types.ADD,
		id: playerId,
	}),

	clear: () => ({ type: types.CLEAR }),

	setPosition: (playerId, pos) => {
		let coord = pos;

		if (typeof pos === "string") {
			// Transform location id to x, y mapping in map
			const tokenPos = tokenPosition(pos);
			const screenOffset = coordinate(tokenPos.y, tokenPos.x);

			coord = {
				x: screenOffset[0],
				y: screenOffset[1],
			};
		}

		return {
			type: types.SET_POSITION,
			id: playerId,
			x: coord.x,
			y: coord.y,
		};
	}
};

const initialState = Immutable({});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			return state.merge({ [action.id]: {
				color: "white",
				x: 0,
				y: 0,
			} }, { deep: true });

		case types.CLEAR:
			return initialState;

		case types.SET_POSITION:
			return state.merge(
				{ [action.id]: {
					x: action.x,
					y: action.y,
				} }, { deep: true });

		default: return state;
	}
}