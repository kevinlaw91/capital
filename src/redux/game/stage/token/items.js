import Immutable from "seamless-immutable";
import tokenReducer from "./tokenReducer";
import { types as tokenTypes } from "./index";
import { types as playerTypes } from "redux/game/player";

// Initial state
const initialState = Immutable({});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case tokenTypes.ADD:
			if (action.id) {
				const newToken = tokenReducer(null, action);

				return state.set(action.id, newToken);
			}

			return state;

		case tokenTypes.CLEAR:
			return initialState;

		case playerTypes.SET_POSITION:
		case playerTypes.SET_COLOR:
		case tokenTypes.SET_IDLE:
		case tokenTypes.SET_ONMOVE:
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
export const selectAllTokens = state => state.game.stage.token.items;