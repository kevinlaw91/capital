define(function() {
	"use strict";

	/**
	 * Represents a tile position in a 2D map
	 * @typedef {Object} Tile
	 * @property {number} col - Column position of the tile
	 * @property {number} row - Row position of the tile
	 */

	/**
	 * Represents a rectangular-ly grouped tiles
	 * @typedef {Object} TileSet
	 * @property {number} colSize - Column of tiles a symbol will occupy
	 * @property {number} rowSize - Row of tiles a symbol will occupy
	 */

	/**
	 * Represents a point in 2D plane
	 * @module
	 * @constructor
	 * @param x - X coordinate
	 * @param y - Y coordinate
	 */
	function Point(x, y) {
		/**
		 * @property {number} X Coordinate
		 */
		this.x = x;
		/**
		 * @property {number} Y Coordinate
		 */
		this.y = y;
	}

	/**
	 * Returns an array representation of a Point object
	 * @returns {number[]}
	 */
	Point.prototype.toArray = function() {
		return [this.x, this.y];
	};

	/**
	 * Represents a 2D Map entity
	 * @module engine/transform
	 */
	return {
		/**
		 * Screen space transformation matrix of a 2D map
		 * Map were projected using dimetric projection
		 *
		 * Note that to retrieve a transformation vector, use
		 * [y][x] (row, column)
		 * @see #generate
		 * @type {Array.<Point[]>}
		 */
		matrix: [],
		/**
		 * Number of columns in the 2D map
		 * @default
		 */
		column: 0,
		/**
		 * Number of rows in the 2D map
		 * @default
		 */
		row: 0,
		/**
		 * Size of a tile in the 2D map
		 * dimetric projection transformed bounding box size
		 * @default
		 */
		tileSize: 64,

		/**
		 * Generate screen space transform matrix of a 2D map using dimetric projection
		 * @function
		 * @param {object} params - Parameters for generator
		 * @param {number} params.column - Column count of the 2D map
		 * @param {number} params.row - Row count of the 2D map
		 * @param {number} params.tileSize - Tile size of 2D map (square)
		 */
		generate: function(params) {
			// Cache params
			this.column = params.column;
			this.row = params.row;
			this.tileSize = params.tileSize;

			// Shorthands
			var col = this.column,
				row = this.row,
				tileSize = this.tileSize;

			// Generates dimetric projection coordinates
			console.time("Generate projection transform matrix");

			var ox = 0, oy = 0,
				nx = (row - 1) * (tileSize / 2); // Normalize x to return only positive numbers

			for (var r = 0; r<row; r++) {
				// Record rows
				this.matrix[r] = [];

				ox = r * -(tileSize / 2);
				oy = r * (tileSize / 4);

				for (var c = 0; c<col; c++) {
					// Record each column within a row
					/** @type Point */
					this.matrix[r][c] = new Point(
						ox + (c * tileSize / 2) + nx,
						oy + (c * tileSize / 4)
					);
				}
			}

			console.timeEnd("Generate projection transform matrix");

			// Self destruct
			delete this.generate;

			return this;
		},
		/**
		 * Get screen bounding offset for tile(s) in a 2D map
		 * To specify tile larger than 1x1, define last tile in "extended" parameter.
		 * Last tile is always located (if applicable) to the bottom right, e.g:
		 * <pre>
		 *  first -->  [A] . . .            .[A] .
		 *             :       :   -->  . `       . `
		 *   last -->  . . . .[B]          ` [B]`
		 * </pre>
		 * Please refer at examples on how to specify last tile.
		 * @param {number} row - (y) Row position of (first) tile
		 * @param {number} column - (x) Column position of (first) tile
		 * @param {Tile|TileSet} [extended] - Define last tile by position or by size
		 * @example
		 * getBoundingOffset(4,5); // Get bounding box for a 1x1 tile
		 * getBoundingOffset(4,5,{col:5, row:6}) // If larger than 1x1, and last tile position is known, e.g. [5,6]
		 * getBoundingOffset(1,2,{colSize:3, rowSize:1}) // If larger than 1x1, and size is known, e.g. 3 columns x 1 row
		 *
		 * @returns {Point} Bounding box offset
		 */
		getBoundingOffset: function(row, column, extended) {
			if (extended) {
				var to = { col: column, row: row };

				if (extended.hasOwnProperty("row") && extended.hasOwnProperty("col")) {
					// Last tile was defined by position
					to.col = extended.col;
					to.row = extended.row;
				} else if (extended.hasOwnProperty("rowSize") && extended.hasOwnProperty("colSize")) {
					// Last tile was defined by size
					to.col = column + (extended.colSize - 1);
					to.row = row + (extended.rowSize - 1);
				}

				// Bounding offset for an extended tile in map
				return new Point(this.matrix[to.row][column].x, this.matrix[column][row].y);
			} else {
				// Bounding offset for a 1x1 tile in map
				return this.matrix[row][column];
			}
		},
		/**
		 * Return screen offset to a vertex defined in a 2D map (in array form)
		 * <pre>
		 *        . N .
		 *     W         E
		 *       `  S  `
		 *     L         R
		 *       `  B  `
		 *</pre>
		 * @param {number} row - Row position of the tile
		 * @param {number} column - Column position of the tile
		 * @param {string} vertex - The vertex identifier to be returned. (Refer diagram)
		 * @see getVertexOffsetAsPoint
		 * @returns {number[]} Offset in the form of [x,y]
		 */
		getVertexOffset: function(row, column, vertex) {
			// Get bounding box offset for map tile [row, column]
			// Use transpose when getting matrix
			var o       = Object.create(this.matrix[row][column]),
				full    = this.tileSize,
				half    = full / 2,
				quarter = full / 4;

			switch (vertex) {
				case "N":
					o.x += half;
					break;
				case "W":
					o.y += quarter;
					break;
				case "E":
					o.x += full;
					o.y += quarter;
					break;
				case "S":
					o.x += half;
					o.y += half;
					break;
				case "L":
					o.y += half + quarter;
					break;
				case "B":
					o.x += half;
					o.y += full;
					break;
				case "R":
					o.x += full;
					o.y += half + quarter;
					break;
			}

			return [o.x, o.y];
		},
		/**
		 * Return screen offset to a vertex defined in a 2D map
		 * Similar to {@link getVertexOffset}, but return offset as {@link Point} object instead.
		 *
		 * For example of usage, see {@link getVertexOffset}
		 * @param {number} row - Row position of the tile
		 * @param {number} column - Column position of the tile
		 * @param {string} vertex - The vertex identifier to be returned. (Refer diagram)
		 * @see getVertexOffset
		 * @returns {Point} Offset in the form of {@link Point} object
		 */
		getVertexOffsetAsPoint: function(row, column, vertex) {
			var offset = this.getVertexOffset(row, column, vertex);

			return new Point(offset[0], offset[1]);
		},
		/**
		 * Get the vectors of the center of top face that belongs to a tile
		 * @function getTopFaceMidpoint
		 * @param row
		 * @param column
		 * @example
		 * Vector for position "X" will be returned
		 *          _
		 *       _-` `-_
		 *     .`   X   `.
		 *     |`-_   _-`|
		 *     .   `:`   .
		 *      `-_ | _-`
		 *         `~`
		 */
		getTopFaceMidpoint: function(row, column) {
			var o = Object.create(this.matrix[row][column]);

			o.x += this.tileSize/2;
			o.y += this.tileSize/4;

			return o;
		}
	};
});