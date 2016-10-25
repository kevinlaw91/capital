import { combineReducers } from "redux";

// Reducers
import { reducer as map } from "./map";
import { reducer as turn } from "./turn";
import { reducer as players } from "./players";

const reducer = combineReducers({
	map,
	players,
	turn,
});
export { reducer };