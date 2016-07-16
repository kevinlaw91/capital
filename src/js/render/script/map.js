define([
	"snapsvg",
	"jquery",
	"jquery.pub-sub",
	"engine/renderer",
	"engine/transform",
	"render/script/tile"
], function(Snap, $) {
	"use strict";

	/**
	 * Script to draw floor tiles
	 * @function
	 * @module render/script/map
	 */
	return function() {
		console.time("Draw Map");

		// Imports
		var Renderer = require("engine/renderer"),
			ScreenTransform = require("engine/transform");

		// Map params
		var rows    = ScreenTransform.row,
			columns = ScreenTransform.column;

		// Iterators & vars
		var lotSprite, id, r, c, count, type, offset, anchor;

		// Filters
		var filter_onhover = Renderer.canvas.filter(Snap.filter.brightness(1.3));

		// Bug in SnapSVG causing <use> with filter applied to appears as clipped
		// Remove it or set value to "objectBoundingBox" will fix the issue
		// See: https://github.com/adobe-webplatform/Snap.svg/issues/117
		filter_onhover.attr("filterUnits", "");

		// Event handlers
		function Lot_onHoverEnter() {
			var bb = this.data("lot.anchor").node.getBoundingClientRect();

			$.publish("UI.Tooltip.Show", {
				type: "LOT",
				id: this.data("lot.id"),
				position: {
					left: bb.left,
					top: bb.top
				}
			});
			this.attr({
				filter: filter_onhover
			});
		}

		function Lot_onHoverLeave() {
			$.publish("UI.Tooltip.Hide");
			this.attr({
				filter: null
			});
		}

		function Lot_onClick() {
			$.publish("UI.InfoPanel.LotInfo.subscribe", this.data("lot.id"));
			$.publish("UI.InfoPanel.LotInfo.refresh");
			$.publish("UI.InfoPanel.LotInfo.show");
		}

		//
		// Begin render map tiles
		//
		var DrawTile = require("render/script/tile");

		// (Border) Row 0 (north), full row
		r = 0; c = 0; type = "concrete-01";
		for (; c<columns; c++) {
			offset = ScreenTransform.getBoundingOffset(r, c);
			DrawTile(type, offset).attr({ "shape-rendering": "crispEdges" });
		}

		// (Border) Col 0 (west), full column
		// Skip row 0 because already rendered
		r = 1; c = 0; type = "concrete-01";
		for (; r<rows; r++) {
			offset = ScreenTransform.getBoundingOffset(r, c);
			DrawTile(type, offset).attr({ "shape-rendering": "crispEdges" });
		}

		// (Corner) North west 3x3
		r = 1; c = 1; type = "grass-3x3-01";
		offset = ScreenTransform.getBoundingOffset(r, c,
			{ rowSize: 3, colSize: 3 }
		);
		DrawTile(type, offset);

		// (Lot) North, 1x3 per lot, 9 lots in total, id from 21-29
		r = 1; c = 4; id = 21; count = 9; type = "lot-north-01";
		while (count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{ rowSize: 3, colSize: 1 }
			);
			lotSprite = DrawTile(type, offset);
			// Draw anchor
			anchor = ScreenTransform.getTopFaceMidpoint(2, c);
			lotSprite.data("lot.anchor", Renderer.layers.anchors.paper.rect(anchor.x, anchor.y, 1, 1));
			// Hover filter effect
			lotSprite.hover(Lot_onHoverEnter, Lot_onHoverLeave);
			// Add pointer reference to game instance
			lotSprite.data("lot.id", id);
			// Add click handler
			lotSprite.click(Lot_onClick);

			c++; // Proceed to next lot
			id++;
		}

		// (Corner) North east 3x3
		r = 1; c = 13; type = "grass-3x3-01";
		offset = ScreenTransform.getBoundingOffset(r, c,
			{ rowSize: 3, colSize: 3 }
		);
		DrawTile(type, offset);

		// (Lot) West, 3x1 per lot, 9 lots in total, id from 11-19
		r = 4; c = 1; id = 19; count = 9; type = "lot-west-01";
		while (count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{ rowSize: 1, colSize: 3 }
			);
			lotSprite = DrawTile(type, offset);
			anchor = ScreenTransform.getTopFaceMidpoint(r, 2);
			lotSprite.data("lot.anchor", Renderer.layers.anchors.paper.rect(anchor.x, anchor.y, 1, 1));
			lotSprite.hover(Lot_onHoverEnter, Lot_onHoverLeave);
			lotSprite.data("lot.id", id);
			lotSprite.click(Lot_onClick);
			r++; // Proceed to next lot
			id--;
		}

		// (Corner) South west 3x3
		r = 13; c = 1; type = "grass-3x3-01";
		offset = ScreenTransform.getBoundingOffset(r, c,
			{ rowSize: 3, colSize: 3 }
		);
		DrawTile(type, offset);

		// (Center) Center blank piece, bottom face
		Renderer.layers.floor.paper.polygon(
			ScreenTransform.getVertexOffset(4, 4, "S"),
			ScreenTransform.getVertexOffset(4, 12, "R"),
			ScreenTransform.getVertexOffset(12, 12, "B"),
			ScreenTransform.getVertexOffset(12, 4, "L")
		).attr({
			fill: "#61a038"
		});

		// (Center) Center blank piece, top face
		Renderer.layers.floor.paper.polygon(
			ScreenTransform.getVertexOffset(4, 4, "N"),
			ScreenTransform.getVertexOffset(4, 12, "E"),
			ScreenTransform.getVertexOffset(12, 12, "S"),
			ScreenTransform.getVertexOffset(12, 4, "W")
		).attr({
			fill: "#9ACF5C"
		});

		// (Lot) South, 1x3 per lot, 9 lots in total, id from 1-9
		r = 13; c = 4; id = 9; count = 9; type = "lot-south-01";
		while (count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{ rowSize: 3, colSize: 1 }
			);
			lotSprite = DrawTile(type, offset);
			anchor = ScreenTransform.getTopFaceMidpoint(14, c);
			lotSprite.data("lot.anchor", Renderer.layers.anchors.paper.rect(anchor.x, anchor.y, 1, 1));
			lotSprite.hover(Lot_onHoverEnter, Lot_onHoverLeave);
			lotSprite.data("lot.id", id);
			lotSprite.click(Lot_onClick);
			c++; // Proceed to next lot
			id--;
		}

		// (Lot) East, 3x1 per lot, 9 lots in total, id from 31-39
		r = 4; c = 13; id = 31; count = 9; type = "lot-east-01";
		while (count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{ rowSize: 1, colSize: 3 }
			);
			lotSprite = DrawTile(type, offset);
			anchor = ScreenTransform.getTopFaceMidpoint(r, 14);
			lotSprite.data("lot.anchor", Renderer.layers.anchors.paper.rect(anchor.x, anchor.y, 1, 1));
			lotSprite.hover(Lot_onHoverEnter, Lot_onHoverLeave);
			lotSprite.data("lot.id", id);
			lotSprite.click(Lot_onClick);
			r++; // Proceed to next lot
			id++;
		}

		// (Corner) South east 3x3
		r = 13; c = 13; type = "grass-3x3-01";
		offset = ScreenTransform.getBoundingOffset(r, c,
			{ rowSize: 3, colSize: 3 }
		);
		DrawTile(type, offset);

		// (Border) Row 16 (south), full row
		// Skip col 0 because already rendered
		// Skip last piece, let next loop draw it
		r = 16; c = 1; type = "concrete-01";
		for (; c<columns-1; c++) {
			offset = ScreenTransform.getBoundingOffset(r, c);
			DrawTile(type, offset).attr({ "shape-rendering": "crispEdges" });
		}

		// (Border) col 16 (east), full column
		// Skip row 0 because already rendered
		r = 1; c = 16; type = "concrete-01";
		for (; r<rows; r++) {
			offset = ScreenTransform.getBoundingOffset(r, c);
			DrawTile(type, offset).attr({ "shape-rendering": "crispEdges" });
		}

		console.timeEnd("Draw Map");
	};
});