define([
	"jquery",
	"jquery.pub-sub",
	"engine/config",
	"game/randomizer",
	"engine/dev",
	"utils",
	"game/minigames",
	"ui/user-action-panel"
], function($) {
	"use strict";

	// Imports
	var Config = require("engine/config"),
		MiniGames = require("game/minigames"),
		UserActionPanel = require("ui/user-action-panel"),
		formatAsCurrency = require("utils").formatAsCurrency;

	/**
	 * Reference to the active game session
	 * @type {GameSession}
	 */
	var Session;

	//
	// Utils functions
	//
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
	}

	// Rule namespaces
	var Game, Player, Lot;

	/**
	 * Game flow controls
	 * @namespace
	 */
	Game = {
		// Game states
		state: {
			LISTENING_DICE_ROLL: false
		},

		// Game events
		onDiceRollCompleted: $.noop,

		// Dice roll
		doDiceRoll: function() {
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
		},

		/** Pass turn to next player */
		endCurrentTurn: function() {
			// Current active player
			var player = Session.getActivePlayer();

			if (player) {
				// Note:
				// Active player does not always exist,
				// e.g. during first move of the game
				player.hideActiveMarker();

				log("[GAME_EVENT] Current player ended his turn", "gameevent");
			}

			// Give turn to next player
			Session.turn();
			Player.onActive(Session.getActivePlayer());
		}
	};

	/** Handle dice roll */
	$.subscribe("Player.RollDice", Game.doDiceRoll);

	/**
	 * Player related rules
	 * @namespace
	 */
	Player = {
		/**
		 * Move a player to new position,
		 * returning a promise object that is resolved when reaching destination
		 * @param {object} player
		 * @param {(number|{x: number, y: number}|Lot|TradableLot)} newPosition
		 * @param {function} [onPassBy=$.noop] - Called when passing by a location
		 * @return {Promise} - Resolve value: {player: Object, location: Object}
		 */
		move: function(player, newPosition, onPassBy) {
			// Defaults
			onPassBy = onPassBy || $.noop;

			var waitTime = 75, // Time delay for each steps
				posType = typeof newPosition,
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
		 * Move player by steps
		 * @param {Player} player - Player to move
		 * @param {number} step - Dice roll result
		 */
		moveByStep: function(player, step) {
			Player.move(player, step, Player.onPassby)
			      .then(function(r) {
				      // Reached destination
				      Player.onStop(r.player, r.location);
			      });
		},

		/**
		 * Find player's next move
		 * @returns {Lot|TradableLot}
		 */
		findNextMove: function(player) {
			// Find player's current position relative index in map
			var lot = Session.map.lot;

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
			if (Session.getActivePlayer() === player) {
				player.showActiveMarker();
			}

			// Hide dice button
			$.publish("UI.DiceButton.Hide");

			if (location) {
				switch (location.id) {
					case "MAP-CORNER-0":
						// End current turn
						Game.endCurrentTurn();
						break;
					case "MAP-CORNER-1":
						// Treasure Hunt Mini Game
						MiniGames.PlayTreasureHunt()
						         .then(function(result) {
							         if (result.prize > 0) {
								         CashFlow(player, { add: result.prize, source: "PRIZE" });
							         }
							         Game.endCurrentTurn();
						         });
						break;
					case "MAP-CORNER-2":
						// End current turn
						Game.endCurrentTurn();
						break;
					case "MAP-CORNER-3":
						// End current turn
						Game.endCurrentTurn();
						break;

					// If no special identifier, treat as normal lot
					default:
						var prompt;

						if (location.isOwnedBy(player)) {
							// Stopped at owned property
							if (location.upgradeAvailable()) {
								// Can be upgraded

								// Prompt upgradable
								prompt = UserActionPanel.prompt(
									"PropertyUpgrade",
									{
										// (Boolean) Condition for the offer to be valid
										modifier: {
											offer: (player.cash >= location.getNextUpgradeCost())
										},
										fields: {
											cost: formatAsCurrency(location.getNextUpgradeCost())
										}
									}
								);

								// Handle when player made their decision
								prompt.onResult.then(function(choice) {
									if (choice.value === 1) {
										// User acccepted offer
										var outcome = Lot.upgrade(location, player);

										// Forward outcome back to panel
										choice.forwardOutcome(outcome);
									}
								});

								// Handle prompt dismiss event
								prompt.onDismiss.then(Game.endCurrentTurn);
							} else {
								// Cannot be upgrade
								// End current turn
								Game.endCurrentTurn();
							}
						} else {
							if (!location.owner) {
								// Unowned lot
								log("[GAME_EVENT] This lot can be bought by current player", "gameevent");

								// Prompt for sale
								prompt = UserActionPanel.prompt(
									"PropertyBuy",
									{
										// (Boolean) Condition for the offer to be valid
										modifier: {
											offer: (player.cash >= location.getPrice())
										},
										fields: {
											title: location.name,
											cost: formatAsCurrency(location.getPrice())
										}
									}
								);

								// Handle when player made their decision
								prompt.onResult.then(function(choice) {
									if (choice.value === 1) {
										// User acccepted offer
										var outcome = Lot.buy(location, player);

										// Forward outcome back to panel
										choice.forwardOutcome(outcome);
									}
								});

								// Handle prompt dismiss event
								prompt.onDismiss.then(Game.endCurrentTurn);
							} else {
								// Stopped at others' property

								// Use this sequence so that if popups were stacked,
								// popup for current player will appears on top.
								CashFlow(location.owner, { add: location.rent, source: "RENT" });
								CashFlow(player, { sub: location.rent, source: "RENT" });

								// End current turn
								Game.endCurrentTurn();
							}
						}
				}
			}
		},

		/** When player become active */
		onActive: function(player) {
			log("[GAME_EVENT] \"" + player.name + "\" is now active", "gameevent");

			// Update player token
			player.bringToFront();
			player.showActiveMarker();

			// Show dice button
			$.publish("UI.DiceButton.Show");

			// Accepting dice roll command from player
			Game.state.LISTENING_DICE_ROLL = true;
		}
	};

	/**
	 * Lot related rules
	 * @namespace
	 */
	Lot = {
		/**
		 * Buy active player's current position
		 * @function
		 * @return {boolean}
		 */
		buy: function(lot, player) {
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
		},

		/**
		 * Upgrade active player's current position
		 * @function
		 */
		upgrade: function(lot, player) {
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
		}
	};

	//
	// Dev debugging interface
	//

	// Cheat interface for dev module
	$.subscribe("Cheat", function(evt, data) {
		if (Session.cheat) {
			// Dynamic scoping to expose game rules to dev.cheat()
			eval(data.cheat);
		} else {
			console.warn("Cheat was not enabled.");
		}
	});

	return {
		// Game start entry point
		start: function(session) {
			// Store reference to active session
			Session = session;

			// Set dice roll complete actions
			Game.onDiceRollCompleted = function(result) {
				var player = Session.getActivePlayer();

				// Move player by dice roll result
				player.hideActiveMarker();
				Player.moveByStep(player, result);
			};

			// Give turn to next player
			Session.turn();
			Player.onActive(Session.getActivePlayer());

			// Load developer saved state
			require("engine/dev").loadSaved();
		}
	};
});