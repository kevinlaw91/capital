define([
	"chartist",
	"jquery",
	"jquery.pub-sub",
	"chartist-plugin-tooltip",
	"engine/core",
	"utils"
], function(Chartist, $) {
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
			// Reset stepper
			View.TierStepperNodes
			    .removeClass("passed")
			    .attr("aria-checked", "false");

			// Mark passed nodes
			if (model.owner) {
				// Until "Buy" node
				View.TierStepperNodes
				    .slice(0, 2)
				    .addClass("passed")
				    .end();
			}

			if (model.tier > 0) {
				// Mark passed tiers
				// Tier nodes indexes are 2,3,4,5
				View.TierStepperNodes
				    .slice(2, 2 + model.tier)
				    .addClass("passed")
				    .end();
			}


			// Highlight current status
			if (model.owner) {
				View.TierStepperNodes
				    .eq(model.tier + 1)
				    .attr("aria-checked", "true")
				    .end();
			} else {
				View.TierStepperNodes
				    .first()
				    .attr("aria-checked", "true")
				    .end();
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
		},
		ChartRent: function(model) {
			View.ChartRent.update(
				{
					labels: ["Lot", "Tier 1", "Tier 2", "Tier 3", "Tier 4"],
					series: [model.rentValue[0], model.rentValue[1], model.rentValue[2], model.rentValue[3], model.rentValue[4]]
				}
			);
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
			View.ChartRent = new Chartist.Bar(
				panelNode.find("[data-chart-id='rent']")[0] /* Chart wrapper */,
				null /* No data by default */,
				{
					axisY: {
						showGrid: false
					},
					chartPadding: {
						top: 20
					},
					distributeSeries: true,
					plugins: [
						Chartist.plugins.tooltip()
					]
				}
			);

			View.ChartRent.on("draw", function(context) {
				if (context.type === "bar") {
					context.group.elem(
						"text",
						{
							x: context.x2,
							y: context.y2 - 10,
							style: "text-anchor: middle"
						},
						"ct-bar-label"
					)
			        .text(context.value.y);
				}
			});

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
				Tab.showSubPanel(this);

				// Chart not render properly if container is not visible during chart render
				// See: https://github.com/gionkunz/chartist-js/issues/119
				// Force refresh when panel is visible
				this.refresh();
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