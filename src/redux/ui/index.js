import { combineReducers } from "redux";

// Reducers
import * as Splash from "./splash";

const reducer = combineReducers({
	splash: Splash.reducer
});
export { reducer };