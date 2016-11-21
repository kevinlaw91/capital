import { getTopFaceMidpoint } from "game/map/coordinates";

export function mappedTile(lotId) {
	// Test to see if location is a property lot
	// and attempt to extract fields from it
	const lot = /LOT-(N|S|E|W)(\d{2})/.exec(lotId);

	if (lot) {
		// Location id represents a property lot
		// Extract side and index from it
		const [/* skip */, side, idx] = lot;

		// Strip zero padding
		let i = Number(idx);

		switch (side) {
			case "S": return { x: 12 - i, y: 15 };
			case "W": return { x: 1, y: 12 - i };
			case "N": return { x: 4 + i, y: 1 };
			case "E": return { x: 15, y: 4 + i };
		}
	}
}

/**
 * @param lotId
 * @return {{x: number, y: number}} Screen offset
 */
export function getScreenOffset(lotId) {
	// Based on the id, get the grid x,y for placing the building sprite
	const grid = mappedTile(lotId);

	// Transform grid x,y to screen x,y
	return getTopFaceMidpoint(grid.y, grid.x);
}