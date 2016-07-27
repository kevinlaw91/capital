define([
	"jquery",
	"engine/assets",
	"./utils"
], function($, AssetManager, Utils) {
	"use strict";

	/** Reference to parent module */
	var UserActionPanel;

	/** Promise for the prompt */
	var prompt;

	/** Resolver for the prompt promise */
	var postResult;

	/** Resolver for the prompt dismiss promise */
	var promptClosed;

	/** Success event callback */
	var onSuccess;

	/** Callback when accepted */
	function acceptOffer() {
		// Request outcome from game controller using promise
		new Promise(function(resolve) {
			postResult({
				value: 1,
				forwardOutcome: resolve
			});
		}).then(function(success) {
			// Outcome obtained from game controller
			if (success) {
				// Show success animation
				onSuccess();

				// Hide panel after 1s delay
				window.setTimeout(function() {
					UserActionPanel.slideClose()
					               .then(promptClosed);
				}, 1000);
			} else {
				// Player want to buy but failed
				// This shouldn't happen under normal condition
				throw new Error("Unable to buy.");
			}
		});
	}

	/** Callback when declined */
	function rejectOffer() {
		// Hide panel after very short delay
		window.setTimeout(function() {
			UserActionPanel.slideClose()
			               .then(promptClosed);
		}, 100);
	}

	/**
	 * PropertyBuy Prompt
	 * @implements UserActionPanelPrompt
	 */
	return {
		node: $("<section />"),
		init: function(context) {
			// Store context
			UserActionPanel = context;

			// Template fragment
			this.node
			    .append(Utils.inflate("panel-prompt-buy"))
			    .on("click", "button", Utils.disableButtons.bind(null, this.node));

			// Add success tick icon
			var checkmark = AssetManager.SymbolStore.use("icon-tick");

			this.node
			    .find("button.accept")
			    .prepend(checkmark.attr("class", "icon success").node);

			// Append
			this.node.appendTo(UserActionPanel.node);

			// Define success animation
			onSuccess = function() {
				this.node
				    .removeClass("done")
				    .addClass("done");
			}.bind(this);

			// Disable buttons by default
			Utils.disableButtons(this.node);

			delete this.init;
		},
		prepare: function(data) {
			// Fill information
			Utils.populateFields(this.node, data.fields);

			// Prompt modifiers
			// Offer is valid?
			this.node
			    .find("[data-modifier-offer]")
			    .hide()
			    .end()

			    .find("[data-modifier-offer='" + data.modifier.offer + "']")
			    .show();

			// Register prompt as new promise
			prompt = new Promise(function(resolve) {
				postResult = resolve;
			});

			// Setup buttons
			this.node
			    // Buy button
			    .find("button.accept")
			    .unbind("click.accept")
			    .one("click.accept", acceptOffer.bind(this))
			    .end()

			    // Decline button
			    .find("button.decline")
			    .unbind("click.decline")
			    .one("click.decline", rejectOffer.bind(this))
			    .end()

			    // OK button
			    .find("button.ok")
			    .unbind("click.ok")
			    .one("click.ok", rejectOffer.bind(this));

			// Enable buttons
			Utils.enableButtons(this.node);
		},
		onShow: function() {
			// Focus default button
			this.node.find("button.default").focus();
		},
		onResult: function() {
			return prompt;
		},
		onDismiss: function() {
			return new Promise(function(resolve) {
				promptClosed = resolve;
			});
		}
	};
});