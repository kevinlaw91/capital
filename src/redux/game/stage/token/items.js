import Immutable from "seamless-immutable";
import tokenReducer, { types as tokenTypes } from "redux/player/token";
import { types as playerTypes } from "redux/player";

// Types
export const types = {
	"ADD": "game/stage/token/ADD",
	"CLEAR": "game/stage/token/CLEAR",
};

// Actions
export const actions = {
	add: playerId => ({
		type: types.ADD,
		id: playerId,
	}),

	clear: () => ({
		type: types.CLEAR
	}),
};

// Initial state
const initialState = Immutable({});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			if (action.id) {
				return state.set(action.id, tokenReducer());
			}

			return state;

		case types.CLEAR:
			return initialState;

		default:
			// Handle children actions
			if (
				Object.values(playerTypes).includes(action.type) ||
				Object.values(tokenTypes).includes(action.type)
			) {
				if (action.id) {
					return state.set(
						action.id,
						tokenReducer(state[action.id], action),
						{ deep: true }
					);
				}
			}

			return state;
	}
}

// Selectors
export const selectAllTokens = state => state.game.stage.token.items;