import { connect } from "react-redux";
import { getVertexOffset } from "../../utils/coordinates";
import renderTile from "./utils/renderTile";

function FloorLayer(props) {
	return (
		<g>
			{ renderTile(props.topCorner) }
			{ props.west.map(renderTile) }
			{ props.north.map(renderTile) }
			{ renderTile(props.leftCorner) }
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
			{ renderTile(props.rightCorner) }
			{ props.south.map(renderTile) }
			{ props.east.map(renderTile) }
			{ renderTile(props.bottomCorner) }
		</g>
	);
}

FloorLayer.propTypes = {
	foregroundBorder: React.PropTypes.array,
	backgroundBorder: React.PropTypes.array,
	topCorner: React.PropTypes.object,
	leftCorner: React.PropTypes.object,
	rightCorner: React.PropTypes.object,
	bottomCorner: React.PropTypes.object,
	south: React.PropTypes.array,
	west: React.PropTypes.array,
	north: React.PropTypes.array,
	east: React.PropTypes.array,
};

const mapStateToProps = (state) => {
	let f = state.game.floor;

	return {
		topCorner: f.corners.top,
		leftCorner: f.corners.left,
		rightCorner: f.corners.right,
		bottomCorner: f.corners.bottom,
		south: f.south,
		west: f.west,
		north: f.north,
		east: f.east,
	};
};

export default connect(mapStateToProps)(FloorLayer);