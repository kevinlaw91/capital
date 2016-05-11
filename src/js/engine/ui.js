define([
	"jquery",
	"snapsvg",
	"jquery.pub-sub",
	"engine/config",
	"engine/core"
], function( $, Snap ) {
	'use strict';

	/** @namespace UI */
	var UI = {},
	    Config = require("engine/config");

	/**
	 * @namespace Stage
	 * @memberOf UI.
	 */
	UI.Stage = {
		/** <svg> canvas container as Snap instance */
		container: null,
		/** <g> canvas wrapper as Snap instance */
		canvas: null,
		/** Construct stage */
		init: function(){
			//Create new Snap <svg> element
			var stage = new Snap().attr({
				"id": Config.getAsId("canvas.svg"),
				"class": "pannable"
			});

			// Clean up unwanted <desc> element generated by SnapSVG
			$(stage.node).children("desc:first").remove();

			// Append to container
			$(Config.get("canvas.attach")).append(stage.node);

			// Store reference
			UI.Stage.container = stage;
		}
	};

	/**
	 * @param selector - Selector that points to the panel's DOM node
	 * @constructor
	 */
	function Panel( selector ) {
		this.node = $(selector);

		/**
		 * @member {string} selector
		 */

		/**
		 * To be called when the panel's default action is completed
		 * @function
		 * @name onComplete
		 * @instance
		 */

		/**
		 * To be called when the panel is fully shown
		 * @function
		 * @name onVisible
		 * @instance
		 */
	}

	/** Populate data into the fields inside the panel */
	Panel.prototype.populate = function( data ) {
		for(var field in data) {
			if(data.hasOwnProperty(field)) {
				this.node.find("[data-label='" + field + "']")
				    .text(data[field]);
			}
		}
	};

	/** Display the panel */
	Panel.prototype.show = function() {
		// Hide all
		$("#action-panel").find("section").hide();
		// Then show only this
		this.node.show();
		// Mark it as active panel
		UI.UserActionPanel.activePanel = this;
	};

	/**
	 * @namespace UserActionPanel
	 * @memberOf UI.
	 */
	UI.UserActionPanel = {
		/** @type {Panel[]} */
		Panels: [],
		/** Current active panel */
		activePanel: null,
		/**
		 * Use slide animation to reveal UserActionPanel
		 * @param {function} [callback] - Function to be called when show animation is completed
		 */
		open: function( callback ) {
			var c = $.Callbacks();
			c.add(UI.UserActionPanel.activePanel.onVisible);
			if(typeof callback==="function") {
				c.add(callback());
			}

			$("#stage-box-slide").animate(
				{ "bottom": $("#action-panel") .height()},
				250,
				"easeOutCubic",
				$.proxy(c.fire, this.activePanel)
			);
		},
		/**
		 * Use slide animation to hide UserActionPanel
		 * @param {function} callback - Function to be called when hide animation is completed
		 */
		close: function( callback ) {
			$("#stage-box-slide").animate(
				{"bottom": 0},
				250,
				"easeOutCubic",
				callback
			);
		},
		/** Reset panels in UserActionPanel */
		reset: function() {
			$("#action-panel").find("section").removeClass("done").hide();
		},
		/**
		 * Control events dedicated for UserActionPanel
		 * @param {string} data.show - Identifier of the panel to show
		 * @param {object} [data.info] - Data to populate to UI
		 */
		handler: function( evt, data ) {
			//Handle panel display
			if(typeof data.show !== "undefined" && UI.UserActionPanel.Panels.hasOwnProperty(data.show)) {
				// Identify panel
				var panel = UI.UserActionPanel.Panels[data.show];
				//Populate data
				if(typeof data.info !== "undefined"){
					panel.populate(data.info);
				}
				// Display panel
				panel.show();
				// Slide open UserActionPanel
				UI.UserActionPanel.open();
			}
		}
	};

	// Register handler for UserActionPanel
	$.subscribe("UI.UserActionPanel", UI.UserActionPanel.handler);

	// Signals player's turn ended
	function Evt_Fire_PlayerEndsTurn(){
		$.publish("PlayerEndsTurn");
	}

	var Panels = /** @lends UI.UserActionPanel.Panels */{
		"PROPERTY_BUY": /** @type {Panel} */{
			selector: "#action-panel-buy",
			onVisible: function() {
				// Focus default button
				this.node.find("button.main").focus();
			},
			onComplete: function() {
				// Show success animation
				this.node.removeClass("done").addClass("done");
				// Hide player action panel
				window.setTimeout(UI.UserActionPanel.close, 1000);
				// Ends turn
				window.setTimeout(Evt_Fire_PlayerEndsTurn, 1500);
			}
		},
		"PROPERTY_UPGRADE": /** @type {Panel} */{
			selector: "#action-panel-upgrade",
			onVisible: function() {
				// Focus default button
				this.node.find("button.main").focus();
			},
			onComplete: function() {
				// Show success animation
				this.node.removeClass("done").addClass("done");
				// Hide player action panel
				window.setTimeout(UI.UserActionPanel.close, 1000);
				// Ends turn
				window.setTimeout(Evt_Fire_PlayerEndsTurn, 1500);
			}
		}
	};

	// Register panels using the definitions
	for(var id in Panels) {
		if(Panels.hasOwnProperty(id)){
			var panel = Panels[id];
			// Define panel instance
			UI.UserActionPanel.Panels[id] = new Panel(panel.selector);

			// Attach customizations
			for(var prop in panel) {
				if(panel.hasOwnProperty(prop)) {
					UI.UserActionPanel.Panels[id][prop] = panel[prop];
				}
			}
		}
	}

	/**
	 * @namespace DiceButton
	 * @memberOf UI.
	 */
	UI.DiceButton = {
		/** Enable DiceButton */
		enable: function() {
			$("#btn-roll").removeClass("disabled");
		},
		/** Disable DiceButton */
		disable: function() {
			$("#btn-roll").addClass("disabled");
		},
		/** Control events dedicated for DiceButton */
		handler: function( evt, data ) {
			// Handle enable/disable
			if(typeof data.enabled !== "undefined" && data.enabled) {
				UI.DiceButton.enable();
			} else {
				UI.DiceButton.disable();
			}
		}
	};

	// Register handler for DiceButton
	$.subscribe("UI.DiceButton", UI.DiceButton.handler);

	/**
	 * @namespace Tooltip
	 * @memberOf UI.
	 */
	UI.Tooltip = {
		show: function(){
			$("#game-tooltip").show();
		},
		hide: function() {
			$("#game-tooltip").hide();
		},
		redraw: function(data){
			UI.Tooltip.setPosition(data.position.left, data.position.top);

			// Fetch live info from game session
			var info = fetchActiveSession().map[data.id];
			$("#game-tooltip-contents").text(info.name);
		},
		setPosition: function( left, top ) {
			$("#game-tooltip").css({
				"left": left,
				"top": top
			});
		},
		controller: function(evt, data){
			var actions = {
				"show": function(){
					UI.Tooltip.redraw(data);
					UI.Tooltip.show();
				},
				"hide": function() {
					UI.Tooltip.hide();
				}
			};

			actions[evt.data.action]();
		}
	};

	// Register handler for Lot sprite onHoverEnter
	$.subscribe("UI.Tooltip.Show", { "action": "show" }, UI.Tooltip.controller);
	$.subscribe("UI.Tooltip.Hide", { "action": "hide" }, UI.Tooltip.controller);

	/**
	 * @namespace InfoPanel
	 * @memberOf UI.
	 */
	UI.InfoPanel = {
		activePanel: null,
		Panels: {
			LotInfo: {
				node: $("#info-panel-lot"),
				refresh: function( evt, data ) {
					/**
					 * @param {number} data.lot_id - Id of the lot
					 */

					// Fetch data from game session
					var panel = UI.InfoPanel.Panels.LotInfo.node,
						lot = fetchActiveSession().map[data.lot_id];

					// Definition of fields to be updated and its value
					var fields = {
						"title": lot.name,
						"tier": lot.tier,
						"tier-title": [
							"Empty Lot",
							"Tier 1",
							"Tier 2",
							"Tier 3",
							"Tier 4"
						][lot.tier],
						"cost": "$" + lot.cost[0],
						"upgrade1": "$" + lot.cost[1],
						"upgrade2": "$" + lot.cost[2],
						"upgrade3": "$" + lot.cost[3],
						"upgrade4": "$" + lot.cost[4]
					};

					// Update fields
					Object.keys(fields)
					      .forEach( function (key) {
						      panel.find("[data-label='" + key + "']")
						           .text(fields[key]);
					      });
				}
			},
			Leaderboard: {
				node: $("#info-panel-leaderboard"),
				entries: [],
				rebuild: function() {
					var Leaderboard = require("entity/leaderboard"),
						Panel = UI.InfoPanel.Panels.Leaderboard,
						listNode = Panel.node.find(".leaderboard-list");

					// Start from clean node
					var rows = [];
					listNode.empty();

					// Rebuild leaderboard
					while(rows.length < Leaderboard.ranking.length) {
						// Construct DOM
						var newRow = $("<li/>").append(
							$("<div/>").addClass("player-name").text("PLAYER_NAME"),
							$("<div/>").addClass("player-net-worth").text("PLAYER_CASH")
						);
						newRow.appendTo(listNode);

						// Store reference
						rows.push(newRow);
					}

					// Store reference
					Panel.entries = rows;

					Leaderboard.onRankingChanged = Panel.refresh;
				},
				refresh: function() {
					var Leaderboard = require("entity/leaderboard"),
						Rows = UI.InfoPanel.Panels.Leaderboard.entries;

					// Fill data for all rankings
					Leaderboard.ranking.forEach(
						function (player, index) {
							var row = Rows[index];
							row.find(".player-name").text(player.name);
							row.find(".player-net-worth").text("$" + player.netWorth);
						}
					);
				}
			}
		},
		show: function( evt, data ){
			/**
			 * @param {string} evt.data.panel - Id of the panel
			 * @param {boolean} [evt.data.refresh] - State whether to refresh view
			 */
			var panel = UI.InfoPanel.Panels[evt.data.panel];

			// Hide current active panel
			if(UI.InfoPanel.activePanel) {
				UI.InfoPanel.activePanel.node.hide();
				UI.InfoPanel.activePanel = null;
			}

			// Show panel
			panel.node.show();
			UI.InfoPanel.activePanel = panel;
		}
	};

	// Register handler for Lot sprite onClick
	$.subscribe("UI.InfoPanel.LotInfo.Refresh", UI.InfoPanel.Panels.LotInfo.refresh);
	$.subscribe("UI.InfoPanel.LotInfo.Show", { panel: "LotInfo" }, UI.InfoPanel.show);

	// Register handlers for leaderboard
	$.subscribe("UI.InfoPanel.Leaderboard.Rebuild", UI.InfoPanel.Panels.Leaderboard.rebuild);
	$.subscribe("UI.InfoPanel.Leaderboard.Refresh", UI.InfoPanel.Panels.Leaderboard.refresh);
	$.subscribe("UI.InfoPanel.Leaderboard.Show", { panel: "Leaderboard" }, UI.InfoPanel.show);

	/**
	 * Fetch current active game session
	 * @private
	 * @returns {GameSession}
	 */
	function fetchActiveSession(){
		return require("engine/core").getSession();
	}

	return UI;
});