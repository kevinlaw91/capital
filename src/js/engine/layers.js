/** @module engine/layers */
define(function() {
	return function(Renderer){
		/**
		 * A rendering layer
		 * @param {string} id - Identifier for the rendering layer
		 * @constructor
		 */
		function Layer(id){
			this.paper = Renderer.canvas.g().attr({"id": "layer-" + id});
		}

		/** @exports module:engine/renderer.Layer */
		Renderer.Layer = Layer;

		/**
		 * Collection of rendering layers currently at stage
		 * @memberOf module:engine/renderer.
		 * @type {Layer[]}
		 */
		Renderer.layers = [];

		/**
		 * Create a render layer
		 * @param {String} id - Identifier of the new render layer
		 * @memberOf module:engine/renderer.
		 * @returns Layer
		 */
		Renderer.createLayer = function(id){
			Renderer.layers[id] = new Layer(id);
			return Renderer.layers[id];
		};
	};
});