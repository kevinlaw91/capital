define([
	"jquery",
	"jquery.pub-sub",
	"engine/events"
], function($) {
	'use strict';

	var UserActionPanel = {
		init: function() {
			var GameEvents = require("engine/events");

			// Set default button action
			var callback;

			// Buy button
			callback = $.Callbacks();
			callback.add(GameEvents.PlayerAction.Buy)
			        .add(function(success){
				        if(success) {
					        UserActionPanel.panels.PROPERTY_BUY.onComplete();
				        }
			        });
			$(".player-action-btn-buy").on("click", callback.fire)
			                           .prop('disabled', true);

			// Upgrade button
			callback = $.Callbacks();
			callback.add(GameEvents.PlayerAction.Upgrade)
			        .add(function(success){
				        if(success) {
					        UserActionPanel.panels.PROPERTY_UPGRADE.onComplete();
				        }
			        });
			$(".player-action-btn-upgrade").on("click", callback.fire)
			                               .prop('disabled', true);

			// Decline buttons
			$(".player-action-btn-done").on("click", UserActionPanel.onCancel);

			delete UserActionPanel.init;
		},
		panels: {
			PROPERTY_BUY: {
				node: $("#action-panel-buy"),
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

					// Slide open
					UserActionPanel.slideOpen().done(panel.onFocus);
				},
				onFocus: function() {
					// Focus default button
					UserActionPanel.panels.PROPERTY_BUY.node.find("button.main").focus();
				},
				onComplete: function() {
					var node = UserActionPanel.panels.PROPERTY_BUY.node;

					// Show success animation
					node.removeClass("done").addClass("done");

					// Prompt finished with result
					UserActionPanel.onResult();
				}
			},
			PROPERTY_UPGRADE: {
				node: $("#action-panel-upgrade"),
				prompt: function(data) {
					// Make target panel visible
					UserActionPanel.selectPanel("PROPERTY_UPGRADE");

					var panel = UserActionPanel.panels.PROPERTY_UPGRADE;

					// Fill information
					for(var field in data) {
						if(data.hasOwnProperty(field)) {
							panel.node.find("[data-label='" + field + "']")
							     .text(data[field]);
						}
					}

					// Slide open
					UserActionPanel.slideOpen().done(panel.onFocus);
				},
				onFocus: function() {
					// Focus default button
					UserActionPanel.panels.PROPERTY_UPGRADE.node.find("button.main").focus();
				},
				onComplete: function() {
					var node = UserActionPanel.panels.PROPERTY_UPGRADE.node;

					// Show success animation
					node.removeClass("done").addClass("done");

					// Prompt finished with result
					UserActionPanel.onResult();
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
	$.subscribe("UI.UserActionPanel.PromptPropertyBuy", { panel: UserActionPanel.panels.PROPERTY_BUY }, UserActionPanel.prompt);
	$.subscribe("UI.UserActionPanel.PromptPropertyUpgrade", { panel: UserActionPanel.panels.PROPERTY_UPGRADE }, UserActionPanel.prompt);

	// Slide close
	function actionCompleted(){
		UserActionPanel.slideClose().done(delayedPlayerEndsTurn);
	}

	function delayedPlayerEndsTurn(){
		// Delay end turn for 500ms after slide close animation ended
		window.setTimeout(doPlayerEndsTurn, 500);
	}

	function doPlayerEndsTurn() {
		$.publish("PlayerEndsTurn");
	}

	return UserActionPanel;
});