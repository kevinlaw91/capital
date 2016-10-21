// Game grid settings
export const GRID_COL = 17;
export const GRID_ROW = 17;
export const GRID_TILESIZE = 64;

/** Dimetric projection coordinates */
const coordinates = (() => {
	let _coord = [];

	// Cache calculated values
	const HALF_TILE = GRID_TILESIZE / 2;
	const QUARTER_TILE = GRID_TILESIZE / 4;

	// This is the offset to be added to all values of x
	// so that x-axis will be normalized and contains only positive numbers
	const offset_x = (GRID_ROW - 1) * HALF_TILE;

	for (let r = 0; r < GRID_ROW; r++) {
		// Add rows
		_coord.push([]);

		// Base coordinates for first column of each rows
		let ox = r * -HALF_TILE;
		let oy = r * QUARTER_TILE;

		for (let c = 0; c < GRID_COL; c++) {
			_coord[r].push([
				ox + (c * HALF_TILE) + offset_x,
				oy + (c * QUARTER_TILE)
			]);
		}
	}

	return _coord;
})();

/**
 * Calculate bounding box offset for tiles
 * To specify tile larger than 1x1, define last tile in "to" parameter.
 * Last tile is always located at the bottom/right, e.g:
 * <pre>
 *  first -->  [A] . . .            .[A] .
 *             :       :   -->  . `       . `
 *   last -->  . . . .[B]          ` [B]`
 * </pre>
 * @param {number} row - Row position of first tile
 * @param {number} col - Column position of first tile
 * @param {{col: number, row: number}|{colSize: number, rowSize: number}} [to] - Define last tile
 * @example
 * getBoundingOffset(4, 5); // Get bounding box for a 1x1 tile at r4, c5
 * getBoundingOffset(4, 5, {row: 6, col: 5}) // Last tile positioned at r6, c5
 * getBoundingOffset(1, 2, {rowSize:1, colSize:3}) // First tile at r1, c2, 3 cols x 1 row
 * @returns {number[]} Bounding box offset [x,y]
 */
export function getBoundingOffset(row, col, to) {
	if (to) {
		// Bigger than 1x1 tile
		if (
			to.hasOwnProperty("rowSize") &&
		    to.hasOwnProperty("colSize")
		) {
			// Size (offset) was given
			// Calculate last tile
			to.row = row + (to.rowSize - 1);
			to.col = col + (to.colSize - 1);
		}

		return [
			coordinates[to.row][col][0],
			coordinates[col][row][1]
		];
	} else {
		// Simple 1x1 tile
		return coordinates[row][col];
	}
}

/**
 * Calculate offset to a vertex
 * <pre>
 *        . N .
 *     W         E
 *       `  S  `
 *     L         R
 *       `  B  `
 * </pre>
 * @param {number} row - Row position of the tile
 * @param {number} col - Column position of the tile
 * @param {string} vertex - Vertex (Refer diagram)
 * @returns {number[]} Offset in the form of [x,y]
 */
export function getVertexOffset(row, col, vertex) {
	let [x, y] = coordinates[row][col];

	// Cache calculated values
	const FULL = GRID_TILESIZE;
	const HALF = GRID_TILESIZE / 2;
	const QUARTER = GRID_TILESIZE / 4;

	switch (vertex) {
		case "N":
			x += HALF;
			break;
		case "W":
			y += QUARTER;
			break;
		case "E":
			x += FULL;
			y += QUARTER;
			break;
		case "S":
			x += HALF;
			y += HALF;
			break;
		case "L":
			y += HALF + QUARTER;
			break;
		case "B":
			x += HALF;
			y += FULL;
			break;
		case "R":
			x += FULL;
			y += HALF + QUARTER;
			break;
	}

	return [x, y];
}

/**
 * Get the vectors of the center of top face that belongs to a tile
 * @example
 * Vector for position "X" will be returned
 * <pre>
 *        _
 *     _-` `-_
 *   .`   X   `.
 *   |`-_   _-`|
 *   .   `:`   .
 *    `-_ | _-`
 *       `~`
 * </pre>
 */
export function getTopFaceMidpoint(row, col) {
	let [x, y] = coordinates[row][col];

	x += GRID_TILESIZE / 2;
	y += GRID_TILESIZE / 4;

	return [x, y];
}

/** Get canvas offset for the coordinates */
export default (row, col) => coordinates[row][col];