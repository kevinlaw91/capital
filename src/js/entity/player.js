define([
	"jquery",
	"jquery.pub-sub",
	"render/sprite/token",
	"engine/transform",
	"render/sprite/marker"
], function($) {
	"use strict";

	// Imports
	var ScreenTransform = require("engine/transform"),
		PlayerToken = require("render/sprite/token"),
		GroundMarker = require("render/sprite/marker");

	/**
	 * Represents a player color definition
	 * @typedef {object} PlayerColor
	 * @property {string} LIGHT - Light variant of the color
	 * @property {string} DARK - Dark variant of the color
	 * @property {string} TOKEN - Token resource id
	 */

	/** @constructor */
	function Player(name, color) {
		/**
		 * Player name
		 * @type {string}
		 */
		this.name = name;

		/**
		 * Player color
		 * @type {PlayerColor}
		 */
		this.color = color;

		/** Current position of player */
		this.position = {
			/** Current map grid (column) position of player */
			mapX: 0,
			/** Current map grid (row) position of player */
			mapY: 0
		};

		/**
		 * Amount of cash player possesses
		 * @member {number}
		 */
		this.cash = 0;

		/**
		 * Net worth of player
		 * @member {number}
		 */
		this.netWorth = 0;

		// Create view
		this.token = new PlayerToken(this);

		// Create marker
		this.marker = new GroundMarker();

		// Set as inactive
		this.hideActiveMarker();
	}

	/**
	 * Player color constants
	 * @type {Object.<string, PlayerColor>}
	 */
	Player.COLOR = {
		RED: {
			LIGHT: "#f73134",
			DARK: "#bf4d4f",
			TOKEN: "player-token-red"
		},
		BLUE: {
			LIGHT: "#2fb5ff",
			DARK: "#2db1b1",
			TOKEN: "player-token-blue"
		},
		PINK: {
			LIGHT: "#f37ce8",
			DARK: "#d163c8",
			TOKEN: "player-token-pink"
		}
	};

	/**
	 * Adds an amount of cash to player
	 * @param {number} amount
	 */
	Player.prototype.addCash = function(amount) {
		this.cash += amount;

		// Trigger player info panel refresh
		$.publish("UI.InfoPanel.PlayerInfo.Refresh");
	};

	/**
	 * Deducts an amount of cash from player
	 * @param {number} amount
	 */
	Player.prototype.deductCash = function(amount) {
		this.cash -= amount;

		// Trigger player info panel refresh
		$.publish("UI.InfoPanel.PlayerInfo.Refresh");
	};

	/**
	 * Adds an amount of net worth to player
	 * @param {number} amount
	 */
	Player.prototype.addToNetWorth = function(amount) {
		this.netWorth += amount;

		// Trigger player info panel refresh
		$.publish("UI.InfoPanel.PlayerInfo.Refresh");
	};

	/**
	 * Deducts an amount of net worth from player
	 * @param {number} amount
	 */
	Player.prototype.deductFromNetWorth = function(amount) {
		this.netWorth -= amount;

		// Trigger player info panel refresh
		$.publish("UI.InfoPanel.PlayerInfo.Refresh");
	};

	/**
	 * Move player to x, y position in map
	 * @param {number} x Position in column (x)
	 * @param {number} y Position in row (y)
	 * @param {boolean} [animate=false] Use animation
	 */
	Player.prototype.moveTo = function(x, y, animate) {
		// Promise of animation
		var anim = $.Deferred();

		// Update position
		this.position.mapX = x;
		this.position.mapY = y;

		// Get mid point of the tile
		// Note: Uses (y,x) is not a bug
		var pos = ScreenTransform.getTopFaceMidpoint(y, x);

		// Move ground marker
		this.marker.moveTo(pos.x, pos.y);

		// Move token
		if (animate) {
			this.token.moveTo(pos.x, pos.y, true, anim.resolve);
		} else {
			this.token.moveTo(pos.x, pos.y, false, anim.resolve);
		}

		return anim;
	};

	Player.prototype.bringToFront = function() {
		this.token.bringToFront();
	};

	Player.prototype.showActiveMarker = function() {
		this.marker.show();
	};

	Player.prototype.hideActiveMarker = function() {
		this.marker.hide();
	};

	return Player;
});