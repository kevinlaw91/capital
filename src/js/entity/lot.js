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
				rsId: "building-hut-south",
				rsOffsetX: 30,
				rsOffsetY: 40
			},
			east: {
				rsId: "building-hut-east",
				rsOffsetX: 20,
				rsOffsetY: 25
			}
		},
		{
			south: {
				rsId: "building-laneway-south",
				rsOffsetX: 32,
				rsOffsetY: 40
			},
			east: {
				rsId: "building-laneway-east",
				rsOffsetX: 20,
				rsOffsetY: 25
			}
		},
		{
			south: {
				rsId: "building-ranch-south",
				rsOffsetX: 32,
				rsOffsetY: 42
			},
			east: {
				rsId: "building-ranch-east",
				rsOffsetX: 32,
				rsOffsetY: 30
			}
		},
		{
			south: {
				rsId: "building-villa-south",
				rsOffsetX: 30,
				rsOffsetY: 45
			},
			east: {
				rsId: "building-villa-east",
				rsOffsetX: 35,
				rsOffsetY: 38
			}
		}
	];

	/**
	 * Facing directions
	 * @constant
	 * @memberOf Lot.
	 * @type {number}
	 */
	Lot.FACING_NORTH = 0x0100;
	Lot.FACING_SOUTH = 0x0101;
	Lot.FACING_EAST = 0x0102;
	Lot.FACING_WEST = 0x0103;

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
		 * Can the lot be traded?
		 * @type {boolean}
		 */
		this.isTradable = (!(typeof props.tradable !== "undefined" && props.tradable === false));

		if(this.isTradable){
			/** Color marker that shows the owner */
			this.colorMark = require("render/script/colormark")({
				x: this.x,
				y: this.y,
				direction: this.direction
			});
		}
		
		/**
		 * Cost
		 * @type {object}
		 */
		if(props.cost !== "undefined"){
			this.cost = props.cost;
		}

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
		var resource = Upgrades[++this.tier];

		if(this.direction == Lot.FACING_EAST || this.direction == Lot.FACING_WEST){
			resource = resource.east;
		} else if(this.direction == Lot.FACING_NORTH || this.direction == Lot.FACING_SOUTH){
			resource = resource.south;
		}


		if(this.house === null){
			// Draw house for the first time
			this.house = new House(resource.rsId, resource.rsOffsetX, resource.rsOffsetY);
			var pos = ScreenTransform.getTopFaceMidpoint(this.buildingY, this.buildingX);
			this.house.moveTo(pos.x, pos.y);
		} else {
			// Redraw/upgrade house
			this.house.replace(resource.rsId, resource.rsOffsetX, resource.rsOffsetY);
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
		this.colorMark.attr({
			fill: color
		});
	};

	return Lot;
});