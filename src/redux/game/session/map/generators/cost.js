import clamp from "../../../../../js/utils/clamp";
import g from "../../../../../js/utils/gaussian";
import round100 from "../../../../../js/utils/round100";

// Buy land lot
const TIER_0 = {
	min: 300,
	avg: 1800,
	max: 3000,
};
// Upgrade to tier 1
const TIER_1 = {
	min: 500,
	avg: 1250,
	max: 2000,
};
// Upgrade to tier 2
const TIER_2 = {
	min: 700,
	avg: 2000,
	max: 3500,
};
// Upgrade to tier 3
const TIER_3 = {
	min: 1500,
	avg: 2250,
	max: 4500,
};
// Upgrade to tier 4
const TIER_4 = {
	min: 2000,
	avg: 3500,
	max: 6000,
};

// Gaussian random sampler
function gRandom(min, avg, max) {
	// Generate a number using gaussian random sampler
	const rnd = g(avg, (max - min) / 2);

	// Clamp generated number to stay in between min and max
	// Then round to increments of 100
	return round100(clamp(rnd, min, max));
}

/*
 * Cost were generated using sampling from normal distribution.
 * Cost to upgrade to tier 1 does not affected by the cost needed to buy the land.
 * Upgrade cost were incremental, e.g. tier 2 upgrade cost is higher than tier 1 upgrade cost.
 */

export default function generate() {
	let cost = [
		// Land
		gRandom(TIER_0.min, TIER_0.avg, TIER_0.max),
		// Upgrades
		gRandom(TIER_1.min, TIER_1.avg, TIER_1.max),
		gRandom(TIER_2.min, TIER_2.avg, TIER_2.max),
		gRandom(TIER_3.min, TIER_3.avg, TIER_3.max),
		gRandom(TIER_4.min, TIER_4.avg, TIER_4.max),
	];

	// Make sure upgrade costs are incremental
	cost = cost.map(function (v, index, arr) {
		// Only process TIER_2 and up
		// because TIER_1 (upgrade) cost was independent from TIER_0 (buy)
		if (index >= 2) {
			// Upgrade cost from each tier were added with previous tier
			// to simulate incremental values
			let prev = arr[index - 1];

			return v + prev;
		}

		return v;
	});


	return {
		// Buy
		BUY: cost[0],
		// Upgrades
		UPGRADE: {
			TIER_1: cost[1],
			TIER_2: cost[2],
			TIER_3: cost[3],
			TIER_4: cost[4],
		},
	};
}