define([
	"jquery",
	"jquery.pub-sub",
	"entity/leaderboard",
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
					    lot   = require("engine/core").getSession().map[lot_id];

					// Definition of fields to be updated and its value
					var fields = {
						"title": lot.name,
						"tier": lot.tier,
						"tier-title": [ "Empty Lot", "Tier 1", "Tier 2", "Tier 3", "Tier 4"][lot.tier],
						"cost": formatAsCurrency(lot.cost[0]),
						"upgrade1": formatAsCurrency(lot.cost[1]),
						"upgrade2": formatAsCurrency(lot.cost[2]),
						"upgrade3": formatAsCurrency(lot.cost[3]),
						"upgrade4": formatAsCurrency(lot.cost[4])
					};

					// Update fields
					Object.keys(fields)
					      .forEach(function( key ) {
						      panel.find("[data-label='" + key + "']")
						           .text(fields[key]);
					      });
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
					panelNode.find("header").css("background-color", player.markColor);

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
				var leaderboard = require("entity/leaderboard"),
				    panel = Tab.LEADERBOARD.panel,
				    listNode = panel.node.find(".leaderboard-list");

				// Start from clean node
				var rows = [];
				listNode.empty();

				// Rebuild leaderboard
				while(rows.length < leaderboard.ranking.length) {
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
				panel.entries = rows;

				leaderboard.onUpdated = panel.refresh;
			},
			refresh: function() {
				var leaderboard = require("entity/leaderboard"),
				    rows = Tab.LEADERBOARD.panel.entries;

				// Fill data for all rankings
				leaderboard.ranking.forEach(
					function (player, index) {
						var row = rows[index];
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