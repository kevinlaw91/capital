/** A helper object to calculate line properties */
export default class Line {
	constructor(p1, p2) {
		[this.x1, this.y1] = p1;
		[this.x2, this.y2] = p2;
	}

	get dX() { return this.x2 - this.x1; }
	get dY() { return this.y2 - this.y1; }

	/**
	 * Get distance between two points
	 * @return {number}
	 */
	get distance() {
		return Math.sqrt(Math.pow(this.dX, 2) + Math.pow(this.dY, 2));
	}

	/**
	 * Get the coordinates of a point along the line,
	 * that is located at certain distance away from first point
	 * @param {number} d - Distance from first point
	 * @return {number[]} Point coordinates [x,y]
	 */
	getPointByDistance(d) {
		return this.getPointByRatio(d / this.distance);
	}

	/**
	 * Get the coordinates of a point along the line, such that
	 * the position of the point is at a ratio of the line length.
	 * @example
	 * d=0, point is p1
	 * d=0.5, midpoint
	 * d=1, point is p2
	 * @param {number} r - Ratio distance
	 * @return {number[]} Point coordinates [x,y]
	 */
	getPointByRatio(r) {
		return [this.x1 + (r * this.dX), this.y1 + (r * this.dY)];
	}

	/**
	 * Get the midpoint of the line
	 * @return {number[]} Point coordinates [x,y]
	 */
	getMidpoint() {
		return this.getPointByRatio(0.5);
	}
}
