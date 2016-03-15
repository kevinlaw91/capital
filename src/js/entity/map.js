define(["entity/lot"], function(Lot) {
	'use strict';
	return {
		/**
		 * Generates and return a map definition array
		 * @returns {Lot[]}
		 */
		generate: function(){
			time("Generate Map For New Game");
			/**
			 * Map definition
			 * @type {Lot[]}
			 */
			var map = [
				new Lot({
					id: "MAP-CORNER-0",
					pos: { x: 13, y: 13},
					b:   { x: 15, y: 15},
					tradable: false
				}),
				new Lot({
					pos: { x: 12, y: 13},
					b:   { x: 12, y: 15},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 11, y: 13},
					b:   { x: 11, y: 15},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 10, y: 13},
					b:   { x: 10, y: 15},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 9, y: 13},
					b:   { x: 9, y: 15},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 8, y: 13},
					b:   { x: 8, y: 15},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 7, y: 13},
					b:   { x: 7, y: 15},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 6, y: 13},
					b:   { x: 6, y: 15},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 5, y: 13},
					b:   { x: 5, y: 15},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 4, y: 13},
					b:   { x: 4, y: 15},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					id: "MAP-CORNER-1",
					pos: { x: 3, y: 13},
					b:   { x: 1, y: 15},
					tradable: false
				}),
				new Lot({
					pos: { x: 3, y: 12},
					b:   { x: 1, y: 12},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 3, y: 11},
					b:   { x: 1, y: 11},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 3, y: 10},
					b:   { x: 1, y: 10},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 3, y: 9},
					b:   { x: 1, y: 9},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 3, y: 8},
					b:   { x: 1, y: 8},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 3, y: 7},
					b:   { x: 1, y: 7},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 3, y: 6},
					b:   { x: 1, y: 6},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 3, y: 5},
					b:   { x: 1, y: 5},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 3, y: 4},
					b:   { x: 1, y: 4},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					id: "MAP-CORNER-2",
					pos: { x: 3, y: 3},
					b:   { x: 1, y: 1},
					tradable: false
				}),
				new Lot({
					pos: { x: 4, y: 3},
					b:   { x: 4, y: 1},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 5, y: 3},
					b:   { x: 5, y: 1},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 6, y: 3},
					b:   { x: 6, y: 1},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 7, y: 3},
					b:   { x: 7, y: 1},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 8, y: 3},
					b:   { x: 8, y: 1},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 9, y: 3},
					b:   { x: 9, y: 1},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 10, y: 3},
					b:   { x: 10, y: 1},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 11, y: 3},
					b:   { x: 11, y: 1},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					pos: { x: 12, y: 3},
					b:   { x: 12, y: 1},
					direction: Lot.FACING_SOUTH
				}),
				new Lot({
					id: "MAP-CORNER-3",
					pos: { x: 13, y: 3},
					b:   { x: 15, y: 1},
					tradable: false
				}),
				new Lot({
					pos: { x: 13, y: 4},
					b:   { x: 15, y: 4},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 13, y: 5},
					b:   { x: 15, y: 5},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 13, y: 6},
					b:   { x: 15, y: 6},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 13, y: 7},
					b:   { x: 15, y: 7},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 13, y: 8},
					b:   { x: 15, y: 8},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 13, y: 9},
					b:   { x: 15, y: 9},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 13, y: 10},
					b:   { x: 15, y: 10},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 13, y: 11},
					b:   { x: 15, y: 11},
					direction: Lot.FACING_EAST
				}),
				new Lot({
					pos: { x: 13, y: 12},
					b:   { x: 15, y: 12},
					direction: Lot.FACING_EAST
				})
			];
			timeEnd("Generate Map For New Game");
			return map;
		}
	};
});