import { getBoundingOffset } from "game/map/coordinates";

export function mappedTile(lotId) {
	// Test to see if location is a property lot
	// and attempt to extract fields from it
	const lot = /LOT-(N|S|E|W)(\d+)/.exec(lotId);

	if (lot) {
		// Location id represents a property lot
		// Extract side and index from it
		const [/* skip */, side, i] = lot;

		// Convert to number
		const idx = Number(i);

		switch (side) {
			case "S": return { x: 12 - idx, y: 16 };
			case "W": return { x: 0, y: 12 - idx };
			case "N": return { x: 4 + idx, y: 0 };
			case "E": return { x: 16, y: 4 + idx };
		}
	}
}


/**
 * @param locationId
 * @return {number[]} Screen offset
 */
export function getScreenOffset(locationId) {
	// Based on the id, get the grid x,y of the tile
	const tile = mappedTile(locationId);

	// Transform grid x,y to screen x,y
	return getBoundingOffset(tile.y, tile.x);
}
