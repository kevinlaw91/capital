define([
	"jquery",
	"jquery.pub-sub",
	"game/leaderboard",
	"engine/core",
	"utils"
], function($) {
	'use strict';

	// Imports
	var formatAsCurrency = require("utils").formatAsCurrency;

	var InfoPanel = {
		init: function(){
			// Construct tab bar
			var tablist = $("<ul/>").attr("role","tablist");
			tablist.appendTo($("#info-panel-tab"));

			// Generate prototype select method for each tab
			function generateSelectMethod(tab){
				return function() {
					InfoPanel.selectTab(tab);
				};
			}

			// Construct tabs
			for(var t in InfoPanel.Tabs) {
				if(InfoPanel.Tabs.hasOwnProperty(t)) {
					// Generate select() method for each tab
					var tab = InfoPanel.Tabs[t];
					tab.select = generateSelectMethod(tab);

					$("<li/>")
						.attr({
							"id": tab.id,
							"role": "tab",
							"aria-controls": tab.container,
							"aria-selected": "false",
							"tabindex": "0"
						})
						.append("<span>" + tab.label + "</span>")
						.click(tab.select)
						.appendTo(tablist);

					// Run tab setup() if available
					if(tab.setup){
						tab.setup();
					}
				}
			}

			// Show Default panel for Info Tab
			$.publish("UI.InfoPanel.Default.Show");

			delete InfoPanel.init;
		},
	    selectTab: function(tab) {
			var elem = "#" + tab.id;

			// Deselect all tabs
			$("#info-panel-tab")
				.find("li[role='tab']")
				.attr({"aria-selected": "false"})
				.removeClass("selected");

			// Hide all panels
			$("#info-panel")
				.find("section[role='tabpanel']")
				.attr("aria-hidden","true")
				.hide();

			// Set specified tab as selected
			$(elem)
				.attr("aria-selected","true")
				.addClass("selected");

			// Get corresponding tabpanel id and make it visible
			var tabpanelID = $(elem).attr("aria-controls");
			$("#" + tabpanelID).attr("aria-hidden","false")
			                   .show();
		},
		Tabs: {}
	};

	//
	// Define tabs and panels
	//

	/** @alias InfoPanel.Tabs */
	var Tab = InfoPanel.Tabs;

	/**
	 * Info tab
	 * @lends InfoPanel.Tabs.INFO
	 */
	Tab.INFO = {
		id: "info-panel-tab-info",
		container: "info-panel-info",
		label: "INFO",
		showPanel: function(evt){
			/** @param {object} evt.data.panel - A panel object defined in panels property */

			// Hide all panel
			var panels = Tab.INFO.panels;
			for(var p in panels) {
				if(panels.hasOwnProperty(p)) {
					panels[p].node.hide();
				}
			}

			// Show only specified panel
			evt.data.panel.node.show();
		},
		setup: function(){
			var panel;
			/*
			// Setup LOTINFO panel
			*/
			panel = Tab.INFO.panels.LOTINFO.node;

			// Add handlers to tier stepper
			function highlightField(evt){
				var field = panel.find("[data-label='" + evt.data.field + "']");
				if (evt.data.highlight){
					field.addClass("highlight");
				} else {
					field.removeClass("highlight");
				}
			}

			var tierStepper = panel.find("[data-label='tier']");
			tierStepper.find("li:nth-child(2)").mouseover({ field: "cost", highlight: true }, highlightField);
			tierStepper.find("li:nth-child(2)").mouseout({ field: "cost", highlight: false }, highlightField);
			tierStepper.find("li:nth-child(3)").mouseover({ field: "upgrade1", highlight: true }, highlightField);
			tierStepper.find("li:nth-child(3)").mouseout({ field: "upgrade1", highlight: false }, highlightField);
			tierStepper.find("li:nth-child(4)").mouseover({ field: "upgrade2", highlight: true }, highlightField);
			tierStepper.find("li:nth-child(4)").mouseout({ field: "upgrade2", highlight: false }, highlightField);
			tierStepper.find("li:nth-child(5)").mouseover({ field: "upgrade3", highlight: true }, highlightField);
			tierStepper.find("li:nth-child(5)").mouseout({ field: "upgrade3", highlight: false }, highlightField);
			tierStepper.find("li:nth-child(6)").mouseover({ field: "upgrade4", highlight: true }, highlightField);
			tierStepper.find("li:nth-child(6)").mouseout({ field: "upgrade4", highlight: false }, highlightField);
		},
		panels: {
			DEFAULT: {
				node: $("#info-panel-default")
			},
			LOTINFO: {
				node: $("#info-panel-lot"),
				refresh: function( evt, lot_id ) {
					/** @param {number} lot_id - Id of the lot */

					// Fetch data from game session
					var panel = Tab.INFO.panels.LOTINFO.node,
					    lot   = require("engine/core").getSession().map.lot[lot_id];

					// Definition of fields to be updated and its value
					var fields = {
						"name": lot.name,
						"tier-title": [ "Empty Lot", "Tier 1", "Tier 2", "Tier 3", "Tier 4"][lot.tier],
						"cost": formatAsCurrency(lot.cost[0]),
						"upgrade1": formatAsCurrency(lot.cost[1]),
						"upgrade2": formatAsCurrency(lot.cost[2]),
						"upgrade3": formatAsCurrency(lot.cost[3]),
						"upgrade4": formatAsCurrency(lot.cost[4]),
						"rent": formatAsCurrency(lot.rent)
					};

					// Update fields
					Object.keys(fields)
					      .forEach(function( key ) {
						      panel.find("[data-label='" + key + "']")
						           .text(fields[key]);
					      });

					// Update tier
					var tier = panel.find("[data-label='tier']");
					// Reset
					tier.find("li").removeClass("passed").attr("aria-checked", "false");

					if(lot.owner === null) {
						// Mark unowned
						tier.find("li:nth-child(1)")
						    .addClass("passed")
						    .attr("aria-checked", "true");
						panel.find("header").css("background-color", "");
					} else {
						// Mark as sold
						panel.find("header").css("background-color", lot.owner.color.DARK);

						// and highlight node by tier
						tier.find("li:nth-child(-n +" + (lot.tier + 2) + ")")
						    .addClass("passed");
						tier.find("li:nth-child(" + (lot.tier + 2) + ")")
						    .attr("aria-checked", "true");
					}
				}
			},
			PLAYERINFO: {
				node: $("#info-panel-player"),
				/**
				 * Last selected player
				 * @type {Player}
				 */
				player: null,
				refresh: function( evt, player ) {
					/** @param {Player} player - Reference to the player */

					var panel = Tab.INFO.panels.PLAYERINFO;

					if(typeof player === "undefined") {
						// Player is not specified

						// Force refresh using last selected player
						player = panel.player;

						// If not even one player was selected previously
						// then do not refresh
						if(panel.player === null) { return; }
					} else {
						// Update last selected player
						panel.player = player;
					}

					// Fetch data from game session
					var panelNode = panel.node;

					// Render player color
					panelNode.find("header").css("background-color", player.color.DARK);

					// Definition of fields to be updated and its value
					var fields = {
						"name": player.name,
						"cash": formatAsCurrency(player.cash),
						"net_worth": formatAsCurrency(player.netWorth)
					};

					// Update fields
					Object.keys(fields)
					      .forEach(function( key ) {
						      panelNode.find("[data-label='" + key + "']")
						           .text(fields[key]);
					      });
				}
			}
		}
	};

	// Register handler Default panel
	$.subscribe("UI.InfoPanel.Default.Show", { panel: Tab.INFO.panels.DEFAULT }, Tab.INFO.showPanel);

	// Register handler for Lot sprite onClick
	$.subscribe("UI.InfoPanel.LotInfo.Refresh", Tab.INFO.panels.LOTINFO.refresh);
	$.subscribe("UI.InfoPanel.LotInfo.Show", { panel: Tab.INFO.panels.LOTINFO }, Tab.INFO.showPanel);
	$.subscribe("UI.InfoPanel.LotInfo.Show", function(){ Tab.INFO.select(); });

	// Register handler for Player sprite onClick
	$.subscribe("UI.InfoPanel.PlayerInfo.Refresh", Tab.INFO.panels.PLAYERINFO.refresh);
	$.subscribe("UI.InfoPanel.PlayerInfo.Show", { panel: Tab.INFO.panels.PLAYERINFO }, Tab.INFO.showPanel);
	$.subscribe("UI.InfoPanel.PlayerInfo.Show", function(){ Tab.INFO.select(); });

	/**
	 * Leaderboard tab
	 * @lends InfoPanel.Tabs.LEADERBOARD
	 */
	Tab.LEADERBOARD = {
		id: "info-panel-tab-leaderboard",
		container: "info-panel-leaderboard",
		label: "Leaderboard",
		panel: {
			node: $("#info-panel-leaderboard"),
			entries: [],
			rebuild: function() {
				var leaderboard = require("game/leaderboard"),
				    panel = Tab.LEADERBOARD.panel,
				    listNode = panel.node.find(".leaderboard-list");

				// Start from clean node
				var rows = [];
				listNode.empty();

				// Rebuild leaderboard
				while(rows.length < leaderboard.ranking.length) {
					// Construct DOM
					var newRow = $("<li/>").append(
						$("<div/>").addClass("player-color").css("backgroundColor", "white"),
						$("<div/>").addClass("player-details").append(
							$("<div/>").addClass("player-name").text("PLAYER_NAME"),
							$("<div/>").addClass("player-net-worth").text("PLAYER_CASH")
						)
					);
					newRow.appendTo(listNode);

					// Store reference
					rows.push(newRow);
				}

					// Store reference
				panel.entries = rows;

				leaderboard.onUpdated = panel.refresh;
			},
			refresh: function() {
				var leaderboard = require("game/leaderboard"),
				    rows = Tab.LEADERBOARD.panel.entries;

				// Fill data for all rankings
				leaderboard.ranking.forEach(
					function (player, index) {
						var row = rows[index];

						row.find(".player-color").css("backgroundColor", player.color.LIGHT);
						row.find(".player-name").text(player.name);
						row.find(".player-net-worth").text(formatAsCurrency(player.netWorth));
					}
				);
			}
		}
	};

	// Register handlers for leaderboard
	$.subscribe("UI.InfoPanel.Leaderboard.Rebuild", Tab.LEADERBOARD.panel.rebuild);
	$.subscribe("UI.InfoPanel.Leaderboard.Refresh", Tab.LEADERBOARD.panel.refresh);
	$.subscribe("UI.InfoPanel.Leaderboard.Show", function(){ Tab.LEADERBOARD.select(); });

	return InfoPanel;
});