import { combineReducers } from "redux";

// Reducers
import { reducer as stage } from "./stage";

const reducer = combineReducers({
	stage,
});
export { reducer };