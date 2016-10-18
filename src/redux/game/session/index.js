import { combineReducers } from "redux";

// Reducers
import { reducer as map } from "./map";

const reducer = combineReducers({
	map,
});
export { reducer };