define([
	"engine/assets",
	"engine/renderer"
], function(AssetManager, Renderer) {
	"use strict";

	// Defaults
	var default_position = { x: 0, y: 0 },
		default_size = 64,
		default_tile_size = {
			height: default_size,
			width: default_size
		};

	/**
	 * Draw a 2D map tile piece on stage
	 * @function
	 * @param {string} id - Identifier of the tile
	 * @param {Object} [position={x:0,y:0}] - Position to draw
	 * @param {number} position.x - X position
	 * @param {number} position.y - Y position
	 * @param {Object} [size] - Size of the symbol to be drawn
	 * @example
	 * // Draw at [0,0]
	 * drawSymbol("sym");
	 *
	 * // Draw at [10,20]
	 * drawSymbol("sym", {x: 10, y: 20});
	 *
	 * // Draw at [0,0], size: 123x456
	 * drawSymbol("sym", null, {width: 123, height: 456});
	 *
	 * // At [1,2] using calculated size of a 2x4 tile
	 * // Property 'col' and 'column' are treated as aliases
	 * drawSymbol("sym", {x: 1, y: 2}, {col: 2, row: 4});
	 * drawSymbol("sym", {x: 1, y: 2}, {column: 2, row: 4});
	 *
	 * // If only one dimension is specified, it will be rendered as a square tile
	 * drawSymbol("sym", null, {col: 3}); // Same as {col: 3, row: 3}
	 */
	return function(id, position, size) {
		if (!AssetManager.SymbolStore.hasSymbol(id)) {
			err("Missing symbol: " + id);
			throw Error("Symbol not loaded");
		}

		var layer = Renderer.layers.floor.paper;
		var tile = layer.use(id);

		// Set position
		var pos = position || default_position;

		tile.attr(pos);

		// Calculate tile size if col or row are specified
		var calcSize;

		if (size && typeof size === "object") {
			if (size.hasOwnProperty("height") && size.hasOwnProperty("width")) {
				// keep it and use it
				calcSize = size;
			} else if (size.hasOwnProperty("col") ||
			          size.hasOwnProperty("column") ||
			          size.hasOwnProperty("row")) {
				// User specified column(s) and row(s) that the symbol will occupy
				// Use it to calculate width and height

				// Symbol has to be sized at least a 1x1 tile
				// if only 1 dimension is given, assume a square tile
				size.col = size.col || size.column /* alias */ || size.row || 1;
				size.row = size.row || size.col || 1;

				// In dimetric projection,
				// col and row can be swapped without affecting dimension
				// so we use longer and shorter side for calculation instead of col or row
				var longer = Math.max(size.col, size.row),
					shorter = Math.min(size.col, size.row);

				calcSize = Object.create(default_tile_size); // Start with a 1x1 tile

				// Enlarge if more than a 1x1 tile
				while (--longer) {
					if (shorter>1) {
						shorter--;
						calcSize.height += (default_size / 4);
						calcSize.width += (default_size / 2);
					}
					calcSize.height += (default_size / 4);
					calcSize.width += (default_size / 2);
				}
			} else {
				// Invalid size specified
				calcSize = default_tile_size; // Default to a 1x1 tile
			}
		} else {
			// Size not specified
			// perform lookup from asset manager cache
			// if no record, use default size
			calcSize = AssetManager.SymbolStore.getSymbolDimensions(id) || default_tile_size;
		}

		// Apply size
		tile.attr(calcSize);

		return tile;
	};
});