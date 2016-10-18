import Immutable from "seamless-immutable";
import shortid from "shortid";

// Types
export const types = {
	"ADD": "game/session/players/ADD",
	"CLEAR": "game/session/players/CLEAR",
	"SET_POSITION": "game/session/players/SET_POSITION",
};

// Actions
export const actions = {
	add: () => ({ type: types.ADD }),
	clear: () => ({ type: types.CLEAR }),

	setPosition: (playerId, pos) => ({
		type: types.SET_POSITION,
		id: playerId,
		positon: pos,
	}),
};

// Initial state
const initialState = Immutable({});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			// Generate a player id
			let id;

			// Make sure id is unique
			do {
				id = shortid.generate();
			} while (id in state);

			return state.merge({ [id]: {
				// Start position
				position: "CORNER-BOTTOM",
			} }, { deep: true });

		case types.SET_POSITION:
			return state.merge(
				{ [action.id]: {
					position: action.position
				} }, { deep: true });

		case types.CLEAR:
			return initialState;

		default: return state;
	}
}