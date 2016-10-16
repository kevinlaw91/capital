let r, c, count;

// South Lot
export let SOUTH = {};

r = 13; c = 4; count = 9;
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


// West Lot
export let WEST = {};

r = 4; c = 1; count = 9;
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

// North Lot
export let NORTH = {};

r = 1; c = 4; count = 9;
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

// East Lot
export let EAST = {};

r = 4; c = 13; count = 9;
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