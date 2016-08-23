import { combineReducers } from "redux";

// Reducers
import * as Splash from "./splash";

export default combineReducers({
	splash: Splash.reducer
});