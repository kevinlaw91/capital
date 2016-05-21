define(function(){
	'use strict';

	/**
	 * A rendering layer
	 * @param {string} id - Identifier for the rendering layer
	 * @constructor
	 */
	function Layer(id){
		this.paper = Renderer.canvas.g().attr({"id": "layer-" + id});
	}

	/** @exports engine/renderer */
	var Renderer = {
		/** Reference to stage */
		canvas: null,

		/** Set reference to stage */
		setCanvas: function(elem) {
			this.canvas = elem;
		},

		/**
		 * Collection of rendering layers currently at the stage
		 * @type {Layer[]}
		 */
		layers: [],

		/**
		 * Create a render layer
		 * @param {String} id - Identifier of the new render layer
		 * @returns {Layer}
		 */
		createLayer: function(id) {
			Renderer.layers[id] = new Layer(id);
			return Renderer.layers[id];
		}
	};

	return Renderer;
});