define([
	"jquery",
    "engine/ui",
    "game/randomizer",
    "ui/lightbox",
    "ui/dialogs"
], function($, UI, Randomizer, /** Lightbox */ Lightbox, /** DialogManager */ DialogManager) {
	'use strict';

	// Prize constants
	var PRIZE = 5000,
		ATTEMPT_LIMIT = 3;

	// Private
	var treasureMatrix,
		solved,
		chance,
		_success,
		_failed;

	return {
		getPrize: function() {
			return PRIZE;
		},
		onCellClicked: function(evt) {
			var el = $(evt.target),
				pos = el.attr("data-pos"),
				dialog = DialogManager.get("treasurehunt").node;

			if(!solved &&
			   chance > 0 &&
			   typeof pos !== "undefined" &&
			   el.hasClass("masked")
			) {
				if(this.probe(pos)) {
					// Found
					el.addClass("correct");

					// Remove attempt left message
					dialog.find("h2 span")
					      .eq(chance - 1)
					      .removeClass("animate_on")
					      .addClass("animate_off");

					// Show congratulation message
					dialog.find("h1 span")
					      // Hide title
					      .eq(0)
					      .removeClass("animate_on")
					      .addClass("animate_off")
					      .end()
					      // Show congrats
					      .eq(1)
					      .addClass("animate_on");

					// Notify complete
					this.onComplete(true);
				} else {
					// Incorrect
					el.addClass("empty");

					// Update attempt left
					dialog.find("h2 span")
					      // Reduce chance by 1
					      .eq(chance-- - 1)
					      // Hide old message
					      .removeClass("animate_on")
					      .addClass("animate_off");

					// Show new message if applicable
					if(chance>0){
						dialog.find("h2 span")
						      .eq(chance - 1)
						      .addClass("animate_on");
					}
				}

				// Play unveil animation
				el.removeClass("masked");

				if(chance === 0) {
					// Show failed message
					dialog.find("h1 span")
					      // Hide title
					      .eq(0)
					      .removeClass("animate_on")
					      .addClass("animate_off")
					      .end()
					      // Show oops
					      .eq(2)
					      .addClass("animate_on");

					// Notify complete
					this.onComplete(false);
				}
			}
		},
		/** Prepare dialog before showing */
		prepareDialog: function(fragment) {
			// Randomize treasure position
			this.roll();

			// Reset vars
			solved = false;
			chance = ATTEMPT_LIMIT;

			var dialogFragment = $(fragment);
			dialogFragment.find("div.grid").on("click", "div.cell", this.onCellClicked.bind(this));

		},
		/** Make attempt */
		probe: function(position){
			return typeof treasureMatrix[position] !== "undefined";
		},
		roll: function() {
			// Generate treasure locations
			treasureMatrix = new Array(9);
			treasureMatrix[0] = PRIZE;
			Randomizer.Shuffle(treasureMatrix); // Shuffle
		},
		showDialog: function() {
			$("#game-frame").addClass("shrink");
			Lightbox.show();
			DialogManager.get("treasurehunt")
			  .reset(this.prepareDialog.bind(this))
			  .show();
		},
		hideDialog: function() {
			$("#game-frame").removeClass("shrink");
			Lightbox.hide();
			DialogManager.get("treasurehunt")
			  .hide();
		},
		/** Reveal all cells */
		revealAll: function() {
			var dialog = DialogManager.get("treasurehunt").node;
			dialog.find("div.grid")
			      .addClass("reveal");

			// Draw prize text
			for(var i = 0; i < treasureMatrix.length; i++) {
				if(typeof treasureMatrix[i] !== "undefined") {
					dialog.find(".cell")
					      .eq(i)
					      .append($("<div><span>" + treasureMatrix[i] + "</span></div>"));
				}
			}
		},
		/**
		 * Called when game finished
		 * @param {boolean} result - Success or fail
		 */
		onComplete: function(result) {
			// Reveal all treasure locations
			this.revealAll();

			// Mark as solved
			solved = true;

			// Hide dialog 2s delay
			window.setTimeout(this.hideDialog, 2000);

			// Publish result after certain delay
			if(result){
				window.setTimeout(_success, 2000);
			} else {
				window.setTimeout(_failed, 3000);
			}
		},
		/**
		 * Register callback actions when result is out
		 * @param fn.success - Callback when game finished with win condition
		 * @param fn.failed - Callback when game finished with lose condition
		 */
		onResult: function(fn) {
			//Register callbacks
			_success = fn.success;
			_failed = fn.failed;
		}
	};
});