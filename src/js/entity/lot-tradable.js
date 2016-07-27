define([
	"jquery",
	"jquery.pub-sub",
	"entity/lot",
	"render/script/colormark",
	"render/sprite/house"
], function($) {
	"use strict";

	// Imports
	var Lot = require("entity/lot");
	var ScreenTransform = require("engine/transform");
	var House = require("render/sprite/house");

	// Constants for upgrades

		/** Maximum upgrade */
	var MaxTier = 4,
		/** Upgrade configurations */
		Upgrades = [
			{
				// No sprite
			},
			{
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
	 * Represents a tradable lot in the map
	 * @namespace TradableLot
	 * @param {object} props - Properties to be applied to the lot
	 * @constructor
	 * @augments Lot
	 */
	function TradableLot(props) {
		// Calling superclass constructor
		Lot.call(this, props);

		/** jQuery wrapper */
		this.$ = $(this);

		/** Name */
		this.name = props.name;

		/** XY grid position for building */
		this.buildingX = props.b.x;
		this.buildingY = props.b.y;

		/** Color marker that shows the owner */
		this.colorMark = require("render/script/colormark")({
			x: this.x,
			y: this.y,
			direction: this.direction
		});

		/**
		 * Cost
		 * @type {object}
		 */
		this.cost = props.cost;

		/**
		 * Current upgrade tier
		 * @type {number}
		 */
		this.tier = 0;

		/**
		 * Rent Value
		 * @type {Number[]}
		 */
		this.rentValue = props.rentValue;

		/**
		 * Rent
		 * @type {number}
		 */
		this.rent = 0;

		// Update rent
		this.updateRent();

		/**
		 * Owner of this lot
		 * @type {Player}
		 * @default null
		 */
		this.owner = null;

		/** House sprite */
		this.house = null;
	}

	// Inherits prototype
	TradableLot.prototype = Object.create(Lot.prototype);
	TradableLot.prototype.constructor = TradableLot;

	/** Lot is tradable */
	TradableLot.prototype.isTradable = true;

	/** Recalculate rent based on current net worth and tier */
	TradableLot.prototype.updateRent = function() {
		this.rent = this.rentValue[this.tier];
		this.$.trigger("Update.Rent");
	};

	/** Perform upgrade */
	TradableLot.prototype.upgrade = function() {
		// Increase tier
		this.tier = Math.min(++this.tier, MaxTier);
		this.$.trigger("Update.Tier");

		// Update rent
		this.updateRent();

		// Check to see if building needs to be rendered
		var resource = Upgrades[this.tier].sprites;

		if (resource) {
			// Determine which resource to be used
			if (this.direction === Lot.prototype.FACING_EAST ||
			    this.direction === Lot.prototype.FACING_WEST) {
				resource = resource.east;
			} else if (this.direction === Lot.prototype.FACING_NORTH ||
			           this.direction === Lot.prototype.FACING_SOUTH) {
				resource = resource.south;
			}

			// Render resource
			if (this.house === null) {
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
	TradableLot.prototype.getPrice = function() {
		return (this.cost)?this.cost[0]:-1;
	};

	/** Get the cost of performing next upgrade */
	TradableLot.prototype.getNextUpgradeCost = function() {
		return (this.cost)?this.cost[this.tier + 1]:-1;
	};

	/** Checks if upgrade is possible */
	TradableLot.prototype.upgradeAvailable = function() {
		return this.tier<MaxTier;
	};

	/**
	 * Set reference to a new owner
	 * @param {Player} newOwner
	 */
	TradableLot.prototype.sellTo = function(newOwner) {
		this.owner = newOwner;
		this.markColor(newOwner.color.DARK);
		this.$.trigger("Update.Owner");
	};

	/**
	 * Check if current owner is the specified player
	 * @param {Player} owner
	 * @return {boolean}
	 */
	TradableLot.prototype.isOwnedBy = function(owner) {
		return this.owner === owner;
	};

	/**
	 * Change the color of the marker
	 * @param {string} color
	 */
	TradableLot.prototype.markColor = function(color) {
		this.colorMark.attr({
			fill: color
		});
	};

	return TradableLot;
});