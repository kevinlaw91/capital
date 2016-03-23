define([
	"snapsvg",
	"entity/lot",
	"engine/renderer",
	"engine/transform"
], function(Snap) {
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

		    // Tile corners
		    tn = ScreenTransform.getVertexOffsetAsPoint(lot.y, lot.x, "N"),
		    tw = ScreenTransform.getVertexOffsetAsPoint(lot.y, lot.x, "W"),
		    ts = ScreenTransform.getVertexOffsetAsPoint(lot.y, lot.x, "S"),
		    te = ScreenTransform.getVertexOffsetAsPoint(lot.y, lot.x, "E"),

		    // Four output corners for rendering
		    n = [tn.x, tn.y],
			w = [tw.x, tw.y],
			s = [ts.x, ts.y],
			e = [te.x, te.y],

			// Variables for calculations
			path, length,
			width = 0.15; //15% of total length

			// Function
			function createLinePath(pointA, pointB){
				return Snap.format("M{a.x},{a.y}L{b.x},{b.y}", { a: pointA, b: pointB });
			}


		switch(lot.direction){
			case Lot.FACING_NORTH:
				//West to north path
				path = createLinePath(tw, tn);
				//Calculate length for once
				length = Snap.path.getTotalLength(path) * width;
				//Move north point closer to west point
				n = Snap.path.getPointAtLength(path, length);
				n = [n.x, n.y];
				//South to east path
				path = createLinePath(ts, te);
				//Move east point closer to south point
				e = Snap.path.getPointAtLength(path, length); //Can reuse previously calculated length
				e = [e.x, e.y];
				break;
			case Lot.FACING_EAST:
				path = createLinePath(tn, te);
				length = Snap.path.getTotalLength(path) * width;
				e = Snap.path.getPointAtLength(path, length);
				e = [e.x, e.y];
				path = createLinePath(tw, ts);
				s = Snap.path.getPointAtLength(path, length);
				s = [s.x, s.y];
				break;
			case Lot.FACING_SOUTH:
				path = createLinePath(tn, tw);
				length = Snap.path.getTotalLength(path) * width;
				w = Snap.path.getPointAtLength(path, length);
				w = [w.x, w.y];
				path = createLinePath(te, ts);
				s = Snap.path.getPointAtLength(path, length);
				s = [s.x, s.y];
				break;
			case Lot.FACING_WEST:
				path = createLinePath(te, tn);
				length = Snap.path.getTotalLength(path) * width;
				n = Snap.path.getPointAtLength(path, length);
				n = [n.x, n.y];
				path = createLinePath(ts, tw);
				w = Snap.path.getPointAtLength(path, length);
				w = [w.x, w.y];
				break;
		}

		return layer.polygon(n, w, s, e).attr({
			fill: color || "white"
		});
	};
});