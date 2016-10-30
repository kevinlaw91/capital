import { combineReducers } from "redux";

// Re-export types and actions
export { types, actions } from "./actions";

// Reducers
import { reducer as items } from "./items";
import { reducer as order } from "./order";

export const reducer = combineReducers({
	items,
	order,
});