import { GRID_COL, GRID_ROW } from "../../../utils/coordinates";

import FloorTile from "./FloorTile";

// Border tiles
const BORDER_BG = [];
const BORDER_FG = [];
let id = 0, r, c;

// North border
r = 0; c = 0;
for (; c < GRID_COL; c++) {
	BORDER_BG.push({
		col: c, row: r,
		id: "TILE-BORDER-B-" + ++id,
		symbol: "concrete",
		variant: "01",
	});
}

// West border
r = 1; c = 0;
for (; r < GRID_ROW; r++) {
	BORDER_BG.push({
		col: c, row: r,
		id: "TILE-BORDER-B-" + ++id,
		symbol: "concrete",
		variant: "01",
	});
}

// South border
r = 16; c = 1;
for (; c < GRID_COL; c++) {
	BORDER_FG.push({
		col: c, row: r,
		id: "TILE-BORDER-F-" + ++id,
		symbol: "concrete",
		variant: "01",
	});
}

// East border
r = 1; c = 16;
for (; r < GRID_ROW; r++) {
	BORDER_FG.push({
		col: c, row: r,
		id: "TILE-BORDER-F-" + ++id,
		symbol: "concrete",
		variant: "01",
	});
}

// Render crisp quality
const crisp = { shapeRendering: "crispEdges" };

export const Back = () => (
	<g style={crisp}> {
		BORDER_BG.map(({ id, ...props }) =>
			<FloorTile key={id} {...props} />
		)
	} </g>
);

export const Front = () => (
	<g style={crisp}> {
		BORDER_FG.map(({ id, ...props }) =>
			<FloorTile key={id} {...props} />
		)
	} </g>
);