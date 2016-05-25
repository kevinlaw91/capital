define([
	"jquery",
	"entity/session",
	"game/leaderboard"
], function($) {
	'use strict';

	// Imports
	/**
	 * Represents a game session object
	 * @class
	 */
	var GameSession = require("entity/session");

	/**
	 * Game definition object
	 * @exports module:engine/game
	 * @namespace
	 */
	var Game = {
		/**
		 * Current game session
		 * @type {GameSession}
		 */
		session: null,

		/** New game session */
		newSession: function() {
			// Create new session
			Game.session = new GameSession();

			//TODO: Remove after testing
			Game.session.addPlayer("Player 1", "RED");
			Game.session.addPlayer("Player 2", "BLUE");
			Game.session.addPlayer("Player 3", "PINK");

			// Update leaderboard with players
			Game.leaderboard.populate(this.session.players);
			$.publish("UI.InfoPanel.Leaderboard.Rebuild");
			$.publish("UI.InfoPanel.Leaderboard.Refresh");
			$.publish("UI.InfoPanel.Leaderboard.Show");

			// Start game
			Game.session.startGame();
		},

		/**
		 * Get current game session
		 * @returns {GameSession} Current game session
		 */
		getSession: function() {
			return Game.session;
		},

		/**
		 * Leaderboard object to track ranking of players
		 * @see module:game/leaderboard
		 */
		leaderboard: require("game/leaderboard")
	};

	return Game;
});