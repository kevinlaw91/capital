define([
	"jquery",
	"render/sprite/sprite",
	"engine/renderer",
	"engine/config",
	"render/script/popup"
], function($, Sprite, Renderer) {
	"use strict";

	/** Duration of moving animation */
	var animationDuration;

	// Utils
	function onClickFactory(player) {
		return function() {
			$.publish("UI.InfoPanel.PlayerInfo.Refresh", player);
			$.publish("UI.InfoPanel.PlayerInfo.Show");
		};
	}

	function onMouseOverFactory(token, player) {
		return function() {
			var reg = token.getRegistrationPoint();

			$.publish(
				"UI.Tooltip.Show",
				{
					type: "PLAYER",
					entity: player,
					position: {
						left: reg.x,
						top: reg.y
					}
				}
			);
		};
	}

	function hideTooltip() {
		$.publish("UI.Tooltip.Hide");
	}

	/**
	 * Sprite to represent player token
	 * @augments Sprite
	 * @param player - Player model
	 * @returns {PlayerToken}
	 * @constructor
	 */
	function PlayerToken(player) {
		// Inherits Sprite object
		Sprite.apply(this, [
			Renderer.layers.tokens.paper.use(player.color.TOKEN),
			{
				width: 32,
				height: 37,
				offsetX: 16,
				offsetY: 29
			}
		]);

		// Set mouse event handlers
		var view = this.view;

		view.click(onClickFactory(player));
		view.mouseover(onMouseOverFactory(this, player));
		view.mouseout(hideTooltip);

		// Cache animation duration
		animationDuration = require("engine/config").get("player.token.stepTime");

		/**
		 * @param {number} x - New x position (screen space)
		 * @param {number} y - New y position (screen space)
		 * @param {Boolean} animate - Use animation for transition
		 * @param {function} [callback] - Callback when token become stationary
		 * @override
		 */
		this.moveTo = function(x, y, animate, callback) {
			// Update position to new position
			// value will not be animated
			this.x = x;
			this.y = y;

			// Update sprite
			var targetPos = this.getBoundingOffset(x, y);
			var doCallback = callback || $.noop; // Define callback

			if (animate) {
				$(this.view.node)
					.velocity(targetPos, animationDuration, "ease-in-out", doCallback);
			} else {
				this.view.attr(targetPos);
				doCallback();
			}
		};

		return this;
	}

	PlayerToken.prototype.bringToFront = function() {
		this.view.appendTo(Renderer.layers.tokens.paper);
	};

	PlayerToken.prototype.popup = function(msg, options) {
		var extras = options || {};

		// Tooltip offset from ground tile
		var offsetX = 0,
			offsetY = -5;

		extras.x = this.x + offsetX;
		extras.y = this.y + offsetY;

		// Render tooltip as spatial element
		require("render/script/popup")(msg, extras);
	};

	return PlayerToken;
});