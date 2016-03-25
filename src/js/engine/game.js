define([
	"jquery",
	"jquery.pub-sub",
	"engine/config",
	"engine/events",
	"entity/session",
	"render/script/map"
], function($) {
	/** Access to config */
	var Config = require("engine/config");

	/** Game event callbacks */
	var GameEventCallback = require("engine/events");

	/**
	 * Game definition object
	 * @namespace
	 * @alias Game
	 */
	var Game = /** @lends Game# */{
		/**
		 * Current game session
		 * @member {GameSession} session
		 * @memberOf Game.
		 */
		session: null,

		/**
		 * New game session
		 * @memberOf Game.
		 */
		newSession: function() {

			/**
			 * GameSession entity
			 * @external GameSession
			 */
			var GameSession = require("entity/session");
			this.session    = new GameSession();

			//TODO: Remove after testing
			this.session.addPlayer("Player 1", "RED");
			this.session.addPlayer("Player 2", "BLUE");

			//Start game
			this.session.startGame();
		},

		/**
		 * Get current game session
		 * @memberOf Game.
		 * @returns {GameSession} Current game session
		 */
		getSession: function() {
			return this.session;
		}
	};

	//
	// Game events handling
	//

	$("#btn-roll").on("click", GameEventCallback.PlayerAction.DiceRoll);
	$(".player-action-btn-done").on("click", GameEventCallback.PlayerAction.EndTurn);
	$.subscribe("PlayerEndsTurn", GameEventCallback.PlayerAction.EndTurn);
	$(".player-action-btn-buy").on("click", GameEventCallback.PlayerAction.Buy).prop('disabled', true);
	$(".player-action-btn-build").on("click", GameEventCallback.PlayerAction.Upgrade).prop('disabled', true);

	return Game;
});