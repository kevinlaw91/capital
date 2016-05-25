define(function() {
	'use strict';

	/**
	 * Represents a lot in the map
	 * @namespace Lot
	 * @param {object} props - Properties to be applied to the lot
	 * @constructor
	 */
	function Lot(props){
		/**
		 * Identifier of lot
		 * @type {string}
		 */
		if(typeof props.id !=="undefined") {
			this.id = props.id;
		}

		if(typeof props.direction !== "undefined"){
			/** @instance */
			this.direction = props.direction;
		}

		/** XY Grid position in 2D map */
		this.x = props.pos.x;
		this.y = props.pos.y;
	}

	/** Facing directions */
	Lot.prototype.FACING_NORTH = 0x0100;
	Lot.prototype.FACING_SOUTH = 0x0101;
	Lot.prototype.FACING_EAST = 0x0102;
	Lot.prototype.FACING_WEST = 0x0103;
	Lot.prototype.FACING_UNKNOWN = 0x0104;

	/**
	 * Facing direction
	 * @static
	 * @type {
	 * Lot.prototype.FACING_NORTH|
	 * Lot.prototype.FACING_SOUTH|
	 * Lot.prototype.FACING_EAST|
	 * Lot.prototype.FACING_WEST|
	 * Lot.prototype.FACING_UNKNOWN
	 * }
	 */
	Lot.prototype.direction = Lot.prototype.FACING_UNKNOWN;

	/**
	 * Can the lot be traded?
	 * @type {boolean}
	 */
	Lot.prototype.isTradable = false;

	return Lot;
});