import { combineReducers } from "redux";

// Reducers
import { reducer as camera } from "./camera";
import { reducer as splash } from "./splash";
import { reducer as tooltip } from "./tooltip";
import { reducer as dice } from "./dice";

const reducer = combineReducers({
	camera,
	splash,
	tooltip,
	dice,
});
export { reducer };