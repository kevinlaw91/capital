import Immutable from "seamless-immutable";
import shortid from "shortid";

// Types
export const types = {
	"NEW": "game/session/players/NEW",
	"CLEAR": "game/session/players/CLEAR",
};

// Actions
export const actions = {
	new: () => ({ type: types.NEW }),
	clear: () => ({ type: types.CLEAR }),
};

// Initial state
const initialState = Immutable({});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.NEW:
			// Generate a player id
			let id;

			// Make sure id is unique
			do {
				id = shortid.generate();
			} while (id in state);

			return state.merge({ [id]: {} }, { deep: true });

		case types.CLEAR:
			return initialState;

		default: return state;
	}
}