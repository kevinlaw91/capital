export default function (side, index) {
	return {
		"CORNER-BOTTOM": i => ({ x: 13, y: 13 }),
		"CORNER-LEFT": i => ({ x: 3, y: 13 }),
		"CORNER-RIGHT": i => ({ x: 13, y: 3 }),
		"CORNER-TOP": i => ({ x: 3, y: 3 }),
		// x = 12, 11, 10 ... 4
		"S": i => ({ x: 12 - i, y: 13 }),
		// y = 12, 11, 10 ... 4
		"W": i => ({ x: 3, y: 12 - i }),
		// x = 4, 5, 6 ... 12
		"N": i => ({ x: 4 + i, y: 3 }),
		// y = 4, 5, 6 ... 12
		"E": i => ({ x: 13, y: 4 + i }),
	}[side](index);
}