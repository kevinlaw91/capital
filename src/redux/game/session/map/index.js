import Immutable from "seamless-immutable";
import {
	default as lotReducer,
	initialState as lotInitialState,
	types as lotTypes,
} from "redux/lot";

// Types
export const types = {
	"RESET": "game/session/map/RESET",
};

// Actions
export const actions = {
	reset: () => ({
		type: types.RESET
	}),
};

// Generate map template
const map = {};
for (let side of ["S", "W", "N", "E"]) {
	// Each side has 9 lot
	for (let i = 0; i < 9; i++) {
		// Store entry
		const id = `LOT-${side}${i}`;
		map[id] = lotReducer(lotInitialState.set("id", id));
	}
}

// Initial state
const initialState = Immutable(map);

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.RESET:
			return initialState;

		default:
			// Handle children actions
			if (Object.values(lotTypes).includes(action.type)) {
				if (action.id) {
					return state.set(
						action.id,
						lotReducer(state[action.id], action),
						{ deep: true }
					);
				}
			}

			return state;
	}
}

// Selectors
export const selectAllEntities = state => state.game.session.map;
export const selectEntityById = (state, id) => state.game.session.map[id];
