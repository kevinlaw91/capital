import calcScreenOffset from "./calcScreenOffset";
import calcTileSize from "./calcTileSize";
import { default as sprite } from "game/resources/sprites/tiles";

export default function FloorTile(props) {
	const {
		symbol,
		variant,
		row,
		col,
		rowSize,
		colSize,
		...otherProps,
	} = props;

	// Calculate props
	const size = calcTileSize(rowSize, colSize);
	const offset = calcScreenOffset(row, col, rowSize, colSize);

	// Get tile sprite
	const href = sprite(symbol, variant);
	if (!href) {
		logger.error(`Sprite '${symbol}' (Variant: '${variant}') cannot be found in tile collection.`);
	}

	let handleMouseEnter, handleMouseOut;

	// Hover effect
	if (props.hoverEffect) {
		handleMouseEnter = evt => {
			evt.target.setAttribute("filter", "url(#FloorLayerTileHoverEffect)");
		};

		handleMouseOut = evt => {
			evt.target.removeAttribute("filter");
		};
	}

	return href && (
		<use
			{...offset}
			{...size}
			xlinkHref={href}
			onMouseEnter={handleMouseEnter}
			onMouseOut={handleMouseOut}
			{...otherProps}
		/>
	);
}

FloorTile.propTypes = {
	symbol: React.PropTypes.string.isRequired,
	variant: React.PropTypes.string,
	row: React.PropTypes.number.isRequired,
	col: React.PropTypes.number.isRequired,
	rowSize: React.PropTypes.number,
	colSize: React.PropTypes.number,
	hoverEffect: React.PropTypes.bool,
};