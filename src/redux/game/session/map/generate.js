import padStart from "../../../../js/utils/padStart";

import NameGenerator from "./generators/name";
import generateCost from "./generators/cost";
import generateRent from "./generators/rent";

export default function generate(state) {
	const nameGenerator = NameGenerator();

	let newState = state;

	for (let side of ["S", "W", "N", "E"]) {
		// Each side has 9 lot
		for (let i = 0; i < 9; i++) {
			// Id
			const index = `${padStart(i.toString(), 2, "0")}`; // Zero padded
			const id = `LOT-${side}${index}`;

			// Select lot object
			const oldLot = state[id];

			// Generate properties
			const cost = generateCost();
			const rent = generateRent(cost);

			// Merge new properties
			const newLot = oldLot.merge({
				name: nameGenerator.next().value,
				cost: cost,
				rent: rent,
			}, { deep: true });

			// Merge modified object to form new state
			newState = newState.merge({ [id]: newLot }, { deep: true });
		}
	}

	return newState;
}