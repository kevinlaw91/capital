/** @module engine/layers */
define(function() {
	return function(Renderer){
		/**
		 * A rendering layer
		 * @param {string} id - Identifier for the rendering layer
		 * @class
		 * @public
		 * @constructor
		 */
		function Layer(id){
			this.paper = Renderer.canvas.g().attr({"id": "layer-" + id});
		}

		/** @exports module:engine/renderer.Layer */
		Renderer.Layer = Layer;

		/**
		 * Script that can be run on specific rendering layer
		 * To be used with {@link Layer.attachScript}
		 * @callback RenderScript
		 */

		/**
		 * Attach render script on rendering layer
		 * @param {string} fnName - Script identifier
		 * @param {RenderScript} fn - Script function
		 * @returns {Layer}
		 */
		Layer.prototype.attachScript = function(fnName, fn){
			this[fnName] = fn;
			return this;
		};

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