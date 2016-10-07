import {
	GRID_COL,
	GRID_ROW,
	getBoundingOffset
} from "../../coordinates";

// Divide into composition groups
export let background = [];
export let foreground = [];

let id = 0, r, c, offset, count;

//
// Background
//

// North border
r = 0; c = 0;
for (; c < GRID_COL; c++) {
	offset = getBoundingOffset(r, c);
	background.push({
		id: ++id,
		symbol: "concrete",
		variant: "01",
		x: offset[0],
		y: offset[1],
		shapeRendering: "crispEdges",
	});
}

// West border
r = 1; c = 0;
for (; r < GRID_ROW; r++) {
	offset = getBoundingOffset(r, c);
	background.push({
		id: ++id,
		symbol: "concrete",
		variant: "01",
		x: offset[0],
		y: offset[1],
		shapeRendering: "crispEdges",
	});
}

// (Corner) North west 3x3
r = 1; c = 1;
offset = getBoundingOffset(r, c, { rowSize: 3, colSize: 3 });
background.push({
	id: ++id,
	symbol: "grass-3x3",
	variant: "01",
	x: offset[0],
	y: offset[1],
	width: 192,
	height: 128,
});

// (Lot) North, 1x3 per lot, 9 in total
r = 1; c = 4; count = 9;
while (count--) {
	offset = getBoundingOffset(r, c, { rowSize: 3, colSize: 1 });
	background.push({
		id: ++id,
		symbol: "lot-north",
		variant: "01",
		x: offset[0],
		y: offset[1],
		width: 128,
		height: 96,
	});
	c++; // Proceed to next lot
}

// (Lot) West, 3x1 per lot, 9 in total
r = 4; c = 1; count = 9;
while (count--) {
	offset = getBoundingOffset(r, c, { rowSize: 1, colSize: 3 });
	background.push({
		id: ++id,
		symbol: "lot-west",
		variant: "01",
		x: offset[0],
		y: offset[1],
		width: 128,
		height: 96,
	});
	r++; // Proceed to next lot
}

//
// Foreground
//

// (Corner) South west 3x3
r = 13; c = 1;
offset = getBoundingOffset(r, c, { rowSize: 3, colSize: 3 });
foreground.push({
	id: ++id,
	symbol: "grass-3x3",
	variant: "01",
	x: offset[0],
	y: offset[1],
	width: 192,
	height: 128,
});

// (Corner) North east 3x3
r = 1; c = 13;
offset = getBoundingOffset(r, c, { rowSize: 3, colSize: 3 });
foreground.push({
	id: ++id,
	symbol: "grass-3x3",
	variant: "01",
	x: offset[0],
	y: offset[1],
	width: 192,
	height: 128,
});

// (Lot) South, 1x3 per lot, 9 in total
r = 13; c = 4; count = 9;
while (count--) {
	offset = getBoundingOffset(r, c, { rowSize: 3, colSize: 1 });
	foreground.push({
		id: ++id,
		symbol: "lot-south",
		variant: "01",
		x: offset[0],
		y: offset[1],
		width: 128,
		height: 96,
	});
	c++; // Proceed to next lot
}

// (Lot) East, 3x1 per lot, 9 in total
r = 4; c = 13; count = 9;
while (count--) {
	offset = getBoundingOffset(r, c, { rowSize: 1, colSize: 3 });
	foreground.push({
		id: ++id,
		symbol: "lot-east",
		variant: "01",
		x: offset[0],
		y: offset[1],
		width: 128,
		height: 96,
	});
	r++; // Proceed to next lot
}

// (Corner) South west 3x3
r = 13; c = 13;
offset = getBoundingOffset(r, c, { rowSize: 3, colSize: 3 });
foreground.push({
	id: ++id,
	symbol: "grass-3x3",
	variant: "01",
	x: offset[0],
	y: offset[1],
	width: 192,
	height: 128,
});

// South border
r = 16; c = 1;
for (; c < GRID_COL; c++) {
	offset = getBoundingOffset(r, c);
	foreground.push({
		id: ++id,
		symbol: "concrete",
		variant: "01",
		x: offset[0],
		y: offset[1],
		shapeRendering: "crispEdges",
	});
}

// East border
r = 1; c = 16;
for (; r < GRID_ROW; r++) {
	offset = getBoundingOffset(r, c);
	foreground.push({
		id: ++id,
		symbol: "concrete",
		variant: "01",
		x: offset[0],
		y: offset[1],
		shapeRendering: "crispEdges",
	});
}