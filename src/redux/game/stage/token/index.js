import { combineReducers } from "redux";

// Reducers
import { reducer as items } from "./items";
import { reducer as order } from "./order";

export const reducer = combineReducers({
	items,
	order,
});