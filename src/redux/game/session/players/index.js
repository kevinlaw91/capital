import Immutable from "seamless-immutable";
import playerReducer, { types as playerTypes } from "redux/player";

// Types
export const types = {
	"ADD": "game/session/players/ADD",
	"CLEAR": "game/session/players/CLEAR",
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
				return state.set(action.id, playerReducer());
			}

			return state;

		case types.CLEAR:
			return initialState;

		default:
			// Handle children actions
			if (Object.values(playerTypes).includes(action.type)) {
				if (action.id) {
					return state.set(
						action.id,
						playerReducer(state[action.id], action),
						{ deep: true }
					);
				}
			}

			return state;
	}
}

// Selectors
export const selectAllPlayers = state => state.game.session.players;
export const selectPlayerById = (state, playerId) => state.game.session.players[playerId];