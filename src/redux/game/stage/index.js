import { combineReducers } from "redux";

// Reducers
import { reducer as floor } from "./floor";
import { reducer as tokens } from "./tokens";

const reducer = combineReducers({
	floor,
	tokens,
});
export { reducer };