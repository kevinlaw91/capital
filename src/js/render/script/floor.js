define([
	"snapsvg",
	"jquery",
	"jquery.pub-sub",
	"engine/renderer",
	"engine/transform",
	"render/script/tile"
], function( Snap, $) {
	/**
	 * Script to draw floor tiles
	 * @function
	 * @module render/script/floor
	 * @param {Layer} layer
	 */
	return function() {
		time("Draw Map");

		// Imports
		var Renderer = require("engine/renderer"),
		    ScreenTransform = require("engine/transform");

		// Map params
		var rows    = ScreenTransform.row,
		    columns = ScreenTransform.column;

		// Iterators & vars
		var lotSprite, id, r, c, count, type, offset;

		// Filters
		var filter_onhover = Renderer.canvas.filter(Snap.filter.brightness(1.3));

		// Event handlers
		function Lot_onHoverEnter(){
			this.attr({
				filter: filter_onhover
			});
		}

		function Lot_onHoverLeave(){
			this.attr({
				filter: null
			});
		}

		function Lot_onClick(){
			$.publish("UI.InfoPanel.LotInfo", {
				"class": "LOT.INFO",
				"contents": {
					id: this.data("lot.id")
				}
			});
		}

		//
		// Begin render map tiles
		//
		var DrawTile = require("render/script/tile");

		//(border) row 0 (north), full row
		r = 0; c = 0; type = "concrete-01";
		for(; c<columns; c++) {
			offset = ScreenTransform.getBoundingOffset(r, c);
			DrawTile(type, offset).attr({ "shape-rendering": "crispEdges"});
		}

		//(border) col 0 (west), full column
		//skip row 0 because already rendered
		r = 1; c = 0; type = "concrete-01";
		for(; r<rows; r++) {
			offset = ScreenTransform.getBoundingOffset(r, c);
			DrawTile(type, offset).attr({ "shape-rendering": "crispEdges"});
		}

		//(corner) north west 3x3
		r = 1; c = 1; type = "grass-3x3-01";
		offset = ScreenTransform.getBoundingOffset(r, c,
			{rowSize: 3, colSize: 3}
		);
		DrawTile(type, offset);

		//(lot) north, 1x3 per lot, 9 lots in total, id from 21-29
		r = 1; c = 4; id = 21; count = 9; type = "lot-north-01";
		while(count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{rowSize: 3, colSize: 1}
			);
			lotSprite = DrawTile(type, offset);
			// Hover filter effect
			lotSprite.hover(Lot_onHoverEnter, Lot_onHoverLeave);
			// Add pointer reference to game instance
			lotSprite.data("lot.id", id);
			// Add click handler
			lotSprite.click(Lot_onClick);

			c++; //proceed to next lot
			id++;
		}

		//(corner) north east 3x3
		r = 1; c = 13; type = "grass-3x3-01";
		offset = ScreenTransform.getBoundingOffset(r, c,
			{rowSize: 3, colSize: 3}
		);
		DrawTile(type, offset);

		//(lot) west, 3x1 per lot, 9 lots in total, id from 11-19
		r = 4; c = 1; id = 19; count = 9; type = "lot-west-01";
		while(count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{rowSize: 1, colSize: 3}
			);
			lotSprite = DrawTile(type, offset);
			lotSprite.hover(Lot_onHoverEnter, Lot_onHoverLeave);
			lotSprite.data("lot.id", id);
			lotSprite.click(Lot_onClick);
			r++; //proceed to next lot
			id--;
		}

		//(corner) south west 3x3
		r = 13; c = 1; type = "grass-3x3-01";
		offset = ScreenTransform.getBoundingOffset(r, c,
			{rowSize: 3, colSize: 3}
		);
		DrawTile(type, offset);

		//(center) center blank piece, bottom face
		Renderer.layers.floor.paper.polygon(
			ScreenTransform.getVertexOffset(4,4,"S"),
			ScreenTransform.getVertexOffset(4,12,"R"),
			ScreenTransform.getVertexOffset(12,12,"B"),
			ScreenTransform.getVertexOffset(12,4,"L")
		).attr({
			fill: "#61a038"
		});

		//(center) center blank piece, top face
		Renderer.layers.floor.paper.polygon(
			ScreenTransform.getVertexOffset(4,4,"N"),
			ScreenTransform.getVertexOffset(4,12,"E"),
			ScreenTransform.getVertexOffset(12,12,"S"),
			ScreenTransform.getVertexOffset(12,4,"W")
		).attr({
			fill: "#9ACF5C"
		});

		//(lot) south, 1x3 per lot, 9 lots in total, id from 1-9
		r = 13; c = 4; id = 9; count = 9; type = "lot-south-01";
		while(count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{rowSize: 3, colSize: 1}
			);
			lotSprite = DrawTile(type, offset);
			// Hover filter effect
			lotSprite.hover(Lot_onHoverEnter, Lot_onHoverLeave);
			lotSprite.data("lot.id", id);
			lotSprite.click(Lot_onClick);
			c++; //proceed to next lot
			id--;
		}

		//(lot) east, 3x1 per lot, 9 lots in total, id from 31-39
		r = 4; c = 13; id = 31; count = 9; type = "lot-east-01";
		while(count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{rowSize: 1, colSize: 3}
			);
			lotSprite = DrawTile(type, offset);
			// Hover filter effect
			lotSprite.hover(Lot_onHoverEnter, Lot_onHoverLeave);
			lotSprite.data("lot.id", id);
			lotSprite.click(Lot_onClick);
			r++; //proceed to next lot
			id++;
		}

		//(corner) south east 3x3
		r = 13; c = 13; type = "grass-3x3-01";
		offset = ScreenTransform.getBoundingOffset(r, c,
			{rowSize: 3, colSize: 3}
		);
		DrawTile(type, offset);

		//(border) row 16 (south), full row
		//skip col 0 because already rendered
		//skip last piece, let next loop draw it
		r = 16; c = 1; type = "concrete-01";
		for(; c<columns-1; c++) {
			offset = ScreenTransform.getBoundingOffset(r, c);
			DrawTile(type, offset).attr({ "shape-rendering": "crispEdges"});
		}

		//(border) col 16 (east), full column
		//skip row 0 because already rendered
		r = 1; c = 16; type = "concrete-01";
		for(; r<rows; r++) {
			offset = ScreenTransform.getBoundingOffset(r, c);
			DrawTile(type, offset).attr({ "shape-rendering": "crispEdges"});
		}

		timeEnd("Draw Map");
	};
});