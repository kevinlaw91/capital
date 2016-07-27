define(["jquery"], function($) {
	"use strict";

	/** @class Lightbox */
	return {
		node: $("#app-windows-layer").find(".lightbox"),
		show: function() {
			this.node
			    // Clear pending cleanup task by triggering it purposely
			    .trigger("animationend")
			    .attr("aria-hidden", "false")
			    .removeClass("hidden")
			    .addClass("animate_on");
		},
		hide: function() {
			this.node
			    .removeClass("animate_on")
			    .addClass("animate_off")
			    .one("animationend", this.reset.bind(this));
		},
		reset: function() {
			this.node
			    .removeClass("animate_on animate_off")
			    .addClass("hidden")
			    .attr("aria-hidden", "true");
		}
	};
});