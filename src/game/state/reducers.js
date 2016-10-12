import { combineReducers } from "redux";

// Reducers
import * as Floor from "./floor/floor";
import * as Token from "./tokens";

export default combineReducers({
	floor: Floor.reducer,
	tokens: Token.reducer,
});