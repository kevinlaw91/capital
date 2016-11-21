import { combineReducers } from "redux";

// Reducers
import { reducer as floaters } from "./floaters";
import { reducer as floor } from "./floor";
import { reducer as token } from "./token";

const reducer = combineReducers({
	floaters,
	floor,
	token,
});
export { reducer };