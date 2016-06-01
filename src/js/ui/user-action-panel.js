define([
	"jquery",
	"jquery.pub-sub"
], function($) {
	'use strict';
	
	var UserActionPanel = {
		init: function() {
			// Buy Panel
			$("#action-panel-buy").on("click", "button", UserActionPanel.panels.PROPERTY_BUY.disable);
			UserActionPanel.panels.PROPERTY_BUY.disable();

			// Upgrade Panel
			$("#action-panel-upgrade").on("click", "button", UserActionPanel.panels.PROPERTY_BUY.disable);
			UserActionPanel.panels.PROPERTY_UPGRADE.disable();

			delete UserActionPanel.init;
		},
		panels: {
			PROPERTY_BUY: {
				node: $("#action-panel-buy"),
				offer: null,
				enable: function() {
					UserActionPanel.panels.PROPERTY_BUY.node.find("button").prop('disabled', false);
				},
				disable: function() {
					UserActionPanel.panels.PROPERTY_BUY.node.find("button").prop('disabled', true);
				},
				prompt: function(data) {
					// Make target panel visible
					UserActionPanel.selectPanel("PROPERTY_BUY");

					var panel = UserActionPanel.panels.PROPERTY_BUY;

					// Fill information
					for(var field in data.fields) {
						if(data.fields.hasOwnProperty(field)) {
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
					UserActionPanel.panels.PROPERTY_BUY.node.find("button.main").focus();
				},
				onComplete: function(prom) {
					var panel = UserActionPanel.panels.PROPERTY_BUY;

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
				node: $("#action-panel-upgrade"),
				offer: null,
				enable: function() {
					UserActionPanel.panels.PROPERTY_UPGRADE.node.find("button").prop('disabled', false);
				},
				disable: function() {
					UserActionPanel.panels.PROPERTY_UPGRADE.node.find("button").prop('disabled', true);
				},
				prompt: function(data) {
					// Make target panel visible
					UserActionPanel.selectPanel("PROPERTY_UPGRADE");

					var panel = UserActionPanel.panels.PROPERTY_UPGRADE;

					// Fill information
					for(var field in data.fields) {
						if(data.fields.hasOwnProperty(field)) {
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
					UserActionPanel.panels.PROPERTY_UPGRADE.node.find("button.main").focus();
				},
				onComplete: function(prom) {
					var panel = UserActionPanel.panels.PROPERTY_UPGRADE;

					// Clean up completed offer
					panel.offer = null;

					// Show success animation
					panel.node.removeClass("done").addClass("done");

					// Hide panel after 1s delay
					window.setTimeout(function(){
						UserActionPanel.slideClose(prom);
					}, 1000);
				}
			}
		},
		selectPanel: function(id) {
			if(UserActionPanel.panels.hasOwnProperty(id)){
				// Hide and reset all panels first
				$("#action-panel").find("section").removeClass("done").hide();

				// Show selected panel only
				var panel = UserActionPanel.panels[id];
				panel.node.show();
			}
		},
		slideOpen: function(prom) {
			var transition = prom || $.Deferred(),
			    panel = $("#stage-box-slide");
			panel.css("top", $("#action-panel").height() * -1);
			panel.one('transitionend', transition.resolve);

			return transition.promise();
		},
		slideClose: function(prom) {
			var transition = prom || $.Deferred(),
			    panel = $("#stage-box-slide");
			panel.css("top",0);
			panel.one('transitionend', transition.resolve);

			return transition.promise();
		},
		prompt: function(evt, data) {
			var panel = evt.data.panel;
			panel.prompt(data);
		},
		onCancel: function(prom) {
			// Hide player action panel after a very short delay
			window.setTimeout(function(){
				UserActionPanel.slideClose(prom);
			}, 100);
		}
	};

	// Register handlers for UserActionPanel
	$.subscribe(
		"UI.UserActionPanel.PromptPropertyBuy",
		{ panel: UserActionPanel.panels.PROPERTY_BUY },
		UserActionPanel.prompt
	);

	$.subscribe(
		"UI.UserActionPanel.PromptPropertyUpgrade",
		{ panel: UserActionPanel.panels.PROPERTY_UPGRADE },
		UserActionPanel.prompt
	);

	// Offer handlers
	function acceptOffer(evt){
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

	function declineOffer(evt){
		var panel = evt.data.panel;
		// Decline offer
		panel.offer.decline();

		// Remove offer
		panel.offer = null;

		// Close prompt and then fires callback
		var closeAnimation = $.Deferred();
		UserActionPanel.onCancel(closeAnimation);
		closeAnimation.done(evt.data.onPanelClosed);
	}

	return UserActionPanel;
});