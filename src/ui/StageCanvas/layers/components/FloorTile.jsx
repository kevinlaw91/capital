import {
	GRID_TILESIZE,
	getBoundingOffset,
} from "../../../utils/coordinates";

import { tiles as sprite } from "../../../utils/sprites";

const HALF_TILE = GRID_TILESIZE / 2;
const QUARTER_TILE = GRID_TILESIZE / 4;

// SVG crisp rendering style
const crispEdge = {
	shapeRendering: "crispEdges",
};

export default function FloorTile(props) {
	const { rowSize, colSize } = props;

	let height = GRID_TILESIZE;
	let width = GRID_TILESIZE;

	// Tile size for getBoundingOffset
	// Default to 1x1 if undefined
	let to;

	if (rowSize && colSize) {
		// Set tile size for getBoundingOffset
		to = {
			rowSize: rowSize,
			colSize: colSize,
		};

		// Calculate width and height
		width = (props.rowSize * HALF_TILE) + (props.colSize * HALF_TILE);
		height = HALF_TILE + QUARTER_TILE + (Math.max(rowSize, colSize) * QUARTER_TILE);

		// Add additional height for a larger square tile
		if (props.square) {

			// Validate square size
			if (rowSize === colSize) {

				// For square tiles larger than 1x1 only
				if (rowSize > 1 /* && colSize > 1 */) {
					height += HALF_TILE;
				}

			} else {
				logger.warn("Invalid square tile. Please review the tile size or remove the 'square' flag.");
			}
		}
	}

	// Calculate screen offset
	let offset = getBoundingOffset(props.row, props.col, to);

	// Use sprite
	let href = sprite(props.symbol, props.variant);

	return (
		<use
			x={offset[0]}
			y={offset[1]}
			width={width}
			height={height}
			xlinkHref={href}
			style={props.crisp && crispEdge}
		/>
	);
}

FloorTile.propTypes = {
	symbol: React.PropTypes.string.isRequired,
	variant: React.PropTypes.string,
	row: React.PropTypes.number.isRequired,
	col: React.PropTypes.number.isRequired,
	square: React.PropTypes.bool,
	rowSize: React.PropTypes.number,
	colSize: React.PropTypes.number,
	crisp: React.PropTypes.bool,
};