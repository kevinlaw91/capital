// Directory of submodules
var submodulePath = "ui/user-action-panel/";

define([
	"jquery",
	"jquery.pub-sub",
	submodulePath + "PropertyBuy",
	submodulePath + "PropertyUpgrade"
], function($) {
	"use strict";

	/** Load submodules */
	var submodule = {
		PropertyBuy: require(submodulePath + "PropertyBuy"),
		PropertyUpgrade: require(submodulePath + "PropertyUpgrade")
	};

	/** @namespace */
	var UserActionPanel = {
		init: function() {
			// Init panel
			UserActionPanel.node = $("#action-panel");

			// Init all submodules
			for (var m in submodule) {
				if (submodule.hasOwnProperty(m)) {
					submodule[m].init(UserActionPanel);
				}
			}

			delete UserActionPanel.init;
		},
		/**
		 * Show a prompt and return two promises:
		 * onResult - {@link UserActionPanelPrompt#onResult}
		 * onDismiss - {@link UserActionPanelPrompt#onDismiss}
		 * @param {string} id - Specify id of prompt to be shown
		 * @param {Object} data - Data used for prompt
		 * @return {{onResult: Promise, onDismiss: Promise}}
		 */
		prompt: function(id, data) {
			// Hide and reset all panels
			UserActionPanel
				.node
				.find("section")
				.removeClass("done")
				.hide();

			var prompt = submodule[id];

			// Reset and refresh info, then display it
			prompt.prepare(data);
			prompt.node.show();

			// Slide open
			UserActionPanel
				.slideOpen()
				.then(prompt.onShow.bind(prompt));

			return {
				onResult: prompt.onResult(),
				onDismiss: prompt.onDismiss()
			};
		},
		slideOpen: function() {
			return new Promise(function(resolve) {
				$("#stage-box-slide")
					.css("top", UserActionPanel.node.height() * -1)
					.one("transitionend", resolve);
			});
		},
		slideClose: function() {
			return new Promise(function(resolve) {
				$("#stage-box-slide")
					.css("top", 0)
					.one("transitionend", resolve);
			});
		}
	};

	/**
	 * @interface UserActionPanelPrompt
	 */

	/**
	 * Init callback
	 * @callback UserActionPanelPrompt#init
	 * @param {UserActionPanel} context - Pass parent module reference
	 */

	/**
	 * Prepare interface for a new prompt
	 * @name UserActionPanelPrompt#prepare
	 * @param data - Data used for UI preparation
	 * @function
	 */

	/**
	 * Return a promise that resolved when prompt were dismissed
	 * @name UserActionPanelPrompt#onDismiss
	 * @function
	 * @return {Promise}
	 */

	/**
	 * Return a promise that resolved when choice has been made by player
	 * @name UserActionPanelPrompt#onResult
	 * @function
	 * @return {Promise}
	 */

	/**
	 * Callback when prompt is fully shown
	 * @callback UserActionPanelPrompt#onShow
	 */

	return UserActionPanel;
});