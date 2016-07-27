define([
	"jquery",
	"jquery.pub-sub",
	"engine/core"
], function($) {
	"use strict";

	/**
	 * Construct a tooltip controller object
	 * @param {number} offsetX - Default x offsets to be applied
	 * @param {number} offsetY - Default y offsets to be applied
	 * @param {function} setup - Script to render tooltip
	 * @returns {Tooltip}
	 * @constructor
	 */
	function Tooltip(offsetX, offsetY, setup) {
		this.node = $("<div/>", { role: "tooltip" });
		this.offsetX = offsetX;
		this.offsetY = offsetY;

		// Run setup if available
		if (setup) {
			setup(this.node);
		}

		// Attach and hide
		this.node.appendTo($("#game-tooltip-layer"))
		    .attr("aria-hidden", "true")
		    .hide();

		return this;
	}

	Tooltip.prototype.hide = function() {
		this.node.attr("aria-hidden", "true").hide();
	};

	Tooltip.prototype.show = function() {
		this.node.attr("aria-hidden", "false").show();
	};

	Tooltip.prototype.setPosition = function(left, top) {
		this.node.css({
			left: left + this.offsetX,
			top: top + this.offsetY
		});
	};

	Tooltip.prototype.update = function(updater) {
		updater(this.node.find(".contents"));
	};

	/**
	 * Define tooltip handlers
	 * @namespace tooltips
	 */
	var Tooltips = {
		/** @see updaters.LOT */
		LOT: new Tooltip(0, -25, function(node) {
			node.attr({ id: "tooltip-lotname" })
				.append($("<div/>", { "class": "contents" }));
		}),
		/** @see updaters.LOT */
		PLAYER: new Tooltip(0, -50, function(node) {
			node.attr({ id: "tooltip-playername" })
			    .append($("<div/>", { "class": "contents" }));
		})
	};

	/** Main tooltip controller */
	var TooltipController = {
		/** Handle tooltip show event */
		show: function(evt, data) {
			/**
			 * Define tooltip content updaters
			 * Upon called, context will be the reference to the
			 * .container element of the tooltip node
			 * @namespace updaters
			 */
			var updaters = {
				/** @see Tooltips.LOT */
				LOT: function(context) {
					context.text(require("engine/core").getSession().map.lot[data.id].name);
				},
				/** @see Tooltips.PLAYER */
				PLAYER: function(context) {
					context.text(data.entity.name);
				}
			};

			// Retrieve relevant tooltip handler by class
			var t = Tooltips[data.type];

			t.update(updaters[data.type]);
			t.setPosition(data.position.left, data.position.top);
			t.show();
		},

		/** Handle tooltip hide event */
		hide: function() {
			// Use manual listing instead of looping members
			// for better performance
			Tooltips.LOT.hide();
			Tooltips.PLAYER.hide();
		}
	};

	// Listening Tooltip requests
	$.subscribe("UI.Tooltip.Show", TooltipController.show);
	$.subscribe("UI.Tooltip.Hide", TooltipController.hide);
});