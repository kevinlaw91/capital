import Immutable from "seamless-immutable";

import foregroundItems from "./foreground";
import backgroundItems from "./background";

// Initial state
const initialState = Immutable({
	foreground: foregroundItems,
	background: backgroundItems,
});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		default: return state;
	}
}