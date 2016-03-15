define([
	"jquery",
    "jquery.pub-sub",
    "render/script/colormark",
    "render/sprite/house",
], function($) {
	/** Resources for building */
	var Upgrades = [
		{ /*Empty Lot*/ },
		{
			south: {
				resourceId: "building-hut-south",
				resourceOffsetX: 30,
				resourceOffsetY: 40
			},
			east: {
				resourceId: "building-hut-east",
				resourceOffsetX: 20,
				resourceOffsetY: 25
			}
		},
		{
			south: {
				resourceId: "building-laneway-south",
				resourceOffsetX: 32,
				resourceOffsetY: 40
			},
			east: {
				resourceId: "building-laneway-east",
				resourceOffsetX: 20,
				resourceOffsetY: 25
			}
		},
		{
			south: {
				resourceId: "building-ranch-south",
				resourceOffsetX: 32,
				resourceOffsetY: 42
			},
			east: {
				resourceId: "building-ranch-east",
				resourceOffsetX: 32,
				resourceOffsetY: 30
			}
		},
		{
			south: {
				resourceId: "building-villa-south",
				resourceOffsetX: 30,
				resourceOffsetY: 45
			},
			east: {
				resourceId: "building-villa-east",
				resourceOffsetX: 35,
				resourceOffsetY: 38
			}
		}
	];

	/**
	 * Facing directions
	 * @constant
	 * @memberOf Lot.
	 * @type {number}
	 */
	Lot.FACING_SOUTH = 0x0101;
	Lot.FACING_EAST = 0x0102;

	// Imports
	var ScreenTransform = require("engine/transform");
	var House = require("render/sprite/house");

	/**
	 * Represents a lot in the map
	 * @namespace Lot
	 * @param {object} props Properties to be applied to the lot
	 * @constructor
	 */
	function Lot(props){
		/**
		 * Identifier of lot
		 * @type {string}
		 */
		this.id = props.id;

		/**
		 * Facing direction
		 * @type {number}
		 */
		if(typeof props.direction !== "undefined"){
			this.direction = props.direction;
		}

		/** XY Grid position in 2D map */
		this.x = props.pos.x;
		this.y = props.pos.y;

		/** XY grid position for building */
		this.buildingX = props.b.x;
		this.buildingY = props.b.y;

		/**
		 * Color marker that shows the owner
		 * @var colorMark
		 * @memberOf Lot#
		 */

		/**
		 * Can the lot be traded?
		 * @type {boolean}
		 */
		this.isTradable = (!(typeof props.tradable !== "undefined" && props.tradable === false));

		/**
		 * Upgraded levels
		 * @type {number}
		 */
		this.tier = 0;

		/**
		 * Owner of this lot
		 * @type {Player}
		 * @default null
		 */
		this.owner = null;

		/**
		 * Rent
		 * @type {number}
		 */
		//TODO: values for different states
		this.rent = 1234;

		this.house = null;
	}

	Lot.prototype.upgrade = function(){
		//Update tier info
		var newTier = Upgrades[++this.tier];

		if(this.house === null){
			// Draw house for the first time
			this.house = new House(newTier.resourceId, newTier.resourceOffsetX, newTier.resourceOffsetY);
			var pos = ScreenTransform.getTopFaceMidpoint(this.buildingY, this.buildingX);
			this.house.moveTo(pos.x, pos.y);
		} else {
			// Redraw/upgrade house
			this.house.replace(newTier.resourceId, newTier.resourceOffsetX, newTier.resourceOffsetY);
		}
	};

	/** Checks if upgrade is possible */
	Lot.prototype.upgradeAvailable = function() {
		var maxTier = 4;
		return this.tier<maxTier;
	};

	/**
	 * Set reference to a new owner
	 * @param {Player} newOwner
	 */
	Lot.prototype.sellTo = function(newOwner){
		this.owner = newOwner;
		this.markColor(newOwner.markColor);
	};

	/**
	 * Check if current owner is the specified player
	 * @param {Player} owner
	 * @return {boolean}
	 */
	Lot.prototype.isOwnedBy = function(owner){
		return this.owner === owner;
	};

	Lot.prototype.markColor = function(color) {
		//Get color mark
		var colorMark = this.colorMark || require("render/script/colormark")({x: this.x, y: this.y});
		//Set color
		colorMark.attr({
			fill: color
		});
	};

	return Lot;
});