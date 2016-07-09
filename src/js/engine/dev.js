define(function() {
	"use strict";

	// Dev Mode Switch
	var devMode = true;

	/**
	 * Reference to game engine
	 * @private
	 * @type {Engine}
	 */
	var G = null;

	/**
	 * Returns current game session
	 * @private
	 * @returns {GameSession}
	 */
	function S() {
		return G.getSession();
	}

	/**
	 * Get player by index
	 * @private
	 * @returns {Player}
	 */
	function playerById(id) {
		return S().players[id];
	}

	/** @namespace */
	var dev = {};

	/**
	 * Custom debug logger
	 * @namespace
	 */
	dev.logger = {
		init: function() {
			// Disable logging by default
			dev.logger.disable();

			// Enable logging in dev mode
			if (devMode) {
				info("Developer debug tool enabled");
				dev.logger.enable();
			}
		},
		enable: function() {
			var style = {
				normal: "color: silver",
				event: "color: gold",
				complete: "color: #00cc65; font-weight: bold",
				success: "color: #00cc65; font-weight: bold",
				gameevent: "color: #F490B1"
			};

			window.info = window.console.info.bind(window.console);
			window.warn = window.console.warn.bind(window.console);
			window.err  = window.console.error.bind(window.console);
			window.log  = function() {
				var args = Array.prototype.slice.call(arguments),
					len = args.length;

				if (args[0]) {
					// Enable styling
					if (typeof args[0] === "string") {
						args[0] = "%c" + args[0];
					}

					if (len === 1) {
						// Use default style if not specified
						args.push(style.normal);
					} else {
						let i = 1;

						while (i < len) {
							args[i] = style[args[i]] || args[i];
							i++;
						}
					}
					window.console.log.apply(window.console, args);
				}
			};
		},
		disable: function() {
			// Set to noop function
			window.log = window.warn = window.err = window.info
			= function() {};
		}
	};

	/** Init function */
	dev.init = function(gameEngine) {
		G = gameEngine;

		// Export to global if dev tool enabled
		if (devMode) {
			window.g   = gameEngine;
			window.dev = dev;
		}

		delete dev.init;
	};

	/**
	 * Run a cheat
	 * @param {string} str - Script to run under the context of game-controller
	 */
	dev.cheat = function(str) {
		$.publish("Cheat", { cheat: str });
	};

	/** Instantly move player to starting position, completing a cycle */
	dev.movePlayerToStartPosition = function(player) {
		var startingPoint = S().map.startingPoint,
			p = playerById(player);

		p.moveTo(startingPoint.x, startingPoint.y, false);
	};

	/** Step player forwards */
	dev.movePlayerBySteps = function(player_index, steps) {
		dev.cheat("Player.move(Session.players[" + player_index + "], " + steps + ")");
	};

	/** Sell specified lot to a player */
	dev.setLotOwner = function(lot, player) {
		S().map.lot[lot].sellTo(playerById(player));
	};

	/** Upgrade specified lot */
	dev.upgradeLot = function(lot) {
		var l = S().map.lot[lot];

		if (l.upgradeAvailable()) {
			l.upgrade();
		}
	};

	/** Generate random game state */
	dev.randomState = function() {
		var map = S().map.lot;

		for (var i=0; i<map.length; i++) {
			var currentLot = map[i];

			if (currentLot.isTradable) {
				if (Math.random() < 0.7) {
					// 70% chance to be sold
					// If sold, 50/50 chance for player 0 and 1
					var player = Math.floor(Math.random() * 2);

					dev.setLotOwner(i, player);

					// 60% chance of upgrade
					while (Math.random() < 0.60) {
						if (map[i].upgradeAvailable()) {
							dev.upgradeLot(i);
						} else {
							break;
						}
					}
				}
			}
		}
	};

	/** Define conditions for debugging */
	dev.loadSaved = function() {
		// Run automatically when game starts
	};

	dev.run = function() {
		// Run predefined scripts when needed
	};

	return dev;
});