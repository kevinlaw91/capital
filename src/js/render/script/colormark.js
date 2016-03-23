define([
	"entity/lot",
	"engine/renderer",
	"engine/transform"
], function() {
	'use strict';
	/**
	 * Mark a land lot with color to indicate owner
	 * @param {number} lot.x
	 * @param {number} lot.y
	 * @param {number} lot.direction
	 * @param {string} [color=white] Color of marker
	 */
	return function(lot, color){
			//Imports
		var Lot = require("entity/lot"),
		    ScreenTransform = require("engine/transform"),

		    // Dedicated layer to render
		    layer = require("engine/renderer").layers.floor_overlay.paper,

		    // Four corners
			n, w, s, e;

		switch(lot.direction){
			default:
				n = ScreenTransform.getVertexOffset(lot.y, lot.x, "N");
				w = ScreenTransform.getVertexOffset(lot.y, lot.x, "W");
				s = ScreenTransform.getVertexOffset(lot.y, lot.x, "S");
				e = ScreenTransform.getVertexOffset(lot.y, lot.x, "E");
		}

		return layer.polygon(n, w, s, e).attr({
			fill: color || "white"
		});
	};
});