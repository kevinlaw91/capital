import Immutable from "seamless-immutable";

import tokenReducer from "./tokenReducer";
import tokenPosition from "./tokenPosition";
import coordinate from "../../../../game/map/coordinates";

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
			if (action.id) {
				const newToken = tokenReducer(null, action);

				return state.set(action.id, newToken);
			}

			return state;

		case types.CLEAR:
			return initialState;

		case types.SET_POSITION:
			if (action.id) {
				return state.set(
					action.id,
					tokenReducer(state[action.id], action),
					{ deep: true }
				);
			}

			return state;

		default:
			return state;
	}
}

// Selectors
export const selectAllTokens = state => state.game.stage.tokens;