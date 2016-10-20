import round100 from "./utils/round100";
import summation from "./utils/summation";

// Rental rates were influenced by cost
// Cost of each tier were incremental
export default function (cost) {
	// Import generated cost for calculation
	const COST_BUY = cost["TIER_0"];
	const COST_UPG1 = cost["TIER_1"];
	const COST_UPG2 = cost["TIER_2"];
	const COST_UPG3 = cost["TIER_3"];
	const COST_UPG4 = cost["TIER_4"];

	// Rates
	let rent = [
		COST_BUY * (Math.random() + 0.5),
		COST_UPG1 * (Math.random() / 2),
		COST_UPG2 * (Math.random() / 1.8),
		COST_UPG3 * (Math.random() / 1.4),
		COST_UPG4 * (Math.random() / 1.1),
	];

	rent = rent.map(function (v, idx, arr) {
		// An array of every value from index 0 to idx
		const prevValues = arr.slice(0, idx + 1);

		// Rent of each tier were added with previous tier
		const sum = prevValues.reduce(summation);

		// Round result to increments of 100
		return round100(sum);
	});

	return {
		TIER_0: rent[0],
		TIER_1: rent[1],
		TIER_2: rent[2],
		TIER_3: rent[3],
		TIER_4: rent[4],
	};
}