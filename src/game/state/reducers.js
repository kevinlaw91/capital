import { combineReducers } from "redux";

// Reducers
import * as Floor from "./floor/floor";

export default combineReducers({
	floor: Floor.reducer
});