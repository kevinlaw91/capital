import round100 from "../../../../../js/utils/round100";

// Calculate sum of previous values from array
const sumOfPreviousValues = (prev, cur) => prev + cur;

/*
 * Rental rate were influenced by cost.
 * The higher the cost for purchase/upgrade, the higher the rental rate
 */

export default function generate(cost) {
	// Import generated cost for calculation
	const COST_BUY = cost["BUY"];
	const COST_UPG1 = cost["UPGRADE"]["TIER_1"];
	const COST_UPG2 = cost["UPGRADE"]["TIER_2"];
	const COST_UPG3 = cost["UPGRADE"]["TIER_3"];
	const COST_UPG4 = cost["UPGRADE"]["TIER_4"];

	// Rates
	let rent = [
		COST_BUY * (Math.random() + 0.5),
		COST_UPG1 * (Math.random() / 2),
		COST_UPG2 * (Math.random() / 1.8),
		COST_UPG3 * (Math.random() / 1.4),
		COST_UPG4 * (Math.random() / 1.1),
	];

	rent = rent.map(function (v, idx, arr) {
		// An array of very value from index 0 to idx
		const preValues = arr.slice(0, idx + 1);

		// Rent of each tier were added with previous tier
		const sum = preValues.reduce(sumOfPreviousValues);

		// Round result to increments of 100
		return round100(sum);
	});

	return {
		// Land
		TIER_0: rent[0],
		// Upgraded
		TIER_1: rent[1],
		TIER_2: rent[2],
		TIER_3: rent[3],
		TIER_4: rent[4],
	};
}