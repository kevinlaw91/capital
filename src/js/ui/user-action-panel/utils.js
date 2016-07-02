/** Common util functions for UserActionPanel submodules */
define([
	"jquery",
	"engine/assets"
], function($, AssetManager) {
	"use strict";

	// Imports
	var FragmentStore = AssetManager.FragmentStore;

	return {
		/** Prepare UI template */
		inflate: function(id) {
			var fragment = FragmentStore.get(id).cloneNode(true);

			// Delete from store when cloned
			FragmentStore.remove(id);

			return fragment;
		},

		/**
		 * Enable buttons
		 * @function
		 * @param {jQuery} node
		 */
		enableButtons: function(node) {
			node.find("button")
			    .prop("disabled", false);
		},

		/**
		 * Disable buttons
		 * @function
		 * @param {jQuery} node
		 */
		disableButtons: function(node) {
			node.find("button")
			    .prop("disabled", true);
		},

		/** Populate data fields into UI placeholder elements */
		populateFields: function(node, fields) {
			for (var f in fields) {
				if (fields.hasOwnProperty(f)) {
					node.find("[data-label='" + f + "']")
					    .text(fields[f]);
				}
			}
		}
	};
});