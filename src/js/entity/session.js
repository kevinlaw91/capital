define([
	"jquery",
	"jquery.pub-sub",
	"game/map-generator",
	"engine/events",
	"entity/player",
	"render/script/map",
	"script/map-recentering"
], function($) {
	'use strict';

	// Imports

	/**
	 * Player entity
	 * @class
	 */
	var Player = require("entity/player");

	/**
	 * Statuses of GameSession
	 * @constant
	 * @memberOf GameSession.
	 * @type {number}
	 */
	GameSession.GAME_STATE_NEW = 0x000100;
	GameSession.GAME_STATE_RUNNING = 0x000101;

	/**
	 * Game session that holds information about current match
	 * @constructor
	 */
	function GameSession(){
		log("[EVENT] Created new game session", "event");
		this.status = GameSession.GAME_STATE_NEW;

		/** Waiting for dice roll to happen */
		this.waitForDiceRoll(false);

		/**
		 * Players in current match
		 * @type {Player[]}
		 */
		this.players = [];
		this.currentPlayerIndex = -1;

		// Generate map
		this.map = require("game/map-generator").generate();

		// Draw map
		require("render/script/map")();
		require("script/map-recentering")();

		// Register as active session
		registerActiveSession(this);
	}

	GameSession.prototype.addPlayer = function(name, color){
		var player = new Player(name, color);
		this.players.push(player);

		// Move to starting point
		player.position.index = 0;
		player.position.lot = this.map[0];
		player.moveTo(this.map[0].x, this.map[0].y, false);

		// Set starting cash
		player.cash = 20000;

		// Set starting net worth
		player.netWorth = 20000;
	};

	GameSession.prototype.getActivePlayer = function() {
		return this.players[this.currentPlayerIndex];
	};

	GameSession.prototype.movePlayer = function(evt, data) {
		/**
		 * @param evt.data.session - Current game session
		 * @param {Boolean} evt.data.forward - Move a step forward
		 * @param {number} data.x - X grid position  to move to
		 * @param {number} data.y - Y grid position to move to
		 * @param {number} data.lot - Position (lot) to move to
		 */

		/**
		 * Current session map data
		 * @type {Array.<Lot|TradableLot>}
		 */
		var MapData = evt.data.session.map;

		if(data.lot){
			// Move player to specified lot in board
			data.player.moveTo(MapData[data.lot].x, MapData[data.lot].y, true);
		} else if(evt.data.forward) {
			// Move player forward in board
			data.player.position.index = ++data.player.position.index % 40;
			var newPosition = MapData[data.player.position.index];
			data.player.position.lot = newPosition;
			data.player.moveTo(newPosition.x, newPosition.y, true);
		} else if(typeof data.x !== "undefined" && typeof data.y !== "undefined") {
			// Move player to specified x, y location in map
			data.player.moveTo(data.x, data.y, true);
		}
	};

	GameSession.prototype.getLot = function(x, y) {
		// Query for matching lot
		// Note: Impossible to have more than 1 result
		var match = this.map.filter(
			function(Lot){ return (Lot.x == x && Lot.y == y); }
		);

		//Result found
		if(match.length > 0){
			return match[0];
		} else {
			return null;
		}
	};

	GameSession.prototype.startGame = function(){
		// Update game status
		this.status = GameSession.GAME_STATE_RUNNING;
		log("[EVENT] Game session started", "event");

		// Show player 0 as active player
		this.currentPlayerIndex = 0;
		this.getActivePlayer().bringToFront();
		this.getActivePlayer().showActiveMarker();
		this.waitForDiceRoll(true);
		log("[GAME_EVENT] Player 0 is now active", "gameevent");
	};

	/**
	 * Set to or not to accept dice roll
	 * @param {boolean} bool - True/False
	 */
	GameSession.prototype.waitForDiceRoll = function(bool) {
		$.publish("UI.DiceButton", { enabled: bool });
		this.awaitingDiceRoll = bool;
	};

	/**
	 * Registers a game session as current active session
	 * @param {GameSession} cSession Current game session
	 */
	function registerActiveSession(cSession){
		/** Attach game event listener to current game session */

		// Load game event callbacks
		var GameEventCallback = require("engine/events");

		/**
		 * Current session reference can be pushed to event handlers
		 * by referencing it in second parameter.
		 * @type {Object}
		 * @example
		 * $.subscribe("EventName", currentSession, event.listener);
		 */
		var currentSession = { session: cSession };

		$.subscribe("MovePlayerTo", currentSession, cSession.movePlayer);
		$.subscribe("MovePlayerForward", { session: cSession, forward: true }, cSession.movePlayer);
		$.subscribe("PlayerActive",GameEventCallback.onPlayerSwitched);
		$.subscribe("PlayerMove", currentSession, GameEventCallback.onPlayerMoved);
		$.subscribe("PlayerEntered", currentSession, GameEventCallback.onPlayerEnter);
		$.subscribe("PlayerStopped", currentSession, GameEventCallback.onPlayerStopped);
		$.subscribe("PlayerCashFlow", GameEventCallback.onCashFlow);
		$.subscribe("DiceRollComplete", GameEventCallback.onDiceRollComplete);
		$.subscribe("PropertyTransfer", GameEventCallback.onPropertyTransfer);
		$.subscribe("PropertyUpgrade", GameEventCallback.onPropertyUpgrade);
	}

	return GameSession;
});