import { getBoundingOffset } from "../../../../../utils/coordinates";

export default function (row, col, rowSize, colSize) {
	let offset;

	if (rowSize && colSize) {
		// Larger than 1x1
		offset = getBoundingOffset(row, col, { rowSize, colSize });
	} else {
		// 1x1
		offset = getBoundingOffset(row, col);
	}

	return {
		x: offset[0],
		y: offset[1],
	};
}