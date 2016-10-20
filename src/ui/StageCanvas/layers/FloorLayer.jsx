import { connect } from "react-redux";
import { getVertexOffset } from "../../utils/coordinates";
import renderTile from "./utils/renderTile";

const RENDER_CORNER = (id, props) => {
	switch (id) {
		case "TILE-CORNER-BOTTOM":
			return renderTile(
				props.merge({
					id,
					col: 13,
					row: 13,
					rowSize: 3,
					colSize: 3,
					square: true,
				})
			);

		case "TILE-CORNER-LEFT":
			return renderTile(
				props.merge({
					id,
					col: 1,
					row: 13,
					rowSize: 3,
					colSize: 3,
					square: true,
				})
			);

		case "TILE-CORNER-TOP":
			return renderTile(
				props.merge({
					id,
					col: 1,
					row: 1,
					rowSize: 3,
					colSize: 3,
					square: true,
				})
			);

		case "TILE-CORNER-RIGHT":
			return renderTile(
				props.merge({
					id,
					col: 13,
					row: 1,
					rowSize: 3,
					colSize: 3,
					square: true,
				})
			);
	}
};

// Regexp to extract index from tile id
const lotIndex = /\d+$/;

const RENDER_TILE_WEST = ([id, { ...tileProps }]) => {
	return renderTile({
		id: id,
		row: Number(id.match(lotIndex)[0]),
		col: 1,
		rowSize: 1,
		colSize: 3,
		...tileProps
	});
};

const RENDER_TILE_NORTH = ([id, { ...tileProps }]) => {
	return renderTile({
		id: id,
		row: 1,
		col: Number(id.match(lotIndex)[0]),
		rowSize: 3,
		colSize: 1,
		...tileProps
	});
};

const RENDER_TILE_SOUTH = ([id, { ...tileProps }]) => {
	return renderTile({
		id: id,
		row: 13,
		col: Number(id.match(lotIndex)[0]),
		rowSize: 3,
		colSize: 1,
		...tileProps
	});
};

const RENDER_TILE_EAST = ([id, { ...tileProps }]) => {
	return renderTile({
		id: id,
		row: Number(id.match(lotIndex)[0]),
		col: 13,
		rowSize: 1,
		colSize: 3,
		...tileProps
	});
};

function FloorLayer(props) {
	return (
		<g>
			{ RENDER_CORNER("TILE-CORNER-TOP", props.corners["TILE-CORNER-TOP"]) }
			{ Object.entries(props.west).map(RENDER_TILE_WEST) }
			{ Object.entries(props.north).map(RENDER_TILE_NORTH) }
			{ RENDER_CORNER("TILE-CORNER-LEFT", props.corners["TILE-CORNER-LEFT"]) }
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
			{ RENDER_CORNER("TILE-CORNER-RIGHT", props.corners["TILE-CORNER-RIGHT"]) }
			{ Object.entries(props.south).map(RENDER_TILE_SOUTH) }
			{ Object.entries(props.east).map(RENDER_TILE_EAST) }
			{ RENDER_CORNER("TILE-CORNER-BOTTOM", props.corners["TILE-CORNER-BOTTOM"]) }
		</g>
	);
}

const PROPTYPES_TILE = React.PropTypes.shape({
	symbol: React.PropTypes.string,
	variant: React.PropTypes.string,
});

FloorLayer.propTypes = {
	corners: React.PropTypes.objectOf(PROPTYPES_TILE),
	south: React.PropTypes.objectOf(PROPTYPES_TILE),
	west: React.PropTypes.objectOf(PROPTYPES_TILE),
	north: React.PropTypes.objectOf(PROPTYPES_TILE),
	east: React.PropTypes.objectOf(PROPTYPES_TILE),
};

const mapStateToProps = (state) => {
	let f = state.game.stage.floor;

	return {
		corners: f.corners,
		south: f.south,
		west: f.west,
		north: f.north,
		east: f.east,
	};
};

export default connect(mapStateToProps)(FloorLayer);