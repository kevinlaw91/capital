define([
	"jquery",
	"jquery.pub-sub",
	"engine/config",
	"game/randomizer",
	"engine/dev",
	"utils",
	"game/minigames"
], function($) {
	"use strict";

	// Imports
	var Config = require("engine/config"),
		MiniGames = require("game/minigames"),
		formatAsCurrency = require("utils").formatAsCurrency;

	//
	// Utils functions
	//

	/**
	 * Get current game session instance
	 * @returns {GameSession}
	 */
	function getSession() {
		return require("engine/game").getSession();
	}

	/**
	 * @function
	 * @param {Player} player
	 * @param {object} args - Parameters
	 * @param {number} [args.add] - Amount to add
	 * @param {number} [args.sub] - Amount to subtract
	 * @param {string} [args.source] - Reason
	 */
	function CashFlow(player, args) {
		if (typeof args.add !== "undefined") {
			player.addCash(args.add);
			player.addToNetWorth(args.add);

			player.token.popup("$" + args.add, {
				color: "#004d04",
				prefix: "+",
				prefixColor: "#004d04"
			});
			log("[GAME_EVENT] Player earned $" + args.add + " (Now: $" + player.cash + ")", "gameevent");
		}

		if (typeof args.sub !== "undefined") {
			player.deductCash(args.sub);
			player.deductFromNetWorth(args.sub);

			player.token.popup("$" + args.sub, {
				color: "#512309",
				prefix: "−",
				prefixColor: "#512309"
			});
			log("[GAME_EVENT] Player losses $" + args.sub + " (Now: $" + player.cash + ")", "gameevent");
		}

		// Update ranking
		$.publish("Leaderboard.sort");
	}

	/**
	 * Offer object
	 * @param {function} fnAccept - Actions when an offer was accepted
	 * @constructor
	 */
	function Offer(fnAccept) {
		var _accept = fnAccept;

		/** @returns {boolean} */
		this.accept = function() {
			var result = _accept();

			_accept = null;
			delete this.accept;

			return result;
		};

		this.decline = function() {
			_accept = null;
			delete this.accept;
			delete this.decline;
		};
	}

	/**
	 * Game flow controls
	 * @namespace
	 */
	var Game = {
		// Game states
		state: {
			LISTENING_DICE_ROLL: false
		},

		// Game events
		onDiceRollCompleted: $.noop
	};

	/**
	 * Handle dice roll
	 * @function
	 */
	$.subscribe("Player.RollDice", function() {
		if (Game.state.LISTENING_DICE_ROLL) {
			// Perform dice roll and inform to UI
			var result = require("game/randomizer").DiceRoll();

			// Show moving status
			$.publish("UI.DiceButton.Indeterminate");

			// Emulate dice rolling time
			new Promise(function(resolve) {
				window.setTimeout(
					function() { resolve(result); },
					Config.get("player.token.waitTime")
				);
			}).then(Game.onDiceRollCompleted);
		}

		// Stop listening for now
		Game.state.LISTENING_DICE_ROLL = false;
	});

	// Rule entities
	var Lot, Player;

	/** Player related rules */
	Player = {
		/**
		 * Move a player to new position
		 * @param {object} player
		 * @param {(number|{x: number, y: number}|Lot|TradableLot)} newPosition
		 * @param {function} [onPassBy=$.noop] - Called when passing by a location
		 */
		move: function(player, newPosition, onPassBy) {
			// Defaults
			onPassBy = onPassBy || $.noop;

			var Session = getSession(),
				waitTime = 75; // Delay time for each steps
			var posType = typeof newPosition,
				step = (posType === "number")? newPosition: null,
				reached,
				lot;

			// Determine next position
			if (step !== null) {
				// Steps
				lot = Player.findNextMove(player);
				step--; // Reduce step by 1
				reached = (step === 0); // Determine if reached destination
			} else if (posType === "object" &&
			           "x" in newPosition &&
			           "y" in newPosition) {
				// Accept {x: number, y: number} or Lot instances
				lot = Session.map.match(newPosition.x, newPosition.y);
				reached = true;
			}

			if (lot) {
				return new Promise(function(resolve) {
					// Move player to the next position
					player.moveTo(lot.x, lot.y, true)
					      .then(function() {
						      // Player moved
						      // Trigger onPassBy event callback
						      onPassBy(player, lot);

						      if (!reached) {
							      // If not finish moving yet, scheduling next move
							      setTimeout(function() {
								      Player.move(player, step, onPassBy)
								            .then(resolve); // Resolve recursive promises
							      }, waitTime);
						      } else {
							      // Reached destination
							      resolve({ player: player, location: lot });
						      }
					      });
				});
			} else {
				throw new Error("Unable to move player. Invalid location was specified.");
			}
		},

		/**
		 * Find player's next move
		 * @returns {Lot|TradableLot}
		 */
		findNextMove: function(player) {
			// Find player's current position relative index in map
			var Session = getSession(),
				lot = Session.map.lot;

			// Player's current position index
			var i = Session.map.findIndex(
				player.position.mapX,
				player.position.mapY
			);

			if (typeof i === "number") {
				// Return next lot
				return lot[++i % lot.length];
			} else {
				throw new Error("Player's position was unpathable");
			}
		},

		/** When player entered a place */
		onPassby: function(player, location) {
			// Pass by special region
			if (location.id) {
				log("[GAME_EVENT] Player entered " + location.id, "gameevent");

				switch (location.id) {
					case "MAP-CORNER-0":
						CashFlow(player, { add: 2000, source: "ROUND_TRIP" });
						break;
				}
			} else {
				log("[GAME_EVENT] Player entered " + location.x + "," + location.y, "gameevent");
			}

		},

		/** When player stopped at a location */
		onStop: function(player, location) {
			log("[GAME_EVENT] Player stopped at " + location.x + "," + location.y, "gameevent");

			// Show active indicator if player is active
			if (getSession().getActivePlayer() === player) {
				player.showActiveMarker();
			}

			// Hide dice button
			$.publish("UI.DiceButton.Hide");

			if (location) {
				switch (location.id) {
					case "MAP-CORNER-0":
						// End current turn
						Player.turn();
						break;
					case "MAP-CORNER-1":
						// Treasure Hunt Mini Game
						MiniGames.PlayTreasureHunt()
						         .then(function(result) {
							         if (result.prize > 0) {
								         CashFlow(player, { add: result.prize, source: "PRIZE" });
							         }
							         Player.turn();
						         });
						break;
					case "MAP-CORNER-2":
						// End current turn
						Player.turn();
						break;
					case "MAP-CORNER-3":
						// End current turn
						Player.turn();
						break;

					// If no special identifier, treat as normal lot
					default:
						if (location.isOwnedBy(player)) {
							// Stopped at owned property
							if (location.upgradeAvailable()) {
								// Can be upgraded
								// Show prompt
								$.publish("UI.UserActionPanel.PromptPropertyUpgrade", {
									offer: new Offer(
										function() {
											// Determine success/fail using return value
											return Lot.upgrade(location, player);
										}
									),
									fields: {
										cost: formatAsCurrency(location.getNextUpgradeCost())
									},
									onComplete: Player.turn
								});
							} else {
								// Cannot be upgrade
								// End current turn
								Player.turn();
							}
						} else {
							if (!location.owner) {
								// Unowned lot
								log("[GAME_EVENT] This lot can be bought by current player", "gameevent");

								// Offer lot for purchase
								$.publish("UI.UserActionPanel.PromptPropertyBuy", {
									offer: new Offer(
										function() {
											// Determine success/fail using return value
											return Lot.buy(location, player);
										}
									),
									fields: {
										title: location.name,
										cost: formatAsCurrency(location.getPrice())
									},
									onComplete: Player.turn
								});
							} else {
								// Stopped at others' property

								// Use this sequence so that if popups were stacked,
								// popup for current player will appears on top.
								CashFlow(location.owner, { add: location.rent, source: "RENT" });
								CashFlow(player, { sub: location.rent, source: "RENT" });

								// End current turn
								Player.turn();
							}
						}
				}
			}
		},

		/** Pass turn to next player */
		turn: function() {
			var Session = getSession();

			// Current active player
			var player = Session.getActivePlayer();

			if (player) {
				// Note:
				// Active player does not always exist,
				// e.g. first move of the game
				player.hideActiveMarker();

				log("[GAME_EVENT] Current player ended his turn", "gameevent");
			}

			// Give turn to next player
			Session.turn();

			// New active player
			var nextPlayer = Session.getActivePlayer();

			nextPlayer.bringToFront();
			nextPlayer.showActiveMarker();

			log("[GAME_EVENT] \"" + nextPlayer.name + "\" is now active", "gameevent");

			// Show dice button
			$.publish("UI.DiceButton.Show");

			// Accepting dice roll command from player
			Game.state.LISTENING_DICE_ROLL = true;
		}
	};

	/** Lot related rules */
	Lot = {
		/**
		 * Buy active player's current position
		 * @function
		 */
		buy: function(lot, player) {
			var Session = getSession();

			if (Session.getActivePlayer() === player) {
				// Check if lot is currently unowned and is open for trading
				if (lot && lot.isTradable && lot.owner === null) {
					// Buy
					log("[GAME_EVENT] " + player.name + " bought the unowned lot", "gameevent");
					lot.sellTo(player);
					player.deductCash(lot.getPrice());

					return true;
				}
			}

			return false;
		},

		/**
		 * Upgrade active player's current position
		 * @function
		 */
		upgrade: function(lot, player) {
			var Session = getSession();

			if (Session.getActivePlayer() === player) {
				// Check if current lot is owned by player and upgrade is possible
				if (lot && lot.isTradable && lot.isOwnedBy(player) && lot.upgradeAvailable()) {
					// Upgrade
					log("[GAME_EVENT] " + player.name + " upgraded the lot", "gameevent");
					player.deductCash(lot.getNextUpgradeCost());
					lot.upgrade();

					return true;
				}
			}

			return false;
		}
	};

	//
	// Dev debugging interface
	//

	// Secret key for dev module to access controller
	var SECRET_KEY = {};

	// Generate secret key
	if (window.crypto && window.crypto.getRandomValues) {
		var byteArray = new Uint32Array(2);

		window.crypto.getRandomValues(byteArray);
		SECRET_KEY.key = byteArray[0].toString(36) + byteArray[1].toString(36);
	} else {
		SECRET_KEY.key = (Math.random() * new Date().getTime()).toString(36).replace(/\./g, "");
	}

	// Pass to dev module
	require("engine/dev").storeSecret(SECRET_KEY);

	// Cheat interface for dev module
	$.subscribe("Cheat", function(evt, data) {
		// To prevent abuse
		// do not accept cheat command without correct token
		if (data.token && data.token === SECRET_KEY) {
			var args = data.cheat.split(" "),
				cmd = args[0],
				s = getSession();

			try {
				switch (cmd) {
					case "move":
						Player.move(s.players[args[1]], Number(args[2]));
						break;
				}
			} catch (e) { throw new TypeError("Invalid cheat command."); }
		} else { throw new Error("Invalid cheat token."); }
	});

	return {
		// Game start entry point
		start: function() {
			Game.onDiceRollCompleted = function(result) {
				var p = getSession().getActivePlayer();

				p.hideActiveMarker();
				Player.move(p, result, Player.onPassby)
				      .then(function(r) {
					      // Reached dstination
					      Player.onStop(r.player, r.location);
				      });
			};

			// First player's turn
			Player.turn();

			// Run dev saved state
			require("engine/dev").loadSaved();
		}
	};
});