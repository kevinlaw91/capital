define([
	"jquery",
	"jquery.pub-sub",
	"engine/config",
	"game/randomizer",
	"engine/dev",
	"utils",
	"game/minigames"
], function($) {
	'use strict';

	// Imports
	var Config = require("engine/config"),
	    MiniGames = require("game/minigames"),
	    formatAsCurrency = require("utils").formatAsCurrency;

	// Utils function
	function getSession(){
		return require("engine/game").getSession();
	}

	//
	// Dev debugging interface
	//

	// Secret key for dev module to access controller
	var SECRET_KEY = {};

	// Generate secret key
	if(window.crypto && window.crypto.getRandomValues){
		var byteArray = new Uint32Array(2);
		window.crypto.getRandomValues(byteArray);
		SECRET_KEY.key = byteArray[0].toString(36) + byteArray[1].toString(36);
	} else {
		SECRET_KEY.key = (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
	}

	// Pass to dev module
	require("engine/dev").storeSecret(SECRET_KEY);

	// Cheat interface for dev module
	$.subscribe("Cheat", function(evt, data) {
		// To prevent abuse
		// do not accept cheat command without correct token
		if(data.token && data.token === SECRET_KEY) {
			var args = data.cheat.split(" "),
				cmd = args[0],
				s = getSession();
			try {
				switch (cmd){
					case "move":
						Player.move(s.players[args[1]], Number(args[2]));
						break;
				}
			} catch (e) { throw new TypeError("Invalid cheat command."); }
		} else { throw new Error("Invalid cheat token."); }
	});

	/**
	 * Game states
	 */
	var GameState = {
		LISTENING_DICE_ROLL: false
	};

	/**
	 * Handle dice roll
	 * @function
	 */
	$.subscribe("Player.RollDice", function () {
		if(GameState.LISTENING_DICE_ROLL) {
			// Perform dice roll and inform to UI
			var result = require("game/randomizer").DiceRoll();

			// Show moving status
			$.publish("UI.DiceButton.Indeterminate");

			window.setTimeout(function(){
				var p = getSession().getActivePlayer();
				p.hideActiveMarker();
				Player.move(p, result);
			}, Config.get("player.token.waitTime"));
		}

		// Stop listening for now
		GameState.LISTENING_DICE_ROLL = false;
	});

	/**
	 * Player related rules
	 */
	var Player = {
		/**
		 * Move a player to new position
		 * @param player
		 * @param {(number|{number, number}|Lot|TradableLot)} newPosition
		 */
		move: function(player, newPosition){
			var t = typeof newPosition,
				Session = getSession();

			if(typeof player !== "undefined" && t !== "undefined"){
				if(t == "number"){
					// Step counts
					var step = newPosition;
					step--; // Reduce step by 1

					var nextLot = Player.findNextMove(player);

					// Move player
					// Fire relevant callback when animation is done
					player.moveTo(nextLot.x, nextLot.y, true)
					      .done(
						      (step>0)?
						      // When player not stopping yet
						      // i.e. passing by
						      function(){
							      Player.onPassby(player, nextLot);
						      } :
						      // When player finally stopped
						      // i.e. passing by and stopped
						      function(){
							      Player.onPassby(player, nextLot);
							      Player.onStop(player, nextLot);
						      }
					      );

					if(step>0) {
						// Still have to move, only pass by
						setTimeout(
							(function(p){
								return function(){
									Player.move(p, step);
								};
							})(player),
							Config.get("player.token.waitTime")
						);
					}
				} else if(t == "object") {
					// Accept
					// {x:number, y:number}
					// or instance of Lot that have x and y property
					if('x' in newPosition && 'y' in newPosition) {
						var lot = Session.map.match(newPosition.x, newPosition.y);
						if(lot){
							// Move player
							player.moveTo(lot.x, lot.y, true);

							Player.onPassby(player, lot);
							Player.onStop(player, lot);
						}
					}
				} else { throw new Error("Unable to move player. Invalid location was specified."); }
			} else { throw new Error("Unable to move player due to missing parameters"); }
		},

		/**
		 * Find player's next move
		 * @returns {Lot|TradableLot}
		 */
		findNextMove: function(player){
			// Find player's current position relative index in map
			var Session = getSession(),
				lot = Session.map.lot;

			// Player's current position index
			var i = Session.map.findIndex(
				player.position.mapX,
				player.position.mapY
			);

			if(typeof i == "number") {
				// Return next lot
				return lot[++i % lot.length];
			} else {
				throw new Error('Player\'s position was unpathable');
			}
		},

		/** When player entered a place */
		onPassby: function(player, location){
			// Pass by special region
			if(location.id){
				log("[GAME_EVENT] Player entered " + location.id, "gameevent");

				switch(location.id){
					case "MAP-CORNER-0":
						CashFlow(player, {add: 2000, source: "ROUND_TRIP"});
						break;
				}
			} else {
				log("[GAME_EVENT] Player entered " + location.x + "," + location.y, "gameevent");
			}

		},

		/** When player stopped at a location */
		onStop: function(player, location){
			log("[GAME_EVENT] Player stopped at " + location.x + "," + location.y, "gameevent");

			// Show active indicator if player is active
			if(getSession().getActivePlayer() === player){
				player.showActiveMarker();
			}

			// Hide dice button
			$.publish("UI.DiceButton.Hide");

			if(location){
				switch(location.id){
					case "MAP-CORNER-0":
						// End current turn
						Player.turn();
						break;
					case "MAP-CORNER-1":
						// Treasure Hunt Mini Game
						var TreasureHunt = MiniGames.TreasureHunt;
						TreasureHunt.onResult({
							success: function() {
								CashFlow(player, { add: TreasureHunt.getPrize(), source: "PRIZE" });
								Player.turn();
							},
							failed: Player.turn
						});
						TreasureHunt.showDialog();
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
						if (location.isOwnedBy(player)){
							// Stopped at owned property
							if(location.upgradeAvailable()){
								// Can be upgraded
								// Show prompt
								$.publish("UI.UserActionPanel.PromptPropertyUpgrade", {
									offer: new Offer(
										function(){
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
							if(!location.owner){
								// Unowned lot
								log("[GAME_EVENT] This lot can be bought by current player", "gameevent");

								// Offer lot for purchase
								$.publish("UI.UserActionPanel.PromptPropertyBuy", {
									offer: new Offer(
										function(){
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
			if(player){
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
			GameState.LISTENING_DICE_ROLL = true;
		}
	};

	var Lot = {

		/**
		 * Buy active player's current position
		 * @function
		 */
		buy: function(lot, player) {
			var Session = getSession();

			if(Session.getActivePlayer() === player){
				// Check if lot is currently unowned and is open for trading
				if(lot && lot.isTradable && lot.owner === null) {
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

			if(Session.getActivePlayer() === player) {
				// Check if current lot is owned by player and upgrade is possible
				if(lot && lot.isTradable && lot.isOwnedBy(player) && lot.upgradeAvailable()) {
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
	// Economic
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
		if(typeof args.add != "undefined"){
			player.addCash(args.add);
			player.addToNetWorth(args.add);

			player.token.popup("$" + args.add, {
				color: "#004d04",
				prefix: "+",
				prefixColor: "#004d04"
			});
			log("[GAME_EVENT] Player earned $" + args.add + " (Now: $" + player.cash + ")", "gameevent");
		}

		if(typeof args.sub != "undefined"){
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
	function Offer(fnAccept){
		var _accept = fnAccept;

		/** @returns {boolean} */
		this.accept = function(){
			var result = _accept();
			_accept = null;
			delete this.accept;
			return result;
		};

		this.decline = function(){
			_accept = null;
			delete this.accept;
			delete this.decline;
		};
	}
	
	return {
		// Game start entry point
		start: function(){
			// First player's turn
			Player.turn();
		}
	};
});