import { combineReducers } from "redux";

// Reducers
import { reducer as session } from "./session";
import { reducer as stage } from "./stage";

const reducer = combineReducers({
	session,
	stage,
});
export { reducer };