let r, c, count;

// South Lot
export let SOUTH = [];

r = 13; c = 4; count = 9;
while (count--) {
	SOUTH.push({
		col: c, row: r,
		id: `TILE-SOUTH-C${c}`,
		symbol: "lot-south",
		variant: "01",
		rowSize: 3,
		colSize: 1,
	});

	c++; // Proceed to next lot
}


// West Lot
export let WEST = [];

r = 4; c = 1; count = 9;
while (count--) {
	WEST.push({
		col: c, row: r,
		id: `TILE-WEST-R${r}`,
		symbol: "lot-west",
		variant: "01",
		rowSize: 1,
		colSize: 3,
	});

	r++; // Proceed to next lot
}

// North Lot
export let NORTH = [];

r = 1; c = 4; count = 9;
while (count--) {
	NORTH.push({
		col: c, row: r,
		id: `TILE-NORTH-C${c}`,
		symbol: "lot-north",
		variant: "01",
		rowSize: 3,
		colSize: 1,
	});

	c++; // Proceed to next lot
}

// East Lot
export let EAST = [];

r = 4; c = 13; count = 9;
while (count--) {
	EAST.push({
		col: c, row: r,
		id: `TILE-EAST-R${r}`,
		symbol: "lot-east",
		variant: "01",
		rowSize: 1,
		colSize: 3,
	});

	r++; // Proceed to next lot
}