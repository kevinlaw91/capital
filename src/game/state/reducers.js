import { combineReducers } from "redux";

// Reducers
import * as Floor from "./floor";

export default combineReducers({
	floor: Floor.reducer
});