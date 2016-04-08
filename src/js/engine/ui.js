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
	 * @namespace InfoPanel
	 * @memberOf UI.
	 */
	UI.InfoPanel = {
		activePanel: null,
		show: function(evt, data){
			// Identify panel to be shown
			var Panel = {
				"lot": $("#info-panel-lot")
			}[evt.data.panelId];

			// Fetch live info from game session
			var info = fetchInfo(data.contents.id);

			// Definition of fields to be updated and its value
			var fields = {
				"title": info.name,
				"cost": "$" + info.cost[0]
			};

			// Update fields
			Object.keys(fields).forEach(function (key) {
				Panel.find("[data-label='" + key + "']")
				     .text(fields[key]);
			});

			// Show panel
			Panel.show();

		}
	};

	/**
	 * Fetch live info from game session
	 * @private
	 * @returns {Object}
	 */
	function fetchInfo(id){
		var Session = require("engine/core").getSession(),
		    Entity = Session.map[id];

		return Entity;
	}

	// Register handler for Lot sprite onClick
	$.subscribe("UI.InfoPanel.LotInfo", { panelId: "lot"}, UI.InfoPanel.show);

	return UI;
});