import Immutable from "seamless-immutable";
import createReducer from "./side_reducer";

let NORTH = {};
let r = 1, c = 4, count = 9;

while (count--) {
	let id = `TILE-NORTH-${c}`;

	NORTH[id] = {
		col: c, row: r,
		id: id,
		symbol: "lot-north",
		variant: "01",
		rowSize: 3,
		colSize: 1,
	};

	c++; // Proceed to next lot
}

// Initial state
const initialState = Immutable(NORTH);

// Reducer
export const reducer = createReducer("NORTH", initialState);