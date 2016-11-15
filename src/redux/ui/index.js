import { combineReducers } from "redux";

// Reducers
import { reducer as camera } from "./camera";
import { reducer as prompts } from "./prompts";
import { reducer as splash } from "./splash";
import { reducer as tooltip } from "./tooltip";
import { reducer as dice } from "./dice";

const reducer = combineReducers({
	camera,
	prompts,
	splash,
	tooltip,
	dice,
});
export { reducer };