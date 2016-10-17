import Immutable from "seamless-immutable";
import createReducer from "./side_reducer";

let WEST = {};
let r = 4, c = 1, count = 9;

while (count--) {
	let id = `TILE-WEST-${r}`;

	WEST[id] = {
		col: c, row: r,
		id: id,
		symbol: "lot-west",
		variant: "01",
		rowSize: 1,
		colSize: 3,
	};

	r++; // Proceed to next lot
}

// Initial state
const initialState = Immutable(WEST);

// Reducer
export const reducer = createReducer("WEST", initialState);