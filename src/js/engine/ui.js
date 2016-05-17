define([
	"jquery",
	"snapsvg",
	"utils",
	"jquery.pub-sub",
	"engine/config",
	"engine/core",
	"engine/events"
], function( $, Snap ) {
	'use strict';

	// Imports
	var Config = require("engine/config"),
	    formatAsCurrency = require("utils").formatAsCurrency;

	/** @namespace UI */
	var UI = {
		init: function() {
			UI.InfoPanel.init();
			UI.UserActionPanel.init();
		}
	};

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
			// Create new Snap <svg> element
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
	 * @namespace UserActionPanel
	 * @memberOf UI.
	 */
	UI.UserActionPanel = {
		init: function() {
			var GameEvents = require("engine/events");

			// Set default button action
			var callback;

			// Buy button
			callback = $.Callbacks();
			callback.add(GameEvents.PlayerAction.Buy)
			        .add(function(success){
				        if(success) {
					        UI.UserActionPanel.panels.PROPERTY_BUY.onComplete();
				        }
			        });
			$(".player-action-btn-buy").on("click", callback.fire)
			                           .prop('disabled', true);

			// Upgrade button
			callback = $.Callbacks();
			callback.add(GameEvents.PlayerAction.Upgrade)
			        .add(function(success){
				        if(success) {
					        UI.UserActionPanel.panels.PROPERTY_UPGRADE.onComplete();
				        }
			        });
			$(".player-action-btn-upgrade").on("click", callback.fire)
			                             .prop('disabled', true);

			// Decline buttons
			$(".player-action-btn-done").on("click", UI.UserActionPanel.onCancel);
		},
		panels: {
			PROPERTY_BUY: {
				node: $("#action-panel-buy"),
				prompt: function(data) {
					// Make target panel visible
					UI.UserActionPanel.selectPanel("PROPERTY_BUY");

					var panel = UI.UserActionPanel.panels.PROPERTY_BUY;

					// Fill information
					for(var field in data.fields) {
						if(data.fields.hasOwnProperty(field)) {
							panel.node.find("[data-label='" + field + "']")
							          .text(data.fields[field]);
						}
					}

					// Slide open
					UI.UserActionPanel.slideOpen().done(panel.onFocus);
				},
				onFocus: function() {
					// Focus default button
					UI.UserActionPanel.panels.PROPERTY_BUY.node.find("button.main").focus();
				},
				onComplete: function() {
					var node = UI.UserActionPanel.panels.PROPERTY_BUY.node;

					// Show success animation
					node.removeClass("done").addClass("done");

					// Prompt finished with result
					UI.UserActionPanel.onResult();
				}
			},
			PROPERTY_UPGRADE: {
				node: $("#action-panel-upgrade"),
				prompt: function(data) {
					// Make target panel visible
					UI.UserActionPanel.selectPanel("PROPERTY_UPGRADE");

					var panel = UI.UserActionPanel.panels.PROPERTY_UPGRADE;

					// Fill information
					for(var field in data) {
						if(data.hasOwnProperty(field)) {
							panel.node.find("[data-label='" + field + "']")
							     .text(data[field]);
						}
					}

					// Slide open
					UI.UserActionPanel.slideOpen().done(panel.onFocus);
				},
				onFocus: function() {
					// Focus default button
					UI.UserActionPanel.panels.PROPERTY_UPGRADE.node.find("button.main").focus();
				},
				onComplete: function() {
					var node = UI.UserActionPanel.panels.PROPERTY_UPGRADE.node;

					// Show success animation
					node.removeClass("done").addClass("done");

					// Prompt finished with result
					UI.UserActionPanel.onResult();
				}
			}
		},
		selectPanel: function(id) {
			if(UI.UserActionPanel.panels.hasOwnProperty(id)){
				// Hide and reset all panels first
				$("#action-panel").find("section").removeClass("done").hide();

				// Show selected panel only
				var panel = UI.UserActionPanel.panels[id];
				panel.node.show();
			}
		},
		slideOpen: function() {
			var transition = $.Deferred(),
			    panel = $("#stage-box-slide");
			panel.css("top", $("#action-panel").height() * -1);
			panel.one('transitionend', transition.resolve);

			return transition.promise();
		},
		slideClose: function() {
			var transition = $.Deferred(),
			    panel = $("#stage-box-slide");
			panel.css("top",0);
			panel.one('transitionend', transition.resolve);

			return transition.promise();
		},
		prompt: function(evt, data) {
			var panel = evt.data.panel;
			panel.prompt(data);
		},
		onResult: function() {
			// Hide player action panel after 1 second
			window.setTimeout(actionCompleted, 1000);
		},
		onCancel: function() {
			// Hide player action panel
			actionCompleted();
		}
	};

	// Register handlers for UserActionPanel
	$.subscribe("UI.UserActionPanel.PromptPropertyBuy", { panel: UI.UserActionPanel.panels.PROPERTY_BUY }, UI.UserActionPanel.prompt);
	$.subscribe("UI.UserActionPanel.PromptPropertyUpgrade", { panel: UI.UserActionPanel.panels.PROPERTY_UPGRADE }, UI.UserActionPanel.prompt);

	// Slide close
	function actionCompleted(){
		UI.UserActionPanel.slideClose().done(delayedPlayerEndsTurn);
	}

	function delayedPlayerEndsTurn(){
		// Delay end turn for 500ms after slide close animation ended
		window.setTimeout(doPlayerEndsTurn, 500);
	}

	function doPlayerEndsTurn() {
		$.publish("PlayerEndsTurn");
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
		init: function(){
			// Construct tab bar
			var tablist = $("<ul/>").attr("role","tablist");
            tablist.appendTo($("#info-panel-tab"));

			// Generate prototype select method for each tab
			function generateSelectMethod(selectedTab){
				return function() {
					UI.InfoPanel.Tabs.select("#" + selectedTab.id);
				};
			}

			// Construct tabs
			for(var t in UI.InfoPanel.Tabs) {
				if(UI.InfoPanel.Tabs.hasOwnProperty(t)) {
					var tab = UI.InfoPanel.Tabs[t];
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

			// Attach select() to UI.InfoPanel.Tabs
			UI.InfoPanel.Tabs.select = function(elem){
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
				$("#" + tabpanelID)
					.attr("aria-hidden","false")
					.show();
			};

			// Show Default panel for Info Tab
			$.publish("UI.InfoPanel.Default.Show");

			delete UI.InfoPanel.init;
		},
		Tabs: {
			Info: {
				id: "info-panel-tab-info",
				container: "info-panel-info",
				label: "Info",
				panels: {
					Default: {
						node: $("#info-panel-default")
					},
					LotInfo: {
						node: $("#info-panel-lot"),
						refresh: function( evt, lot_id ) {
							/** @param {number} lot_id - Id of the lot */

							// Fetch data from game session
							var panel = UI.InfoPanel.Tabs.Info.panels.LotInfo.node,
							    lot   = fetchActiveSession().map[lot_id];

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
					PlayerInfo: {
						node: $("#info-panel-player"),
						/**
						 * Last selected player
						 * @type {Player}
						 */
						player: null,
						refresh: function( evt, player ) {
							/** @param {Player} player - Reference to the player */

							if(typeof player === "undefined") {
								// Player is not specified

								// Force refresh using last selected player
								player = UI.InfoPanel.Tabs.Info.panels.PlayerInfo.player;

								// If not even one player was selected previously
								// then do not refresh
								if(UI.InfoPanel.Tabs.Info.panels.PlayerInfo.player === null) { return; }
							} else {
								// Update last selected player
								UI.InfoPanel.Tabs.Info.panels.PlayerInfo.player = player;
							}

							// Fetch data from game session
							var panel  = UI.InfoPanel.Tabs.Info.panels.PlayerInfo.node;

							// Render player color
							panel.find("header").css("background-color", player.markColor);

							// Definition of fields to be updated and its value
							var fields = {
								"name": player.name,
								"cash": formatAsCurrency(player.cash),
								"net_worth": formatAsCurrency(player.netWorth)
							};

							// Update fields
							Object.keys(fields)
							      .forEach(function( key ) {
								      panel.find("[data-label='" + key + "']")
								           .text(fields[key]);
							      });
						}
					}
				},
				showPanel: function(evt){
					/** @param {object} evt.data.panel - A panel object defined in UI.InfoPanel.Tabs.Info.panels */

					// Hide all panel
					var panels = UI.InfoPanel.Tabs.Info.panels;
					for(var p in panels) {
						if(panels.hasOwnProperty(p)) {
							panels[p].node.hide();
						}
					}

					// Show only specified panel
					evt.data.panel.node.show();
				}
			},
			Leaderboard: {
				id: "info-panel-tab-leaderboard",
				container: "info-panel-leaderboard",
				label: "Leaderboard",
				panels: {
					Leaderboard: {
						node: $("#info-panel-leaderboard"),
						entries: [],
						rebuild: function() {
							var Leaderboard = require("entity/leaderboard"),
							    Panel = UI.InfoPanel.Tabs.Leaderboard.panels.Leaderboard,
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

							Leaderboard.onUpdated = Panel.refresh;
						},
						refresh: function() {
							var Leaderboard = require("entity/leaderboard"),
							    Rows = UI.InfoPanel.Tabs.Leaderboard.panels.Leaderboard.entries;

							// Fill data for all rankings
							Leaderboard.ranking.forEach(
								function (player, index) {
									var row = Rows[index];
									row.find(".player-name").text(player.name);
									row.find(".player-net-worth").text(formatAsCurrency(player.netWorth));
								}
							);
						}
					}
				}
			}
		}
	};

	// Register handler Default panel
	$.subscribe("UI.InfoPanel.Default.Show", { panel: UI.InfoPanel.Tabs.Info.panels.Default }, UI.InfoPanel.Tabs.Info.showPanel);

	// Register handler for Lot sprite onClick
	$.subscribe("UI.InfoPanel.LotInfo.Refresh", UI.InfoPanel.Tabs.Info.panels.LotInfo.refresh);
	$.subscribe("UI.InfoPanel.LotInfo.Show", { panel: UI.InfoPanel.Tabs.Info.panels.LotInfo }, UI.InfoPanel.Tabs.Info.showPanel);
	$.subscribe("UI.InfoPanel.LotInfo.Show", function(){ UI.InfoPanel.Tabs.Info.select(); });

	// Register handler for Player sprite onClick
	$.subscribe("UI.InfoPanel.PlayerInfo.Refresh", UI.InfoPanel.Tabs.Info.panels.PlayerInfo.refresh);
	$.subscribe("UI.InfoPanel.PlayerInfo.Show", { panel: UI.InfoPanel.Tabs.Info.panels.PlayerInfo }, UI.InfoPanel.Tabs.Info.showPanel);
	$.subscribe("UI.InfoPanel.PlayerInfo.Show", function(){ UI.InfoPanel.Tabs.Info.select(); });

	// Register handlers for leaderboard
	$.subscribe("UI.InfoPanel.Leaderboard.Rebuild", UI.InfoPanel.Tabs.Leaderboard.panels.Leaderboard.rebuild);
	$.subscribe("UI.InfoPanel.Leaderboard.Refresh", UI.InfoPanel.Tabs.Leaderboard.panels.Leaderboard.refresh);
	$.subscribe("UI.InfoPanel.Leaderboard.Show", function(){ UI.InfoPanel.Tabs.Leaderboard.select(); });

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