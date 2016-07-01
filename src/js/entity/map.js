define([
	"game/script/map-generator"
], function() {
	"use strict";

	return /** @module entity/map */{
		/**
		 * Generated Lot collection
		 * @type Array.<(Lot|TradableLot)>
		 */
		lot: null,

		/**
		 * Staring point for player
		 * Generated when calling
		 * @see #generate
		 */
		startingPoint: null,

		/**
		 * Generate a new map
		 * @requires module:game/script/map-generator
		 */
		generate: function() {
			// Generate map
			this.lot = require("game/script/map-generator")();

			// Set starting point
			this.startingPoint = this.lot[0];
		},

		/**
		 * Query for lot matching the specified grid position
		 * @param x
		 * @param y
		 * @returns {Lot|TradableLot|undefined}
		 */
		match: function(x, y) {
			return this.lot.find(
				function(Lot) {
					return (Lot.x === x && Lot.y === y);
				}
			);
		},

		/**
		 * Get the index of a matching lot by searching in the generated lot collection
		 * @param {{number, number}|(Lot|TradableLot)} args
		 * @returns {Lot|TradableLot|undefined}
		 */
		findIndex: function(args) {
			// Assume Lot instance was supplied
			var currentLot = args;

			// Detect if X, Y grid position was given instead
			if (args &&
			   typeof arguments[0] === "number" &&
			   typeof arguments[1] === "number") {
				var x = arguments[0],
					y = arguments[1];

				currentLot = this.match(x, y);
			}

			if (!currentLot) {
				return; // Returns undefined
			}

			// Return the index when found a match
			return this.lot.findIndex(
				function(lot) {
					return lot === currentLot;
				}
			);
		}
	};
});