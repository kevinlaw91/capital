import { combineReducers } from "redux";

// Reducers
import { reducer as splash } from "./splash";

const reducer = combineReducers({
	splash,
});
export { reducer };