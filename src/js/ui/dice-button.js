define([
	"jquery",
	"jquery.pub-sub"
], function($) {
	"use strict";

	function roll() {
		$.publish("Player.RollDice");
	}

	var DiceButton = {
		/** Enable DiceButton */
		enable: function() {
			$("#btn-roll")
				.on("click", roll)
				.removeClass("disabled");
		},
		/** Disable DiceButton */
		disable: function() {
			$("#btn-roll")
				.off("click", roll)
				.addClass("disabled");
		},
		/** Play moving animation */
		setIndeterminate: function() {
			$("#player-action-button")
				.removeClass("show hide moving")
				.addClass("moving");
		},
		/** Display dice button */
		show: function() {
			$("#player-action-button")
				.removeClass("show hide moving")
				.addClass("show");
		},
		/** Hide dice button */
		hide: function() {
			$("#player-action-button")
				.removeClass("show hide moving")
				.addClass("hide");
		}
	};

	// Register handler for DiceButton
	$.subscribe("UI.DiceButton.Enable", DiceButton.enable);
	$.subscribe("UI.DiceButton.Disable", DiceButton.disable);

	$.subscribe("UI.DiceButton.Show", DiceButton.show);
	$.subscribe("UI.DiceButton.Show", DiceButton.enable); // Enable as well

	$.subscribe("UI.DiceButton.Hide", DiceButton.hide);
	$.subscribe("UI.DiceButton.Hide", DiceButton.disable); // Disable as well

	$.subscribe("UI.DiceButton.Indeterminate", DiceButton.setIndeterminate);

	return DiceButton;
});