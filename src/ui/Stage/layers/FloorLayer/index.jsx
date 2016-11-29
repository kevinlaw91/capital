import { getScreenVertexOffset } from "game/map/coordinates";
import SVGFilterBrightness from "ui/Stage/filters/SVGFilterBrightness";
import * as Border from "./components/Border";
import * as Side from "./components/Sides";
import * as Corner from "./components/Corners";

export default function FloorLayer() {
	return (
		<g>
			<SVGFilterBrightness id="FloorLayerTileHoverEffect" value="1.3" />
			<Border.Back />
			<Corner.Top />
			<Side.West />
			<Side.North />
			<Corner.Left />
			<polygon /* Center blank piece, bottom face */
				points={
					[
						getScreenVertexOffset(4, 4, "N").join(","),
						getScreenVertexOffset(4, 12, "E").join(","),
						getScreenVertexOffset(4, 12, "R").join(","),
						getScreenVertexOffset(12, 12, "B").join(","),
						getScreenVertexOffset(12, 4, "L").join(","),
						getScreenVertexOffset(12, 4, "W").join(","),
					].join(" ")
				}
				fill="#61a038"
			/>
			<polygon /* Center blank piece, top face */
				points={
					[
						getScreenVertexOffset(4, 4, "N").join(","),
						getScreenVertexOffset(4, 12, "E").join(","),
						getScreenVertexOffset(12, 12, "S").join(","),
						getScreenVertexOffset(12, 4, "W").join(","),
					].join(" ")
				}
				fill="#9acf5c"
			/>
			<Corner.Right />
			<Side.South />
			<Side.East />
			<Corner.Bottom />
			<Border.Front />
		</g>
	);
}
