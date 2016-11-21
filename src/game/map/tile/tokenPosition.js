import { getTopFaceMidpoint } from "game/map/coordinates";

export function mappedTile(locationId) {
	// Test to see if location is a property lot
	// and attempt to extract fields from it
	const lot = /LOT-(N|S|E|W)(\d+)/.exec(locationId);

	if (lot) {
		// Location id represents a property lot
		// Extract side and index from it
		const [/* skip */, side, i] = lot;

		// Convert to number
		const idx = Number(i);

		switch (side) {
			case "S": return { x: 12 - idx, y: 13 };
			case "W": return { x: 3, y: 12 - idx };
			case "N": return { x: 4 + idx, y: 3 };
			case "E": return { x: 13, y: 4 + idx };
		}
	} else {
		// Not property lot
		switch (locationId) {
			case "CORNER-BOTTOM": return { x: 13, y: 13 };
			case "CORNER-LEFT": return { x: 3, y: 13 };
			case "CORNER-RIGHT": return { x: 13, y: 3 };
			case "CORNER-TOP": return { x: 3, y: 3 };
		}
	}
}

/**
 * @param locationId
 * @return {{x: number, y: number}} Screen offset
 */
export function getScreenOffset(locationId) {
	// Based on the id, get the grid x,y for placing the token
	const grid = mappedTile(locationId);

	// Transform grid x,y to screen x,y
	return getTopFaceMidpoint(grid.y, grid.x);
}