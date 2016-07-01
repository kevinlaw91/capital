define([
	"jquery",
	"jquery.pub-sub",
	"engine/assets"
], function($) {
	"use strict";

	// Import
	var getUIFragment = require("engine/assets").FragmentStore.get;

	/** Prepare a fragment to be appended to other nodes */
	function inflate(fragmentID) {
		return getUIFragment(fragmentID).cloneNode(true);
	}

	// Offer handlers
	/** Handle offer accept */
	function acceptOffer(evt) {
		var panel = evt.data.panel;

		// Accept offer
		panel.offer.accept();

		// Remove offer
		panel.offer = null;

		// Close prompt and then fires callback
		var closeAnimation = $.Deferred();

		panel.onComplete(closeAnimation);
		closeAnimation.done(evt.data.onPanelClosed);
	}

	/** Handle ofer decline */
	function declineOffer(evt) {
		var panel = evt.data.panel;

		// Decline offer
		panel.offer.decline();

		// Remove offer
		panel.offer = null;

		// Close prompt and then fires callback
		var closeAnimation = $.Deferred();

		UserActionPanel.onCancel(closeAnimation); // eslint-disable-line no-use-before-define
		closeAnimation.done(evt.data.onPanelClosed);
	}

	/** @namespace */
	/* eslint-disable no-use-before-define */
	var UserActionPanel = {
		node: "#action-panel",
		init: function() {
			// Init panel
			UserActionPanel.node = $(UserActionPanel.node);

			// Buy Panel
			PANEL_PROPERTY_BUY.node
				.append(inflate("panel-prompt-buy"))
				.on("click", "button", PANEL_PROPERTY_BUY.disable)
				.appendTo(UserActionPanel.node);
			PANEL_PROPERTY_BUY.disable();

			// Upgrade Panel
			PANEL_PROPERTY_UPGRADE.node
				.append(inflate("panel-prompt-upgrade"))
				.on("click", "button", PANEL_PROPERTY_UPGRADE.disable)
				.appendTo(UserActionPanel.node);
			PANEL_PROPERTY_UPGRADE.disable();

			delete UserActionPanel.init;
		},
		panels: {
			PROPERTY_BUY: {
				node: $("<section />"),
				offer: null,
				enable: function() {
					PANEL_PROPERTY_BUY.node.find("button").prop("disabled", false);
				},
				disable: function() {
					PANEL_PROPERTY_BUY.node.find("button").prop("disabled", true);
				},
				prompt: function(data) {
					// Make target panel visible
					UserActionPanel.selectPanel("PROPERTY_BUY");

					var panel = PANEL_PROPERTY_BUY;

					// Fill information
					for (var field in data.fields) {
						if (data.fields.hasOwnProperty(field)) {
							panel.node.find("[data-label='" + field + "']")
							     .text(data.fields[field]);
						}
					}

					// Cache offer
					panel.offer = data.offer;

					// Set button actions
					panel.node.find("button.main")
					     .unbind("click.accept")
					     .one(
						     "click.accept",
						     {
							     panel: panel,
							     onPanelClosed: data.onComplete
						     },
						     acceptOffer
					     );

					panel.node.find("button.decline")
					     .unbind("click.decline")
					     .one(
						     "click.decline",
						     {
							     panel: panel,
							     onPanelClosed: data.onComplete
						     },
						     declineOffer
					     );

					// Enable response buttons
					panel.enable();

					// Slide open
					UserActionPanel.slideOpen().done(panel.onFocus);
				},
				onFocus: function() {
					// Focus default button
					PANEL_PROPERTY_BUY.node.find("button.main").focus();
				},
				onComplete: function(prom) {
					var panel = PANEL_PROPERTY_BUY;

					// Clean up completed offer
					panel.offer = null;

					// Show success animation
					panel.node.removeClass("done").addClass("done");

					// Hide panel after 1s delay
					window.setTimeout(function() {
						UserActionPanel.slideClose(prom);
					}, 1000);
				}
			},
			PROPERTY_UPGRADE: {
				node: $("<section />"),
				offer: null,
				enable: function() {
					PANEL_PROPERTY_UPGRADE.node.find("button").prop("disabled", false);
				},
				disable: function() {
					PANEL_PROPERTY_UPGRADE.node.find("button").prop("disabled", true);
				},
				prompt: function(data) {
					// Make target panel visible
					UserActionPanel.selectPanel("PROPERTY_UPGRADE");

					var panel = PANEL_PROPERTY_UPGRADE;

					// Fill information
					for (var field in data.fields) {
						if (data.fields.hasOwnProperty(field)) {
							panel.node.find("[data-label='" + field + "']")
							     .text(data.fields[field]);
						}
					}

					// Cache offer
					panel.offer = data.offer;

					// Set button actions
					panel.node.find("button.main")
					     .unbind("click.accept")
					     .one(
						     "click.accept",
						     {
							     panel: panel,
							     onPanelClosed: data.onComplete
						     },
						     acceptOffer
					     );

					panel.node.find("button.decline")
					     .unbind("click.decline")
					     .one(
						     "click.decline",
						     {
							     panel: panel,
							     onPanelClosed: data.onComplete
						     },
						     declineOffer
					     );

					// Enable response buttons
					panel.enable();

					// Slide open
					UserActionPanel.slideOpen().done(panel.onFocus);
				},
				onFocus: function() {
					// Focus default button
					PANEL_PROPERTY_UPGRADE.node.find("button.main").focus();
				},
				onComplete: function(prom) {
					var panel = PANEL_PROPERTY_UPGRADE;

					// Clean up completed offer
					panel.offer = null;

					// Show success animation
					panel.node.removeClass("done").addClass("done");

					// Hide panel after 1s delay
					window.setTimeout(function() {
						UserActionPanel.slideClose(prom);
					}, 1000);
				}
			}
		},
		selectPanel: function(id) {
			if (UserActionPanel.panels.hasOwnProperty(id)) {
				// Hide and reset all panels first
				UserActionPanel.node.find("section").removeClass("done").hide();

				// Show selected panel only
				var panel = UserActionPanel.panels[id];

				panel.node.show();
			}
		},
		slideOpen: function(prom) {
			var transition = prom || $.Deferred(),
				panel = $("#stage-box-slide");

			panel.css("top", UserActionPanel.node.height() * -1);
			panel.one("transitionend", transition.resolve);

			return transition.promise();
		},
		slideClose: function(prom) {
			var transition = prom || $.Deferred(),
				panel = $("#stage-box-slide");

			panel.css("top", 0);
			panel.one("transitionend", transition.resolve);

			return transition.promise();
		},
		prompt: function(evt, data) {
			var panel = evt.data.panel;

			panel.prompt(data);
		},
		onCancel: function(prom) {
			// Hide player action panel after a very short delay
			window.setTimeout(function() {
				UserActionPanel.slideClose(prom);
			}, 100);
		}
	};
	/* eslint-enable no-use-before-define */

	// Reference
	var PANEL_PROPERTY_BUY = UserActionPanel.panels.PROPERTY_BUY,
		PANEL_PROPERTY_UPGRADE = UserActionPanel.panels.PROPERTY_UPGRADE;

	// Register handlers for UserActionPanel
	$.subscribe(
		"UI.UserActionPanel.PromptPropertyBuy",
		{ panel: PANEL_PROPERTY_BUY },
		UserActionPanel.prompt
	);

	$.subscribe(
		"UI.UserActionPanel.PromptPropertyUpgrade",
		{ panel: PANEL_PROPERTY_UPGRADE },
		UserActionPanel.prompt
	);

	return UserActionPanel;
});