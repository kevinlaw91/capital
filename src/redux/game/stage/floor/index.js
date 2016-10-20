import { combineReducers } from "redux";

import { reducer as corners } from "./corners";
import { reducer as south } from "./south";
import { reducer as west } from "./west";
import { reducer as north } from "./north";
import { reducer as east } from "./east";

// Types
export const types = {
	"CHANGE_SYMBOL": "game/stage/floor/CHANGE_SYMBOL",
};

// Actions
export const actions = {
	changeSymbol: (tileId, symbol, variant) => ({
		type: types.CHANGE_SYMBOL,
		id: tileId,
		symbol,
		variant,
	}),
};

// Reducer
const reducer = combineReducers({
	corners,
	south,
	west,
	north,
	east,
});

export { reducer };