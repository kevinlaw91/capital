import Immutable from "seamless-immutable";

// Game statuses
export const GameStatus = Immutable({
	NONE: "NONE",
	INIT: "INIT",
	PREGAME: "PREGAME",
	ACTIVE: "ACTIVE",
	POSTGAME: "POSTGAME",
});

// Types
export const types = {
	"SET_STATUS": "game/session/status/SET_STATUS",
};

// Actions
export const actions = {
	setStatus: status => ({
		type: types.SET_STATUS,
		status,
	}),
};

// Initial state
const initialState = GameStatus.NONE;

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.SET_STATUS:
			return action.status;

		default:
			return state;
	}
}

// Selectors
export const getGameState = state => state.game.session.status;
