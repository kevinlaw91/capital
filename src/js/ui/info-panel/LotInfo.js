define([
	"jquery",
	"jquery.pub-sub",
	"engine/core",
	"utils"
], function($) {
	"use strict";

	// Imports
	var formatAsCurrency = require("utils").formatAsCurrency;

	// Create container
	var panelNode = $("<section/>", { id: "info-panel-lot" });

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
		Name: function(model) {
			View.Name.text(model.name);
		},
		Color: function(model) {
			View.Color.css(
				"background-color",
				(model.owner ? model.owner.color.DARK : "")
			);
		},
		TierStepper: function(model) {
			// Update tier stepper
			View.TierStepperNodes
			    .removeClass("passed")
			    .attr("aria-checked", "false");

			if (model.owner === null) {
				// Mark unowned
				View.TierStepperNodes
				    .first()
				    .addClass("passed")
				    .attr("aria-checked", "true")
				    .end();
			} else {
				// Mark tier node as completed/passed
				// We want to mark from first node until the current tier node

				// slice(0,n) will select from first node until (but not including) n
				// If n=0, no node will be selected. This is not what we want.
				// We want node 0 to be marked when n=0, so we need to do slice(0,n+1)
				// The selected result when n=0, is node 0, until but not including n+1 (1)
				// Therefore will slice(0,1) when n=0
				// Since it does not include 1 in selection so only node 0 was selected

				// Filter index starts at 0 but tiers start with 1
				// So we need to offset another 1 manually
				// therefore model.tier + 2
				View.TierStepperNodes
				    .slice(0, model.tier + 2)
				    .addClass("passed")
				    .end()

				    // Mark current tier
				    // Filter index starts at 0 but tiers start with 1
				    // So only offset 1 manually
				    .eq(model.tier + 1)
				    .attr("aria-checked", "true");
			}
		},
		Cost: function(model) {
			View.Cost.text(formatAsCurrency(model.cost[0]));
		},
		UpgradeCost: function(model) {
			for (var i = 1; i <= 4; i++) {
				View["Upgrade" + i].text(formatAsCurrency(model.cost[i]));
			}
		},
		Rent: function(model) {
			View.Rent.text(formatAsCurrency(model.rent));
		}
	};

	// Subscribe to these event namespaces
	// paired with updater
	var subscribed = {
		Rent: UpdateView.Rent,
		Owner: function(m) {
			UpdateView.TierStepper(m);
			UpdateView.Color(m);
		},
		Tier: UpdateView.TierStepper
	};

	/**
	 * @param {string} evt.namespace - Type of player stat that changed
	 * @this {TradableLot} - Model TradableLot
	 */
	function updateAdaptor(evt) {
		subscribed[evt.namespace](this);
	}


	// Cache generated event namespace string
	var subscribedEventsNS = "Update." + Object.getOwnPropertyNames(subscribed).join(".");

	// Highlighting
	function highlight() {
		this.toggleClass("highlight");
	}

	return {
		node: panelNode,
		templateID: "panel-info-lot",
		init: function(Tab) {
			// Register views
			View.Name = panelNode.find("[data-label='name']");
			View.Color = panelNode.find("header");
			View.TierStepper = panelNode.find("[data-label='tier']");
			View.TierStepperNodes = View.TierStepper.find("li");
			View.Cost = panelNode.find("[data-label='cost']");
			View.Upgrade1 = panelNode.find("[data-label='upgrade1']");
			View.Upgrade2 = panelNode.find("[data-label='upgrade2']");
			View.Upgrade3 = panelNode.find("[data-label='upgrade3']");
			View.Upgrade4 = panelNode.find("[data-label='upgrade4']");
			View.Rent = panelNode.find("[data-label='rent']");

			// Tier stepper highlighting
			View.TierStepperNodes
			    .eq(1).hover(highlight.bind(View.Cost))
			    .end()
				.eq(2).hover(highlight.bind(View.Upgrade1))
				.end()
				.eq(3).hover(highlight.bind(View.Upgrade2))
				.end()
				.eq(4).hover(highlight.bind(View.Upgrade3))
				.end()
				.eq(5).hover(highlight.bind(View.Upgrade4))
				.end();

			// Register handler for Lot sprite onClick
			$.subscribe("UI.InfoPanel.LotInfo.subscribe", this.subscribe.bind(this));
			$.subscribe("UI.InfoPanel.LotInfo.refresh", this.refresh.bind(this));
			$.subscribe("UI.InfoPanel.LotInfo.show", function() {
				// Hide all sub-panels
				Tab.showSubPanel(this);
			}.bind(this));
		},

		/**
		 * Observe changes to model
		 * @param evt
		 * @param {number} lot_id - Id of the lot
		 */
		subscribe: function(evt, lot_id) {
			this.unsubscribe();
			this.model = require("engine/core").getSession().map.lot[lot_id];
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