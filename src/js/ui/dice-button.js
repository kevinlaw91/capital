define([
	"jquery",
	"jquery.pub-sub",
	"engine/events"
], function($) {
	'use strict';

	var DiceButton = {
		init: function() {
			var GameEvents = require("engine/events");
			$("#btn-roll").on("click", GameEvents.PlayerAction.DiceRoll);
			delete DiceButton.init;
		},
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
				DiceButton.enable();
			} else {
				DiceButton.disable();
			}
		}
	};

	// Register handler for DiceButton
	$.subscribe("UI.DiceButton", DiceButton.handler);

	return DiceButton;
});