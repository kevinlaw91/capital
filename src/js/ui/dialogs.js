define(["ui/lightbox"], function(Lightbox) {
	"use strict";

	return (function() {
		var d = {};

		/**
		 * @param id - Styling class to append to the dialog element
		 * @param template - Contents template for the dialog
		 * @constructor
		 */
		function Dialog(id, template) {
			var wrapper = $("<section />");

			wrapper.attr("role", "dialog")
			       .addClass("window")
			       .addClass(id);

			this.template = template;
			this.node = wrapper;
		}

		/**
		 * @param setup - Dialog preparation script. Can be used to attach eventlisteners/change look etc.
		 * @returns {Dialog}
		 */
		Dialog.prototype.reset = function(setup) {
			this.node.empty();
			var clone = this.template.cloneNode(true);

			// Setup dialog box
			if (typeof setup === "function") {
				setup(clone);
			}

			this.node.append(clone);

			return this;
		};

		Dialog.prototype.show = function() {
			this.node
			    // Clear pending cleanup task without running it
			    .off("animationend")
			    .insertAfter(Lightbox.node)
			    .removeClass("animate_off")
			    .addClass("animate_on");

			return this;
		};

		Dialog.prototype.hide = function() {
			this.node
			    .removeClass("animate_on")
			    .addClass("animate_off")
			    .one("animationend", this.detach.bind(this));

			return this;
		};

		Dialog.prototype.detach = function() {
			this.node.detach();
		};

		/**
		 * Dialog manager to manage dialog instance creation/display
		 * @class DialogManager
		 */
		return {
			/**
			 * Registers a new dialog instance
			 * @param {string} id - Identifier to the dialog
			 * @param {jQuery} dlgEl - Wrapper element of the dialog
			 */
			register: function(id, dlgEl) {
				d[id] = new Dialog(id, dlgEl);
			},
			/** Get dialog instance by id */
			get: function(id) {
				if (id in d && d[id] instanceof Dialog) {
					return d[id];
				}
			}
		};
	})();
});