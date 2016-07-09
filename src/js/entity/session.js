define([
	"entity/map",
	"entity/player",
	"render/script/map",
	"engine/script/stage-cleanup",
	"game/game-controller"
], function() {
	"use strict";

	// Imports

	/**
	 * Player entity
	 * @class
	 */
	var Player = require("entity/player"),
		GameController = require("game/game-controller");

	/**
	 * Game session that holds information about current match
	 * @constructor
	 */
	function GameSession() {
		log("[EVENT] Created new game session", "event");

		/** @type {boolean} */
		this.cheat = true;

		/**
		 * Players in current match
		 * @type {Player[]}
		 */
		this.players = [];

		/**
		 * Play sequence
		 * @type {Player[]}
		 * //TODO: Randomize
		 */
		var sequence = this.players;

		/**
		 * Active player index in sequence
		 * @type {number}
		 */
		var activePlayerIndex = -1;

		/**
		 * Get current active player
		 * @returns {Player}
		 */
		this.getActivePlayer = function() {
			return sequence[activePlayerIndex];
		};

		/** Turn to next player in sequence */
		this.turn = function() {
			activePlayerIndex = ++activePlayerIndex % sequence.length;
		};

		/**
		 * Generate map for current session
		 * @requires module:entity/map
		 */
		this.map = require("entity/map");
		this.map.generate();

		// Draw map
		require("render/script/map")();
		require("engine/script/stage-cleanup")();
	}

	/**
	 * Add player to session
	 * @param name - Player name
	 * @param color - Color constant
	 * @see Player.COLOR
	 */
	GameSession.prototype.addPlayer = function(name, color) {
		var player = new Player(name, Player.COLOR[color]);

		this.players.push(player);

		// Move to starting point (without using animation)
		player.moveTo(this.map.startingPoint.x, this.map.startingPoint.y, false);

		// Set starting cash
		player.cash = 20000;

		// Set starting net worth
		player.netWorth = 20000;
	};

	/** Start session */
	GameSession.prototype.startGame = function() {
		log("[EVENT] Game session started", "event");
		GameController.start();
	};

	return GameSession;
});