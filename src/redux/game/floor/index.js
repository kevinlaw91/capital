import { combineReducers } from "redux";

import { reducer as corners } from "./corners";
import { reducer as south } from "./south";
import { reducer as west } from "./west";
import { reducer as north } from "./north";
import { reducer as east } from "./east";

// Re-export types and actions
export { types, actions } from "./actions";

// Reducer
const reducer = combineReducers({
	corners,
	south,
	west,
	north,
	east,
});

export { reducer };