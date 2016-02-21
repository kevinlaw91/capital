define([
	"engine/renderer",
	"engine/transform",
	"render/script/tile"
], function() {
	/**
	 * Script to draw floor tiles
	 * @function
	 * @module render/script/floor
	 * @param {Layer} layer
	 */
	return function() {
		time("Draw Map");

		var Renderer = require("engine/renderer");
		var ScreenTransform = require("engine/transform");

		var rows    = ScreenTransform.row,
		    columns = ScreenTransform.column;

		var r, c, count, type, offset;

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

		//(lot) north, 1x3 per lot, 9 lots in total
		r = 1; c = 4; count = 9; type = "lot-north-01";
		while(count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{rowSize: 3, colSize: 1}
			);
			DrawTile(type, offset);
			c++; //proceed to next lot
		}

		//(corner) north east 3x3
		r = 1; c = 13; type = "grass-3x3-01";
		offset = ScreenTransform.getBoundingOffset(r, c,
			{rowSize: 3, colSize: 3}
		);
		DrawTile(type, offset);

		//(lot) west, 3x1 per lot, 9 lots in total
		r = 4; c = 1; count = 9; type = "lot-west-01";
		while(count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{rowSize: 1, colSize: 3}
			);
			DrawTile(type, offset);
			r++; //proceed to next lot
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

		//(lot) south, 1x3 per lot, 9 lots in total
		r = 13; c = 4; count = 9; type = "lot-south-01";
		while(count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{rowSize: 3, colSize: 1}
			);
			DrawTile(type, offset);
			c++; //proceed to next lot
		}

		//(lot) east, 3x1 per lot, 9 lots in total
		r = 4; c = 13; count = 9; type = "lot-east-01";
		while(count--) {
			offset = ScreenTransform.getBoundingOffset(r, c,
				{rowSize: 1, colSize: 3}
			);
			DrawTile(type, offset);
			r++; //proceed to next lot
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