import { foreground, background } from "./preset";

// Actions
export const ADD = "gamestate/floor/ADD";

// Initial state
const initialState = {
	foreground: foreground,
	background: background,
};

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case ADD:
			return [...state, action.data];
		default: return state;
	}
}