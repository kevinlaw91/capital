import { GRID_TILESIZE } from "game/map/coordinates";

const HALF_TILE = GRID_TILESIZE / 2;
const QUARTER_TILE = GRID_TILESIZE / 4;

export default function (rowSize, colSize) {
	// Tile size default to 1x1
	let height = GRID_TILESIZE;
	let width = GRID_TILESIZE;

	if (rowSize && colSize) {
		width = (rowSize * HALF_TILE) + (colSize * HALF_TILE);
		height = HALF_TILE + QUARTER_TILE + (Math.max(rowSize, colSize) * QUARTER_TILE);

		// Add more height to square tile larger than 1x1
		if (rowSize > 1 && rowSize === colSize) {
			height += HALF_TILE;
		}
	}

	return { width, height };
}
