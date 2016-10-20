// Initial map definition (untouched)
const map = {};
export default map;

for (let side of ["S", "W", "N", "E"]) {
	// Each side has 9 lot
	for (let i = 0; i < 9; i++) {
		// Generate id
		const id = `LOT-${side}${i}`;

		// Store entry
		map[id] = {};
	}
}