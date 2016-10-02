import { connect } from "react-redux";
import { getVertexOffset } from "../coordinates";
import classNames from "classnames/bind";
import styles from "./FloorLayer.scss";

let cx = classNames.bind({
	"crisp": styles.crisp,
});

// Default tile size
import { GRID_TILESIZE } from "../coordinates";

// Render map tiles
const renderMapTiles = (entry) => {
	let href = `#${entry.symbol}` + (entry.variant ? `-${entry.variant}` : "");
	let className = cx({
		"crisp": entry.shapeRendering,
	});

	return (
		<use
			key={entry.id}
			x={entry.x}
			y={entry.y}
			width={entry.width || GRID_TILESIZE}
			height={entry.height || GRID_TILESIZE}
			xlinkHref={href}
			className={className}
		/>
	);
};

function FloorLayer(props) {
	return (
		<g>
			{ props.background.map(renderMapTiles)}
			<polygon /* Center blank piece, bottom face */
				points={
					[
						getVertexOffset(4, 4, "N").join(","),
						getVertexOffset(4, 12, "E").join(","),
						getVertexOffset(4, 12, "R").join(","),
						getVertexOffset(12, 12, "B").join(","),
						getVertexOffset(12, 4, "L").join(","),
						getVertexOffset(12, 4, "W").join(","),
					].join(" ")
				}
			    fill="#61a038"
			/>
			<polygon /* Center blank piece, top face */
				points={
					[
						getVertexOffset(4, 4, "N").join(","),
						getVertexOffset(4, 12, "E").join(","),
						getVertexOffset(12, 12, "S").join(","),
						getVertexOffset(12, 4, "W").join(","),
					].join(" ")
				}
			    fill="#9acf5c"
			/>
			{ props.foreground.map(renderMapTiles)}
		</g>
	);
}

FloorLayer.propTypes = {
	foreground: React.PropTypes.array,
	background: React.PropTypes.array,
};

const mapStateToProps = (state) => {
	return {
		foreground: state.floor.foreground,
		background: state.floor.background,
	};
};

export default connect(mapStateToProps)(FloorLayer);