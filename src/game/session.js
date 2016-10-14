import generateMap from "./map/map-generator";

/**
 * Current active game session
 * @type {Object}
 * @public
 */
let activeSession;

export default {
	get active() {
		return activeSession;
	},

	/** Create new game session */
	create: function () {
		activeSession = {
			map: generateMap(),
		};
	},

	/** Destroy active game session */
	destroy: function () {
		activeSession = null;
	},
};