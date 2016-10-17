import Immutable from "seamless-immutable";

// Initial state
const initialState = Immutable({
	bottom: {
		col: 13, row: 13,
		id: "TILE-CORNER-BOTTOM",
		symbol: "grass-3x3",
		variant: "01",
		rowSize: 3,
		colSize: 3,
		square: true,
	},

	left: {
		col: 1, row: 13,
		id: "TILE-CORNER-LEFT",
		symbol: "grass-3x3",
		variant: "01",
		rowSize: 3,
		colSize: 3,
		square: true,
	},

	top: {
		col: 1, row: 1,
		id: "TILE-CORNER-TOP",
		symbol: "grass-3x3",
		variant: "01",
		rowSize: 3,
		colSize: 3,
		square: true,
	},

	right: {
		col: 13, row: 1,
		id: "TILE-CORNER-RIGHT",
		symbol: "grass-3x3",
		variant: "01",
		rowSize: 3,
		colSize: 3,
		square: true,
	},
});

// Reducer
export function reducer(state = initialState) {
	return state;
}