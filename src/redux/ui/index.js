import { combineReducers } from "redux";

// Reducers
import { reducer as camera } from "./camera";
import { reducer as splash } from "./splash";

const reducer = combineReducers({
	camera,
	splash,
});
export { reducer };