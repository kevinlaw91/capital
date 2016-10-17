import Immutable from "seamless-immutable";
import createReducer from "./side_reducer";

let EAST = {};
let r = 4, c = 13, count = 9;

while (count--) {
	let id = `TILE-EAST-${r}`;

	EAST[id] = {
		col: c, row: r,
		id: id,
		symbol: "lot-east",
		variant: "01",
		rowSize: 1,
		colSize: 3,
	};

	r++; // Proceed to next lot
}

// Initial state
const initialState = Immutable(EAST);

// Reducer
export const reducer = createReducer("EAST", initialState);