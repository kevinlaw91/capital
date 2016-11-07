import calcScreenOffset from "./calcScreenOffset";
import calcTileSize from "./calcTileSize";
import { default as sprite } from "game/resources/sprites/tiles";

export default function FloorTile(props) {
	const { symbol, variant, row, col, rowSize, colSize } = props;

	// Calculate props
	const size = calcTileSize(rowSize, colSize);
	const offset = calcScreenOffset(row, col, rowSize, colSize);

	// Get tile sprite
	const href = sprite(symbol, variant);
	if (!href) {
		logger.error(`Sprite '${symbol}' (Variant: '${variant}') cannot be found in tile collection.`);
	}

	// Tooltip
	let handleMouseEnter, handleMouseMove, handleMouseOut;
	if (props.tooltip) {
		handleMouseEnter = evt => {
			// Hover effect
			evt.target.setAttribute("filter", "url(#FloorLayerTileHoverEffect)");

			// Show tooltip
			props.showTooltip("LotTooltip", props.tooltip);
		};

		handleMouseMove = evt => {
			// Move tooltip
			const { left, top, width, height } = evt.target.getBoundingClientRect();
			props.moveTooltip(left + (width / 2), top + (height / 2));
		};

		handleMouseOut = evt => {
			// Undo hover effect
			evt.target.removeAttribute("filter");

			// Hide tooltip
			props.hideTooltip();
		};
	}

	return (
		href ? (
			<use
				{...offset}
				{...size}
				xlinkHref={href}
			    onMouseEnter={handleMouseEnter}
			    onMouseMove={handleMouseMove}
			    onMouseOut={handleMouseOut}
			/>
		) : null
	);
}

FloorTile.propTypes = {
	symbol: React.PropTypes.string.isRequired,
	variant: React.PropTypes.string,
	row: React.PropTypes.number.isRequired,
	col: React.PropTypes.number.isRequired,
	rowSize: React.PropTypes.number,
	colSize: React.PropTypes.number,
	tooltip: React.PropTypes.string,
	showTooltip: React.PropTypes.func,
	moveTooltip: React.PropTypes.func,
	hideTooltip: React.PropTypes.func,
};