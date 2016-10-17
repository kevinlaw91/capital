import Immutable from "seamless-immutable";
import createReducer from "./side_reducer";

let SOUTH = {};
let r = 13, c = 4, count = 9;

while (count--) {
	let id = `TILE-SOUTH-${c}`;

	SOUTH[id] = {
		col: c, row: r,
		id: id,
		symbol: "lot-south",
		variant: "01",
		rowSize: 3,
		colSize: 1,
	};

	c++; // Proceed to next lot
}

// Initial state
const initialState = Immutable(SOUTH);

// Reducer
export const reducer = createReducer("SOUTH", initialState);