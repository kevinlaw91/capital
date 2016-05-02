define([
	"snapsvg",
	"engine/layers"
], function(Snap) {
	/**
	 * @exports engine/renderer
	 */
	var Renderer = {
		/**
		 * Reference to stage
		 * @type {Snap}
		 */
		canvas: null,

		/**
		 * Set reference to stage
		 */
		setCanvas: function(elem) {
			this.canvas = elem;
		}
	};

	//Import sub-modules
	require("engine/layers")(Renderer);

	return Renderer;
});