import { GRID_COL, GRID_ROW } from "../../../game/coordinates";

const items = [];
export default items;

let id = 0, r, c, count;

// North border
r = 0; c = 0;
for (; c < GRID_COL; c++) {
	items.push({
		col: c, row: r,
		id: "b" + ++id,
		symbol: "concrete",
		variant: "01",
		crisp: true,
	});
}

// West border
r = 1; c = 0;
for (; r < GRID_ROW; r++) {
	items.push({
		col: c, row: r,
		id: "b" + ++id,
		symbol: "concrete",
		variant: "01",
		crisp: true,
	});
}

// (Corner) North west 3x3
r = 1; c = 1;
items.push({
	col: c, row: r,
	id: "b" + ++id,
	symbol: "grass-3x3",
	variant: "01",
	rowSize: 3,
	colSize: 3,
	square: true, // Square 3 x 3
});

// (Lot) North, 1x3 per lot, 9 in total
r = 1; c = 4; count = 9;
while (count--) {
	items.push({
		col: c, row: r,
		id: "b" + ++id,
		symbol: "lot-north",
		variant: "01",
		rowSize: 3,
		colSize: 1,
	});
	c++; // Proceed to next lot
}

// (Lot) West, 3x1 per lot, 9 in total
r = 4; c = 1; count = 9;
while (count--) {
	items.push({
		col: c, row: r,
		id: "b" + ++id,
		symbol: "lot-west",
		variant: "01",
		rowSize: 1,
		colSize: 3,
	});
	r++; // Proceed to next lot
}