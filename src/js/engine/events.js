define([
	"jquery",
	"engine/ui",
	"engine/game",
	"engine/config",
    "entity/session"
], function($) {
	'use strict';
	/** Access to config */
	var Config = require("engine/config"),
		UI = require("engine/ui");

	/**
	 * @namespace
	 * @alias GameEventCallback
	 */
	var ev = {
		/**
		 * Reference to player fired actions
		 * @namespace ev.PlayerAction
		 */
		PlayerAction: {}
	};

	//
	// Player initiated actions
	//

	ev.PlayerAction.DiceRoll = function(){
		var result = 1 + Math.floor(Math.random() * 6);
		$.publish("DiceRollComplete", result);
	};

	ev.PlayerAction.EndTurn = function(){
		var game_session = require("engine/game").getSession();

		//Hide active marker for current player
		game_session.getActivePlayer().hideActiveMarker();

		// Show dice button
		$("#player-action-button").removeClass("show hide moving").addClass("show");

		//Disable player buttons
		//TODO: Polish
		$(".player-action-btn-buy").prop('disabled', true);
		$(".player-action-btn-build").prop('disabled', true);

		// Hide action panel
		UI.hideUserActionPanel();

		log("[GAME_EVENT] Current player ended his turn", "gameevent");

		//Skip to next player
		game_session.currentPlayerIndex = ++game_session.currentPlayerIndex % game_session.players.length;

		//Bring player to front
		game_session.getActivePlayer().bringToFront();

		//Show active marker for next player
		game_session.getActivePlayer().showActiveMarker();

		$.publish("PlayerActive", {player: game_session.getActivePlayer(), playerIndex: game_session.currentPlayerIndex});
	};

	ev.PlayerAction.Buy = function() {
		var currentPlayer = require("engine/game").getSession().getActivePlayer();

		//Attempt to buy current location
		var action = currentPlayer.buy();

		//Disable buy option if success
		if(action === true) {
			UI.feedbackUserActionPanel(true);

			//TODO: Polish
			$("#btn-buy").prop('disabled', true);
		}
	};

	ev.PlayerAction.Upgrade = function(){
		var currentPlayer = require("engine/game").getSession().getActivePlayer();

		//Attempt to buy current location
		currentPlayer.upgrade();
		
		// Hide action panel
		UI.hideUserActionPanel();

		//End current turn
		ev.PlayerAction.EndTurn();

		//Can only upgrade once every turn
		//TODO: Polish
		$(".player-action-btn-build").prop('disabled', true);
	};

	//
	// Game events
	//

	ev.onDiceRollComplete = function(evt, data){
		// Decline any pending offer
		var game_session = require("engine/game").getSession();

		// Show moving status
		$("#player-action-button").removeClass("show hide moving").addClass("moving");

		//TODO:Polish
		$(".player-action-btn-buy").prop('disabled', true);
		$(".player-action-btn-build").prop('disabled', true);

		log("[GAME_EVENT] Dice roll result: " + data, "gameevent");
		window.setTimeout(function(){
			var currentPlayer = require("engine/game").getSession().getActivePlayer();
			currentPlayer.hideActiveMarker();
			currentPlayer.moveBySteps(data);
		}, Config.get("player.token.waitTime"));
	};

	ev.onPlayerMoved = function(evt, data){
		/**
		 * @param {GameSession} evt.data.session - Current game session
		 * @param {Player} data.player - Player that moved
		 * @param {number} data.x - To this X grid position in map (cached, use data.player.x for live data)
		 * @param {number} data.y - To this Y grid position in map (cached, use data.player.x for live data)
		 */

		// Load GameSession class
		var GameSession = require("entity/session");

		// Current session
		var cSession = evt.data.session;

		//Event can be fired when player move to start position before game starts
		//Do not propagate the event in this case

		if(cSession.status == GameSession.GAME_STATE_RUNNING){
			log("[GAME_EVENT] Player walks to " + data.player.position.mapX + "," + data.player.position.mapY, "gameevent");
			var currentLot = cSession.getLot(data.player.position.mapX,data.player.position.mapY);
			if(currentLot !== null){
				$.publish("PlayerEntered", { player: data.player, lot: currentLot });
			}
		}
	};

	ev.onPlayerEnter = function(evt, data) {
		/**
		 * @param {GameSession} evt.data.session - Current game session
		 * @param {Player} data.player - Player that triggered the enter event
		 * @param {Lot} data.lot - Player entered lot
		 */

		//Current position
		var lot = data.lot;

		//Log only when entered special region
		if(lot.id){
			log("[GAME_EVENT] Player entered: " + lot.id, "gameevent");
		}

		//Handle player entering region
		switch(lot.id){
			case "MAP-CORNER-0":
				$.publish("PlayerCashFlow", { player: data.player, add: 2000, source: "ROUND_TRIP" });
				break;
		}
	};

	ev.onPlayerStopped = function(evt, data){
		/**
		 * @param {GameSession} evt.data.session - Current game session
		 * @param {Player} data.player - Player that triggered the enter event
		 */
		var pos = data.player.position,
		    /** @type Lot */
		    lot = evt.data.session.getLot(pos.mapX, pos.mapY);
		log("[GAME_EVENT] Player stopped at " + pos.mapX + "," + pos.mapY, "gameevent");

		// Show active indicator if player is active
		if(evt.data.session.getActivePlayer() === data.player){
			data.player.showActiveMarker();
		}

		// Hide dice button
		$("#player-action-button").removeClass("show hide moving").addClass("hide");

		if(lot !== null){
			switch(lot.id){
				case "MAP-CORNER-0":
					//End current turn
					ev.PlayerAction.EndTurn();
					break;
				case "MAP-CORNER-1":
					//End current turn
					ev.PlayerAction.EndTurn();
					break;
				case "MAP-CORNER-2":
					//End current turn
					ev.PlayerAction.EndTurn();
					break;
				case "MAP-CORNER-3":
					//End current turn
					ev.PlayerAction.EndTurn();
					break;

				//If no special identifier, treat as normal lot
				default:
					property();
			}
		}

		function property(){
			if (lot.isOwnedBy(data.player)){
				//Stopped at own property
				if(lot.upgradeAvailable()){
					//TODO: Polish
					$(".player-action-btn-build").prop('disabled', false);

					// Show action panel
					UI.showUserActionPanel("upgrade");
				} else {
					//End current turn
					ev.PlayerAction.EndTurn();
				}
			} else {
				if(lot.owner === null){
					//Unowned, offer for sale
					log("[GAME_EVENT] This lot can be bought by current player", "gameevent");

					//TODO: Polish
					$(".player-action-btn-buy").prop('disabled', false);

					// Show action panel
					UI.showUserActionPanel("buy");
				} else {
					//Stopped at others' property

					//Use this sequence so that if popups were stacked,
					//popup for current player will appears on top.
					$.publish("PlayerCashFlow", { player: lot.owner, add: lot.rent, source: "RENT" });
					$.publish("PlayerCashFlow", { player: data.player, sub: lot.rent, source: "RENT" });

					//End current turn
					ev.PlayerAction.EndTurn();
				}
			}
		}
	};

	ev.onPlayerSwitched = function(evt, data){
		log("[GAME_EVENT] Player " + data.playerIndex + " is now active", "gameevent");
	};

	ev.onCashFlow = function(evt, data) {
		/**
		 * @param {Player} data.player - Affected player
		 * @param {number} [data.add] - Amount to add
		 * @param {number} [data.sub] - Amount to subtract
		 * @param {string} [data.source] - Source of income/debt
		 */
		var icon = {
			"ROUND_TRIP": "icon-cycle",
			"RENT": "icon-house"
		}[data.source];

		var options = icon ? {icon: icon}:{};

		if(typeof data.add != "undefined"){
			data.player.addCash(data.add);
			data.player.token.popup("$" + data.add,
				$.extend(options, {
					color: "#3C4894",
					iconColor: "#2363A0",
					prefix: "+",
					prefixColor: "#3C4894"
				})
			);
			log("[GAME_EVENT] Player earned $" + data.add + " (Now: $" + data.player.cash + ")", "gameevent");
		}

		if(typeof data.sub != "undefined"){
			data.player.deductCash(data.sub);
			data.player.token.popup("$" + data.sub,
				$.extend(options, {
					color: "#901717",
					iconColor: "#D22A2A",
					prefix: "-",
					prefixColor: "#901717"
				})
			);
			log("[GAME_EVENT] Player losses $" + data.sub + " (Now: $" + data.player.cash + ")", "gameevent");
		}
	};

	ev.onPropertyTransfer = function(evt, data) {
		/**
		 *  @param {Player} data.player - New owner of the property
		 *  @param {Lot} data.lot - The property sold to the new owner
		 */
		log("[GAME_EVENT] " + data.player.name + " bought the unowned lot", "gameevent");
	};

	ev.onPropertyUpgrade = function(evt, data) {
		/**
		 *  @param {Player} data.player - Player that performed the upgrade
		 *  @param {Lot} data.lot - The upgraded property
		 */
		log("[GAME_EVENT] " + data.player.name + " upgraded the lot", "gameevent");
	};

	return ev;
});