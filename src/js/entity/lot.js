define([
	"jquery",
    "jquery.pub-sub",
    "render/script/colormark",
    "render/sprite/house",
], function($) {
	/** Constants for upgrades */
	var MaxTier = 4,
	    Upgrades = [
		{
			rentFactor: 0.15
		},
		{
			rentFactor: 0.25,
			sprites: {
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
			}
		},
		{
			rentFactor: 0.28,
			sprites: {
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
			}
		},
		{
			rentFactor: 0.3,
			sprites: {
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
			}
		},
		{
			rent: 0.38,
			sprites: {
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

		if(typeof props.cost !== "undefined"){
			/**
			 * Cost
			 * @type {object}
			 */
			this.cost = props.cost;

			/**
			 * Rent
			 * @type {number}
			 */
			this.rent = this.cost[0] * Upgrades[0].rentFactor; // 15% of land price
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

		this.house = null;
	}

	Lot.prototype.upgrade = function(){
		// Increase tier
		this.tier = Math.min(++this.tier, MaxTier);

		// Update tier info
		var resource = Upgrades[this.tier].sprites;

		//Check to see if building needs to be rendered
		if(resource){
			// Determine which resource to be used
			if(this.direction == Lot.FACING_EAST || this.direction == Lot.FACING_WEST){
				resource = resource.east;
			} else if(this.direction == Lot.FACING_NORTH || this.direction == Lot.FACING_SOUTH){
				resource = resource.south;
			}

			// Render resource
			if(this.house === null){
				// Draw house for the first time
				this.house = new House(resource.rsId, resource.rsOffsetX, resource.rsOffsetY);
				var pos = ScreenTransform.getTopFaceMidpoint(this.buildingY, this.buildingX);
				this.house.moveTo(pos.x, pos.y);
			} else {
				// Redraw/upgrade house
				this.house.replace(resource.rsId, resource.rsOffsetX, resource.rsOffsetY);
			}
		}
	};

	/** Get the price of current lot */
	Lot.prototype.getPrice = function() {
		return (this.cost)?this.cost[0]:-1;
	};

	/** Get the cost of performing next upgrade */
	Lot.prototype.getNextUpgradeCost = function(){
		return (this.cost)?this.cost[this.tier + 1]:-1;
	};

	/** Checks if upgrade is possible */
	Lot.prototype.upgradeAvailable = function() {
		return this.tier<MaxTier;
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