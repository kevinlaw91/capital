define([
	"engine/renderer",
	"engine/transform"
], function() {
	'use strict';
	/**
	 * Mark a land lot with color to indicate owner
	 * @param {string} [color=white] Color of marker
	 */
	return function(lot, color){
		var ScreenTransform = require("engine/transform");
		var layer = require("engine/renderer").layers.floor_overlay.paper;
		return layer.polygon(
			ScreenTransform.getVertexOffset(lot.y, lot.x, "N"),
			ScreenTransform.getVertexOffset(lot.y, lot.x, "W"),
			ScreenTransform.getVertexOffset(lot.y, lot.x, "S"),
			ScreenTransform.getVertexOffset(lot.y, lot.x, "E")
		).attr({
			fill: color || "white"
		});
	};
});