define([
	"jquery",
	"jquery.pub-sub",
	"engine/assets",
	"ui/info-panel/Generic",
	"ui/info-panel/LotInfo",
	"ui/info-panel/PlayerInfo",
	"ui/info-panel/Leaderboard"
], function($) {
	"use strict";

	var InfoPanel = {
		node: $("#info-panel"),
		TabBar: $("<section/>", { id: "info-panel-tab" }),
		init: function() {
			// Construct tab bar
			var tablist = $("<ul/>", { role: "tablist" });

			InfoPanel.TabBar
			         .append(tablist)
			         .appendTo(InfoPanel.node);

			// Construct tabs
			for (var t in InfoPanel.Tabs) {
				if (InfoPanel.Tabs.hasOwnProperty(t)) {
					// Generate select() method for each tab
					var tab = InfoPanel.Tabs[t];

					tab.select = InfoPanel.selectTab.bind(tab);

					// Render Tab
					$("<li/>",
						{
							"id": tab.id,
							"role": "tab",
							"aria-controls": tab.container.attr("id"),
							"aria-selected": "false",
							"tabindex": "0"
						})
						.append("<span>" + tab.label + "</span>")
						.click(tab.select)
						.appendTo(tablist);

					// Set metadata for tabpanels
					tab.container.attr({
						"role": "tabpanel",
						"aria-labelledby": tab.id
					});

					// Run tab init() if available
					tab.init && tab.init();

					// Attach only when ready
					tab.container
					   .insertAfter(InfoPanel.TabBar);
				}
			}
			delete InfoPanel.init;
		},
		selectTab: function() {
			/** @this {InfoPanel.Tabs~Tab} Tab object */
			var elem = "#" + this.id;

			// Deselect all tabs
			InfoPanel.TabBar
			         .find("li[role='tab']")
			         .attr({ "aria-selected": "false" })
			         .removeClass("selected");

			// Hide all panels
			InfoPanel.node
			         .find("section[role='tabpanel']")
			         .attr("aria-hidden", "true")
			         .hide();

			// Set specified tab as selected
			$(elem).attr("aria-selected", "true")
			       .addClass("selected");

			// Make linked tabpanel visible
			this.container
			    .attr("aria-hidden", "false")
			    .show();
		},
		/** Collection of tabs */
		Tabs: {}
	};

	//
	// Define tabs and panels
	//

	/** InfoPanel.Tabs */
	var Tab = InfoPanel.Tabs;

	/**
	 * @typedef {object} InfoPanel.Tabs~Tab
	 * @property {string} id - ID of the tab
	 * @property {jQuery} container - Panel to be shown when tab is selected
	 * @property {string} label - Label of the tab
	 * @var {function} [init] - Tabpanel initialization script
	 */

	/**
	 * Info tab
	 * @type InfoPanel.Tabs~Tab
	 * @lends InfoPanel.Tabs.INFO
	 */
	Tab.INFO = {
		id: "info-panel-tab-info",
		container: $("<section/>", { id: "info-panel-info" }),
		label: "INFO",
		hideAllSubpanels: function() {
			var subpanels = Tab.INFO.subpanel;

			for (var p in subpanels) {
				if (subpanels.hasOwnProperty(p)) {
					subpanels[p].node.hide();
				}
			}
		},
		showSubPanel: function(subpanel) {
			Tab.INFO.hideAllSubpanels();
			subpanel.node.show();

			// Select tab
			Tab.INFO.select();
		},
		init: function() {
			// Imports
			var getUIFragment = require("engine/assets").FragmentStore.get;

			// Load UI panel templates
			for (var id in Tab.INFO.subpanel) {
				if (Tab.INFO.subpanel.hasOwnProperty(id)) {
					let subpanel = Tab.INFO.subpanel[id];

					subpanel.node
					        .addClass("subpanel")
					        .append(getUIFragment(subpanel.templateID))
					        .appendTo(Tab.INFO.container);

					// Run subpanel init() if available
					subpanel.init && subpanel.init(this);
				}
			}

			// Show default panel
			$.publish("UI.InfoPanel.Generic.show");
		},
		subpanel: {
			GENERIC: require("ui/info-panel/Generic"),
			LOTINFO: require("ui/info-panel/LotInfo"),
			PLAYERINFO: require("ui/info-panel/PlayerInfo")
		}
	};

	/**
	 * Leaderboard tab
	 * @lends InfoPanel.Tabs.LEADERBOARD
	 */
	Tab.LEADERBOARD = {
		id: "info-panel-tab-leaderboard",
		container: $("<section/>", { id: "info-panel-leaderboard" }),
		label: "Leaderboard",
		init: function() {
			require("ui/info-panel/Leaderboard").init(Tab.LEADERBOARD);
		}
	};

	return InfoPanel;
});