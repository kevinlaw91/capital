define(function() {
	"use strict";

	/** @namespace */
	var Renderer = {
		/** Reference to stage */
		canvas: null,

		/** Set reference to stage */
		setCanvas: function(elem) {
			this.canvas = elem;
		},

		/**
		 * Collection of rendering layers currently at the stage
		 * @type {Array.<String,Layer>}
		 */
		layers: [],

		/**
		 * Create a render layer
		 * @param {String} id - Identifier of the new render layer
		 * @returns {Layer}
		 */
		createLayer: function(id) {
			Renderer.layers[id] = new Layer(id); // eslint-disable-line no-use-before-define

			return Renderer.layers[id];
		}
	};

	/**
	 * A rendering layer
	 * @param {string} id - Identifier for the rendering layer
	 * @constructor
	 */
	function Layer(id) {
		this.paper = Renderer.canvas.g().attr({ id: "layer-" + id });
	}

	return Renderer;
});