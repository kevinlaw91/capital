import Immutable from "seamless-immutable";

import tokenReducer from "./tokenReducer";
import { types as sharedTypes } from "../../player";

// Types
export const types = {
	"ADD": "game/stage/tokens/ADD",
	"CLEAR": "game/stage/tokens/CLEAR",
};

// Actions
export const actions = {
	add: playerId => ({
		type: types.ADD,
		id: playerId,
	}),

	clear: () => ({ type: types.CLEAR }),
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

		case sharedTypes.SET_POSITION:
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