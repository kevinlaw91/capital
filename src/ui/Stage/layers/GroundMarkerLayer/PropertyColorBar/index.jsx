import WorldCanvas from "ui/Stage/layers/components/WorldCanvas";
import { getVertexOffset } from "game/map/coordinates";
import { getScreenOffset } from "game/map/tile/colorPosition";
import Line from "js/helpers/Line";

export default function PropertyColorBar(props) {
	// Extract side from location id
	const lot = /LOT-(N|S|E|W)\d+/.exec(props.location);
	const side = lot[1];

	// Offset for WorldCanvas
	const [tileOffsetX, tileOffsetY] = getScreenOffset(props.location);

	// Polygon points
	let n = getVertexOffset("N");
	let w = getVertexOffset("W");
	let s = getVertexOffset("S");
	let e = getVertexOffset("E");

	// Width as ratio
	const r = PropertyColorBar.WIDTH;

	// Modify polygon points to create color bar
	switch (side) {
		case "N":
			n = new Line(w, n).getPointByRatio(r);
			e = new Line(s, e).getPointByRatio(r);
			break;
		case "E":
			s = new Line(w, s).getPointByRatio(r);
			e = new Line(n, e).getPointByRatio(r);
			break;
		case "S":
			w = new Line(n, w).getPointByRatio(r);
			s = new Line(e, s).getPointByRatio(r);
			break;
		case "W":
			n = new Line(e, n).getPointByRatio(r);
			w = new Line(s, w).getPointByRatio(r);
			break;
	}

	return (
		<WorldCanvas x={tileOffsetX} y={tileOffsetY}>
			<polygon points={[n, w, s, e].join(" ")} fill={props.color} />
		</WorldCanvas>
	);
}

PropertyColorBar.WIDTH = 0.15;

PropertyColorBar.defaultProps = {
	color: "white",
};

PropertyColorBar.propTypes = {
	color: React.PropTypes.string,
	location: React.PropTypes.string,
};
