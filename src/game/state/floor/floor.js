import { foreground, background } from "./preset";

// Initial state
const initialState = {
	foreground: foreground,
	background: background,
};

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		default: return state;
	}
}