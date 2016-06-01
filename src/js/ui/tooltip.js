define([
	"jquery",
	"jquery.pub-sub",
	"engine/core"
], function($) {
	'use strict';

	/**
	 * Define tooltip handlers
	 * @namespace tooltips
	 */
	var Tooltips = {
		/** @see updaters.LOT */
		LOT: new Tooltip("#tooltip-lotname",0,-25),
		/** @see updaters.LOT */
		PLAYER: new Tooltip("#tooltip-playername",0,-50)
	};

	/** Main tooltip controller */
	var TooltipController = {
		/** Handle tooltip show event */
		show: function(evt, data){
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
			var t = Tooltips[data.class];
			t.update(updaters[data.class]);
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

	/**
	 * Construct a tooltip controller object
	 * @param {string} node - Selector string that points to the tooltip element
	 * @param {number} offsetX - Default x offsets to be applied
	 * @param {number} offsetY - Default y offsets to be applied
	 * @returns {Tooltip}
	 * @constructor
	 */
	function Tooltip(node, offsetX, offsetY) {
		this.node = $(node);
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		return this;
	}

	Tooltip.prototype.hide = function() {
		this.node.hide();
	};

	Tooltip.prototype.show = function() {
		this.node.show();
	};

	Tooltip.prototype.setPosition = function(left, top) {
		this.node.css({
			"left": left + this.offsetX,
			"top": top + this.offsetY
		});
	};

	Tooltip.prototype.update = function(updater) {
		updater(this.node.find(".contents"));
	};

	// Listening Tooltip requests
	$.subscribe("UI.Tooltip.Show", TooltipController.show);
	$.subscribe("UI.Tooltip.Hide", TooltipController.hide);
});