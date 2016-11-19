import { combineReducers } from "redux";

// Reducers
import { reducer as map } from "./map";
import { reducer as turn } from "./turn";
import { reducer as players } from "./players";
import { reducer as status } from "./status";

const reducer = combineReducers({
	map,
	players,
	status,
	turn,
});
export { reducer };