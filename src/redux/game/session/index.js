import { combineReducers } from "redux";

// Reducers
import { reducer as map } from "./map";
import { reducer as players } from "./players";

const reducer = combineReducers({
	map,
	players,
});
export { reducer };