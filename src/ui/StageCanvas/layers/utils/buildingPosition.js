export default function(side, index) {
	return {
		// x = 12, 11, 10 ... 4
		"S": i => ({ x: 12 - i, y: 15 }),
		// y = 12, 11, 10 ... 4
		"W": i => ({ x: 1, y: 12 - i }),
		// x = 4, 5, 6 ... 12
		"N": i => ({ x: 4 + i, y: 1 }),
		// y = 4, 5, 6 ... 12
		"E": i => ({ x: 15, y: 4 + i }),
	}[side](index);
}