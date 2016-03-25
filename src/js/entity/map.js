define([
	"jquery",
	"entity/lot",
	"entity/lot_tradable",
    "utils"
], function($, Lot, TradableLot) {
	'use strict';
	return {
		/**
		 * Generates and return a map definition array
		 * @returns {Lot[]}
		 */
		generate: function(){
			// Import Utils
			var Utils = require("utils");

			/**
			 * Returns a standard normal (gaussian) random number generator function
			 * Generator was implemented using Marsaglia polar method
			 */
			function gaussian( mean, stDev ) {
				return function() {
					var y, u, v, s;
					do {
						u = 2.0 * Math.random() - 1.0;
						v = 2.0 * Math.random() - 1.0;
						s = u * u + v * v;
					}
					while(s>=1.0 || s===0);
					s = Math.sqrt((-2.0 * Math.log(s)) / s);
					y = u * s; // Interchangeable with v * s
					return mean + stDev * y;
				};
			}

			function randomAmount(dist, min, max){
				// Increment of 100
				var unit = 100;
				// ~~ was used to strip decimals
				return Utils.clamp(~~(dist()/unit)*unit,min,max);
			}

			/**
			 * Map Generator
			 */
			time("Generate Map For New Game");

			/**
			 * Map definition
			 * @type {Lot[]}
			 */
			var map = [];

			// Constants
			var tradable = { tradable: true },
			    nd = {
				    /**
				     * Normal distributions
				     *
				     * arg1 = mean, expected average of output
				     * arg2 = stDev, range of output +/- from mean
				     */
					land: gaussian(7000,3000),
					upg1: gaussian(2500,1500),
					upg2: gaussian(1500,1000),
					upg3: gaussian(2800,2000),
					upg4: gaussian(3000,1500)
			    };

			function generateCost(){
				var cost_land = randomAmount(nd.land,1000,13000),
				cost_upgrade1 = randomAmount(nd.upg1,500,4500),
				cost_upgrade2 = cost_upgrade1 + randomAmount(nd.upg2,500,2500),
				cost_upgrade3 = cost_upgrade2 + randomAmount(nd.upg3,1000,3000),
				cost_upgrade4 = cost_upgrade3 + randomAmount(nd.upg4,1500,4000);

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
					pos: { x: 13, y: 13},
					b:   { x: 15, y: 15},
					tradable: false
				})
			);

			// Lot in south west
			for(i=12; i>=4; i--){
				map.push(
					new TradableLot(
						$.extend(tradable, generateCost(), {
							pos: { x: i, y: 13},
							b:   { x: i, y: 15},
							direction: Lot.prototype.FACING_NORTH
						})
					)
				);
			}

			// West corner
			map.push(
				new Lot({
					id: "MAP-CORNER-1",
					pos: { x: 3, y: 13},
					b:   { x: 1, y: 15},
					tradable: false
				})
			);

			// Lot in north west
			for(i=12; i>=4; i--){
				map.push(
					new TradableLot(
						$.extend(tradable, generateCost(), {
							pos: { x: 3, y: i},
							b:   { x: 1, y: i},
							direction: Lot.prototype.FACING_EAST
						})
					)
				);
			}

			// North corner
			map.push(
				new Lot({
					id: "MAP-CORNER-2",
					pos: { x: 3, y: 3},
					b:   { x: 1, y: 1},
					tradable: false
				})
			);

			// Lot in north east
			for(i=4; i<=12; i++){
				map.push(
					new TradableLot(
						$.extend(tradable, generateCost(), {
							pos: { x: i, y: 3},
							b:   { x: i, y: 1},
							direction: Lot.prototype.FACING_SOUTH
						})
					)
				);
			}

			// East corner
			map.push(
				new Lot({
					id: "MAP-CORNER-3",
					pos: { x: 13, y: 3},
					b:   { x: 15, y: 1},
					tradable: false
				})
			);

			// Lot in south east
			for(i=4; i<=12; i++){
				map.push(
					new TradableLot(
						$.extend(tradable, generateCost(), {
							pos: { x: 13, y: i},
							b:   { x: 15, y: i},
							direction: Lot.prototype.FACING_WEST
						})
					)
				);
			}

			timeEnd("Generate Map For New Game");
			return map;
		}
	};
});