import Immutable from "seamless-immutable";

import { types } from "./actions";
import playerReducer from "./playerReducer";

// Re-export types and actions
export { types, actions } from "./actions";

// Initial state
const initialState = Immutable({});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			if (action.id) {
				const newPlayer = playerReducer(null, action);

				return state.set(action.id, newPlayer);
			}

			return state;

		case types.CLEAR:
			return initialState;

		case types.SET_POSITION:
			if (action.id) {
				return state.set(
					action.id,
					playerReducer(state[action.id], action),
					{ deep: true }
				);
			}

			return state;

		default:
			return state;
	}
}

// Selectors
export const selectAllPlayers = state => state.game.session.players;
export const selectPlayerById = (state, playerId) => state.game.session.players[playerId];