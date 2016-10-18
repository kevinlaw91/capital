import padStart from "../../../../js/utils/padStart";

// Initial map definition (untouched)
const map = {};
export default map;

for (let side of ["S", "W", "N", "E"]) {
	// Each side has 9 lot
	for (let i = 0; i < 9; i++) {
		// Generate id
		let index = `${padStart(i.toString(), 2, "0")}`; // Zero padded
		let id = `LOT-${side}${index}`;

		// Store entry
		map[id] = {
			id: id,
			tradable: true,
		};
	}
}