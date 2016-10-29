export default function (locationId) {
	// Test to see if location is a property lot
	// and attempt to extract fields from it
	const lot = /LOT-(N|S|E|W)(\d+)/.exec(locationId);

	if (lot) {
		// Location id represents a property lot
		// Extract side and index from it
		const [/* skip */, side, i] = lot;

		switch (side) {
			case "S": return { x: 12 - i, y: 13 };
			case "W": return { x: 3, y: 12 - i };
			case "N": return { x: 4 + i, y: 3 };
			case "E": return { x: 13, y: 4 + i };
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