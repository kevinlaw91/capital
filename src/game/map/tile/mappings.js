const map = {
	// Corners
	"CORNER-BOTTOM": "TILE-CORNER-BOTTOM",
	"CORNER-LEFT": "TILE-CORNER-LEFT",
	"CORNER-TOP": "TILE-CORNER-TOP",
	"CORNER-RIGHT": "TILE-CORNER-RIGHT",

	// South
	"LOT-S8": "TILE-SOUTH-4",
	"LOT-S7": "TILE-SOUTH-5",
	"LOT-S6": "TILE-SOUTH-6",
	"LOT-S5": "TILE-SOUTH-7",
	"LOT-S4": "TILE-SOUTH-8",
	"LOT-S3": "TILE-SOUTH-9",
	"LOT-S2": "TILE-SOUTH-10",
	"LOT-S1": "TILE-SOUTH-11",
	"LOT-S0": "TILE-SOUTH-12",

	// West
	"LOT-W8": "TILE-WEST-4",
	"LOT-W7": "TILE-WEST-5",
	"LOT-W6": "TILE-WEST-6",
	"LOT-W5": "TILE-WEST-7",
	"LOT-W4": "TILE-WEST-8",
	"LOT-W3": "TILE-WEST-9",
	"LOT-W2": "TILE-WEST-10",
	"LOT-W1": "TILE-WEST-11",
	"LOT-W0": "TILE-WEST-12",

	// North
	"LOT-N0": "TILE-NORTH-4",
	"LOT-N1": "TILE-NORTH-5",
	"LOT-N2": "TILE-NORTH-6",
	"LOT-N3": "TILE-NORTH-7",
	"LOT-N4": "TILE-NORTH-8",
	"LOT-N5": "TILE-NORTH-9",
	"LOT-N6": "TILE-NORTH-10",
	"LOT-N7": "TILE-NORTH-11",
	"LOT-N8": "TILE-NORTH-12",

	// East
	"LOT-E0": "TILE-EAST-4",
	"LOT-E1": "TILE-EAST-5",
	"LOT-E2": "TILE-EAST-6",
	"LOT-E3": "TILE-EAST-7",
	"LOT-E4": "TILE-EAST-8",
	"LOT-E5": "TILE-EAST-9",
	"LOT-E6": "TILE-EAST-10",
	"LOT-E7": "TILE-EAST-11",
	"LOT-E8": "TILE-EAST-12",
};

// Map from entity id to tile id
export const getTileId = lotId => map[lotId];

// Map from tile id to entity id
export const getLotId = tileId => Object.keys(map).filter(key => map[key] === tileId)[0];