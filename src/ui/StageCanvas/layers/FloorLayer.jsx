import { connect } from "react-redux";
import FloorTile from "./components/FloorTile";
import { getVertexOffset } from "../../utils/coordinates";

// Render map tiles
const renderMapTiles = (entry) => {
	const { id, ...other } = entry;

	return (
		<FloorTile key={id} {...other} />
	);
};

function FloorLayer(props) {
	return (
		<g>
			{ props.background.map(renderMapTiles) }
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
			{ props.foreground.map(renderMapTiles) }
		</g>
	);
}

FloorLayer.propTypes = {
	foreground: React.PropTypes.array,
	background: React.PropTypes.array,
};

const mapStateToProps = (state) => {
	return {
		foreground: state.game.floor.foreground,
		background: state.game.floor.background,
	};
};

export default connect(mapStateToProps)(FloorLayer);