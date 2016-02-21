define(function() {
	'use strict';

	/**
	 * Represents a point in 2D plane
	 * @module
	 * @constructor
	 * @param x - X coordinate
	 * @param y - Y coordinate
	 */
	function Point(x, y){
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
	Point.prototype.toArray = function(){
		return [this.x, this.y];
	};

	return Point;
});