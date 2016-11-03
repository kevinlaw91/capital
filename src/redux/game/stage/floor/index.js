import { combineReducers } from "redux";

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
import { reducer as corners } from "./corners";
import { reducer as south } from "./south";
import { reducer as west } from "./west";
import { reducer as north } from "./north";
import { reducer as east } from "./east";

const reducer = combineReducers({
	corners,
	south,
	west,
	north,
	east,
});

export { reducer };

// Selectors
export const selectTiles = (state, group) => state.game.stage.floor[group];