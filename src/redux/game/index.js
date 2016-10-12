import { combineReducers } from "redux";

// Reducers
import * as floor from "./floor";
import * as tokens from "./tokens";

const reducer = combineReducers({
	floor: floor.reducer,
	tokens: tokens.reducer,
});
export { reducer };