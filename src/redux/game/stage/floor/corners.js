import Immutable from "seamless-immutable";
import { types } from "./index";
import tileReducer from "./tileReducer";

// Initial state
const initialState = Immutable({
	"TILE-CORNER-BOTTOM": {
		symbol: "grass-3x3",
		variant: "01",
	},
	"TILE-CORNER-LEFT": {
		symbol: "grass-3x3",
		variant: "01",
	},
	"TILE-CORNER-TOP": {
		symbol: "grass-3x3",
		variant: "01",
	},
	"TILE-CORNER-RIGHT": {
		symbol: "grass-3x3",
		variant: "01",
	},
});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.CHANGE_SYMBOL:
			if (action.id && state[action.id]) {
				return state.set(
					action.id,
					tileReducer(state[action.id], action),
					{ deep: true }
				);
			}

			return state;

		default:
			return state;
	}
}