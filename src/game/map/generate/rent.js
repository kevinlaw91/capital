import round100 from "./utils/round100";
import summation from "./utils/summation";

/**
 * Generate rent
 * @param {number} price - Purchase price
 * @param {Object.<Tier, number>} upgrades - Upgrade cost by tier
 * @return {Object.<Tier, number>} Rent of all tiers
 */
export default function (price, upgrades) {
	// Rent were influenced by upgrade cost/purchase price
	let rent = [
		// Purchase price
		price * (Math.random() + 0.5),
		// Upgrades
		upgrades["1"] * (Math.random() / 2),
		upgrades["2"] * (Math.random() / 1.8),
		upgrades["3"] * (Math.random() / 1.4),
		upgrades["4"] * (Math.random() / 1.1),
	];

	// Stack rent of each tiers to make it incremental
	let output = rent.map(function (v, idx, arr) {
		// An array of every value from index 0 to idx
		const prevValues = arr.slice(0, idx + 1);

		// Rent of each tier were added with previous tier
		const sum = prevValues.reduce(summation);

		// Round result to increments of 100
		return round100(sum);
	});

	// Convert to object
	return Object.assign({}, output);
}