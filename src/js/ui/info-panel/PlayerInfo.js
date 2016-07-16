define([
	"jquery",
	"jquery.pub-sub",
	"utils"
], function($) {
	"use strict";

	// Imports
	var formatAsCurrency = require("utils").formatAsCurrency;

	// Create container
	var panelNode = $("<section/>", { id: "info-panel-player" });

	/**
	 * Collection of views
	 * @private
	 */
	var View = {};

	/**
	 * View updaters
	 * @private
	 */
	var UpdateView = {
		Color: function(model) {
			View.Color.css("background-color", model.color.DARK);
		},
		Name: function(model) {
			View.Name.text(model.name);
		},
		Cash: function(model) {
			View.Cash.text(formatAsCurrency(model.cash));
		},
		NetWorth: function(model) {
			View.NetWorth.text(formatAsCurrency(model.netWorth));
		}
	};

	// Subscribe to these event namespaces
	// paired with updater
	var subscribed = {
		Cash: UpdateView.Cash,
		NetWorth: UpdateView.NetWorth
	};

	/**
	 * @param {string} evt.namespace - Type of player stat that changed
	 * @this {Player} - Model player
	 */
	function updateAdaptor(evt) {
		subscribed[evt.namespace](this);
	}


	// Cache generated event namespace string
	var subscribedEventsNS = "Update." + Object.getOwnPropertyNames(subscribed).join(".");


	return {
		node: panelNode,
		templateID: "panel-info-player",
		init: function(Tab) {
			// Register views
			View.Color = panelNode.find("header");
			View.Name = panelNode.find("[data-label='name']");
			View.Cash = panelNode.find("[data-label='cash']");
			View.NetWorth = panelNode.find("[data-label='net_worth']");

			// Register handler for Player sprite onClick
			$.subscribe("UI.InfoPanel.PlayerInfo.subscribe", this.subscribe.bind(this));
			$.subscribe("UI.InfoPanel.PlayerInfo.refresh", this.refresh.bind(this));
			$.subscribe("UI.InfoPanel.PlayerInfo.show", function() {
				// Hide all sub-panels
				Tab.showSubPanel(this);
			}.bind(this));
		},

		/**
		 * Observe changes to model
		 * @param evt
		 * @param {Player} player - Reference to the player
		 */
		subscribe: function(evt, player) {
			this.unsubscribe();
			this.model = player;
			this.model.$.on(subscribedEventsNS, updateAdaptor);
		},

		/** Stop observing */
		unsubscribe: function() {
			// Unsubscribe if exist
			this.model && this.model.$.off(subscribedEventsNS);
		},

		/** Force refresh panel data */
		refresh: function() {
			if (this.model) {
				for (var v in UpdateView) {
					if (UpdateView.hasOwnProperty(v)) {
						// Pass model to updater
						UpdateView[v](this.model);
					}
				}
			}
		}
	};
});