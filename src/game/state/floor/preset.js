import {
	GRID_COL,
	GRID_ROW,
} from "../../coordinates";

// Divide into composition groups
export let background = [];
export let foreground = [];

let id = 0, r, c, count;

//
// Background
//

// North border
r = 0; c = 0;
for (; c < GRID_COL; c++) {
	background.push({
		col: c, row: r,
		id: ++id,
		symbol: "concrete",
		variant: "01",
		crisp: true,
	});
}

// West border
r = 1; c = 0;
for (; r < GRID_ROW; r++) {
	background.push({
		col: c, row: r,
		id: ++id,
		symbol: "concrete",
		variant: "01",
		crisp: true,
	});
}

// (Corner) North west 3x3
r = 1; c = 1;
background.push({
	col: c, row: r,
	id: ++id,
	symbol: "grass-3x3",
	variant: "01",
	rowSize: 3,
	colSize: 3,
	square: true, // Square 3 x 3
});

// (Lot) North, 1x3 per lot, 9 in total
r = 1; c = 4; count = 9;
while (count--) {
	background.push({
		col: c, row: r,
		id: ++id,
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
	background.push({
		col: c, row: r,
		id: ++id,
		symbol: "lot-west",
		variant: "01",
		rowSize: 1,
		colSize: 3,
	});
	r++; // Proceed to next lot
}

//
// Foreground
//

// (Corner) South west 3x3
r = 13; c = 1;
foreground.push({
	col: c, row: r,
	id: ++id,
	symbol: "grass-3x3",
	variant: "01",
	rowSize: 3,
	colSize: 3,
	square: true, // Square 3 x 3
});

// (Corner) North east 3x3
r = 1; c = 13;
foreground.push({
	col: c, row: r,
	id: ++id,
	symbol: "grass-3x3",
	variant: "01",
	rowSize: 3,
	colSize: 3,
	square: true, // Square 3 x 3
});

// (Lot) South, 1x3 per lot, 9 in total
r = 13; c = 4; count = 9;
while (count--) {
	foreground.push({
		col: c, row: r,
		id: ++id,
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
	foreground.push({
		col: c, row: r,
		id: ++id,
		symbol: "lot-east",
		variant: "01",
		rowSize: 1,
		colSize: 3,
	});
	r++; // Proceed to next lot
}

// (Corner) South west 3x3
r = 13; c = 13;
foreground.push({
	col: c, row: r,
	id: ++id,
	symbol: "grass-3x3",
	variant: "01",
	rowSize: 3,
	colSize: 3,
	square: true, // Square 3 x 3
});

// South border
r = 16; c = 1;
for (; c < GRID_COL; c++) {
	foreground.push({
		col: c, row: r,
		id: ++id,
		symbol: "concrete",
		variant: "01",
		crisp: true,
	});
}

// East border
r = 1; c = 16;
for (; r < GRID_ROW; r++) {
	foreground.push({
		col: c, row: r,
		id: ++id,
		symbol: "concrete",
		variant: "01",
		crisp: true,
	});
}