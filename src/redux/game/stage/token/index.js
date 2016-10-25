import { combineReducers } from "redux";

// Reducers
import { reducer as items } from "./items";
import { reducer as order } from "./order";

const reducer = combineReducers({
	items,
	order,
});
export { reducer };