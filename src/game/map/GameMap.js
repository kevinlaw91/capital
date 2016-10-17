import {
	START_LOCATION as path_start,
	default as path
} from "./pathfinding";

export default class GameMap {
	constructor() {
		this.items = new Map();

		// ---------------------------
		// Generate default map layout
		// ---------------------------

		// Corners
		this.add("CORNER-0");
		this.add("CORNER-1");
		this.add("CORNER-2");
		this.add("CORNER-3");

		// Property lot
		for (let side of GameMap.SIDES) {
			for (let i = 0; i < GameMap.LOT_COUNT; i++) {
				let index = `${i.toString().padStart(2, "0")}`; // Zero padded
				let key = `LOT-${side}${index}`;
				this.add(key);
			}
		}

		this.findNextMove = (current) => {
			if (path[current]) {
				return path[current];
			}

			logger.warn("Unable to find next move. Using start position.");

			return path_start;
		};
	}

	/**
	 * Sides of the map
	 * @return {Array}
	 */
	 static get SIDES() {
		return ["S", "W", "N", "E"];
	}

	/**
	 * How many property lot on each side of the map
	 * @return {Number}
	 */
	static get LOT_COUNT() {
		return 9;
	}

	add(id) {
		return this.items.set(id, { id: id });
	}

	update(id, ...newProps) {
		if (this.items.has(id)) {
			let o = this.items.get(id);

			// Merge parameters into single object
			let merged = newProps.reduce((pre, cur) => {
				if (cur.length > 0) {
					// Parameter is array
					// Merge each item into pre
					cur.forEach(i => Object.assign(pre, i));
				} else {
					// Parameter is object
					// Merge into pre
					Object.assign(pre, cur);
				}

				// Return merged object
				return pre;
			}, {});

			// Merge properties specified in the merged object
			Object.assign(o, merged);
		}
	}

	get(id) {
		return this.items.get(id);
	}

	static getLotId(side, index) {
		return `LOT-${side}${index}`;
	}
}