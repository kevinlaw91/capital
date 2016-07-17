define([
	"jquery",
	"entity/lot",
	"entity/lot-tradable",
	"utils"
], function($, Lot, TradableLot) {
	"use strict";

	var LocationNames = [];

	function resetLocationNamePool() {
		// Must be at least 36 names
		LocationNames = [
			"Al Zaco Creek",
			"Azral Canyon",
			"Boulevard Road",
			"Cape Loop",
			"Cape Rolnard",
			"Carole Bay",
			"Cattown Road",
			"Central Road",
			"Chamont Town",
			"Champs Pass",
			"Cobbs Creek",
			"Coin Road",
			"Dorkov Bay",
			"Downtown Troyes",
			"East Lake",
			"Esteryn Street",
			"Fox Valley",
			"Harbour Road",
			"Juniper Bay",
			"Miracle Hills",
			"Mont Alice",
			"Moon Hill",
			"Mormont Valley",
			"Newton Road",
			"Northwood Valley",
			"Ostgate Street",
			"Ox River",
			"Reed Lake",
			"Ruby Valley",
			"Saint Viborg",
			"Sun Castle",
			"Tales Lake",
			"Vintage Creek",
			"Weldon Park",
			"Westway Town",
			"Winter Lagoon"
		];
	}

	function getRandomName() {
		// Reset name pool if no more unique name is available
		if (LocationNames.length === 0) {
			resetLocationNamePool();
		}

		// Get a unique name from pool
		var randomId = Math.floor(Math.random()*LocationNames.length),
			randomName = LocationNames.splice(randomId, 1);

		return randomName[0];
	}

	/**
	 * Generates and return a map definition array
	 * @returns {Array.<Lot|TradableLot>}
	 */
	return function() {
		// Imports
		var Utils = require("utils");

		/**
		 * Returns a standard normal (gaussian) random number generator function
		 * Generator was implemented using Marsaglia polar method
		 */
		function gaussian(mean, stDev) {
			return function() {
				var y, u, v, s;

				do {
					u = (2.0 * Math.random()) - 1.0;
					v = (2.0 * Math.random()) - 1.0;
					s = (u * u) + (v * v);
				} while (s>=1.0 || s===0);

				s = Math.sqrt((-2.0 * Math.log(s)) / s);
				y = u * s; // Interchangeable with v * s

				return mean + (stDev * y);
			};
		}

		function randomAmount(dist, min, max) {
			// Increment of 100
			var unit = 100;

			return Utils.clamp(~~(dist() / unit) * unit, min, max); // ~~ was used to strip decimals
		}

		// Benchmark
		console.time("Generate Map For New Game");

		/**
		 * Map definition
		 * @type {Array.<Lot|TradableLot>}
		 */
		var map = [];

		// Expected range
		// [Min, Average, Max]
		var expected = {
			land: [300, 1800, 3000],
			upg1: [500, 1250, 2000],
			upg2: [700, 2000, 3500],
			upg3: [1500, 2250, 4500],
			upg4: [2000, 3500, 6000]
		};

		/**
		 * Normal distributions
		 * arg1: mean, expected average of output
		 * arg2: stDev, range of output +/- from mean
		 */
		var nd = {
			land: gaussian(expected.land[1], (expected.land[2] - expected.land[0]) / 2),
			upg1: gaussian(expected.upg1[1], (expected.upg1[2] - expected.upg1[0]) / 2),
			upg2: gaussian(expected.upg2[1], (expected.upg2[2] - expected.upg2[0]) / 2),
			upg3: gaussian(expected.upg3[1], (expected.upg3[2] - expected.upg3[0]) / 2),
			upg4: gaussian(expected.upg4[1], (expected.upg4[2] - expected.upg4[0]) / 2)
		};

		function generateCost() {
			var cost_land = randomAmount(nd.land, expected.land[0], expected.land[2]),
				cost_upgrade1 = randomAmount(nd.upg1, expected.upg1[0], expected.upg1[2]),
				cost_upgrade2 = cost_upgrade1 + randomAmount(nd.upg2, expected.upg2[0], expected.upg2[2]),
				cost_upgrade3 = cost_upgrade2 + randomAmount(nd.upg3, expected.upg3[0], expected.upg3[2]),
				cost_upgrade4 = cost_upgrade3 + randomAmount(nd.upg4, expected.upg4[0], expected.upg4[2]);

			return {
				cost: [
					cost_land,
					cost_upgrade1,
					cost_upgrade2,
					cost_upgrade3,
					cost_upgrade4
				]
			};
		}

		var i;

		// South corner
		map.push(
			new Lot({
				id: "MAP-CORNER-0",
				pos: { x: 13, y: 13 },
				b: { x: 15, y: 15 },
				tradable: false
			})
		);

		// Lot in south west
		for (i=12; i>=4; i--) {
			map.push(
				new TradableLot(
					$.extend(generateCost(), {
						name: getRandomName(),
						pos: { x: i, y: 13 },
						b: { x: i, y: 15 },
						direction: Lot.prototype.FACING_NORTH
					})
				)
			);
		}

		// West corner
		map.push(
			new Lot({
				id: "MAP-CORNER-1",
				pos: { x: 3, y: 13 },
				b: { x: 1, y: 15 },
				tradable: false
			})
		);

		// Lot in north west
		for (i=12; i>=4; i--) {
			map.push(
				new TradableLot(
					$.extend(generateCost(), {
						name: getRandomName(),
						pos: { x: 3, y: i },
						b: { x: 1, y: i },
						direction: Lot.prototype.FACING_EAST
					})
				)
			);
		}

		// North corner
		map.push(
			new Lot({
				id: "MAP-CORNER-2",
				pos: { x: 3, y: 3 },
				b: { x: 1, y: 1 },
				tradable: false
			})
		);

		// Lot in north east
		for (i=4; i<=12; i++) {
			map.push(
				new TradableLot(
					$.extend(generateCost(), {
						name: getRandomName(),
						pos: { x: i, y: 3 },
						b: { x: i, y: 1 },
						direction: Lot.prototype.FACING_SOUTH
					})
				)
			);
		}

		// East corner
		map.push(
			new Lot({
				id: "MAP-CORNER-3",
				pos: { x: 13, y: 3 },
				b: { x: 15, y: 1 },
				tradable: false
			})
		);

		// Lot in south east
		for (i=4; i<=12; i++) {
			map.push(
				new TradableLot(
					$.extend(generateCost(), {
						name: getRandomName(),
						pos: { x: 13, y: i },
						b: { x: 15, y: i },
						direction: Lot.prototype.FACING_WEST
					})
				)
			);
		}

		// End Benchmark
		console.timeEnd("Generate Map For New Game");

		return map;
	};
});