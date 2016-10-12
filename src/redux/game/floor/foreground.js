import { GRID_COL, GRID_ROW } from "../../../game/coordinates";

const items = [];
export default items;

let id = 0, r, c, count;

// (Corner) South west 3x3
r = 13; c = 1;
items.push({
	col: c, row: r,
	id: "f" + ++id,
	symbol: "grass-3x3",
	variant: "01",
	rowSize: 3,
	colSize: 3,
	square: true, // Square 3 x 3
});

// (Corner) North east 3x3
r = 1; c = 13;
items.push({
	col: c, row: r,
	id: "f" + ++id,
	symbol: "grass-3x3",
	variant: "01",
	rowSize: 3,
	colSize: 3,
	square: true, // Square 3 x 3
});

// (Lot) South, 1x3 per lot, 9 in total
r = 13; c = 4; count = 9;
while (count--) {
	items.push({
		col: c, row: r,
		id: "f" + ++id,
		symbol: "lot-south",
		variant: "01",
		rowSize: 3,
		colSize: 1,
	});
	c++; // Proceed to next lot
}

// (Lot) East, 3x1 per lot, 9 in total
r = 4; c = 13; count = 9;
while (count--) {
	items.push({
		col: c, row: r,
		id: "f" + ++id,
		symbol: "lot-east",
		variant: "01",
		rowSize: 1,
		colSize: 3,
	});
	r++; // Proceed to next lot
}

// (Corner) South west 3x3
r = 13; c = 13;
items.push({
	col: c, row: r,
	id: "f" + ++id,
	symbol: "grass-3x3",
	variant: "01",
	rowSize: 3,
	colSize: 3,
	square: true, // Square 3 x 3
});

// South border
r = 16; c = 1;
for (; c < GRID_COL; c++) {
	items.push({
		col: c, row: r,
		id: "f" + ++id,
		symbol: "concrete",
		variant: "01",
		crisp: true,
	});
}

// East border
r = 1; c = 16;
for (; r < GRID_ROW; r++) {
	items.push({
		col: c, row: r,
		id: "f" + ++id,
		symbol: "concrete",
		variant: "01",
		crisp: true,
	});
}