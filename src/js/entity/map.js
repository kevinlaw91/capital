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
			var map = [];

			/**
			 * Begin Generator Script
			 */
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
					new Lot({
						pos: { x: i, y: 13},
						b:   { x: i, y: 15},
						direction: Lot.FACING_SOUTH,
						tradable: true
					})
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
					new Lot({
						pos: { x: 3, y: i},
						b:   { x: 1, y: i},
						direction: Lot.FACING_EAST,
						tradable: true
					})
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
					new Lot({
						pos: { x: i, y: 3},
						b:   { x: i, y: 1},
						direction: Lot.FACING_SOUTH,
						tradable: true
					})
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
					new Lot({
						pos: { x: 13, y: i},
						b:   { x: 15, y: i},
						direction: Lot.FACING_EAST,
						tradable: true
					})
				);
			}

			timeEnd("Generate Map For New Game");
			return map;
		}
	};
});