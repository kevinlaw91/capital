define([
	"jquery",
	"render/sprite/sprite",
	"engine/renderer",
	"engine/config",
	"render/script/popup"
], function($, Sprite, Renderer) {

	/** Duration of moving animation */
	var animationDuration;

	/** Resources for token */
	var token_resources = {
		"RED": "player-token-red",
		"BLUE": "player-token-blue",
		"PINK": "player-token-pink"
	};

	/**
	 * Sprite to represent player token
	 * @augments Sprite
	 * @param color - Token color
	 * @returns {PlayerToken}
	 * @constructor
	 */
	function PlayerToken(color){
		// Inherits Sprite object
		Sprite.apply(this, [
			Renderer.layers.tokens.paper.use(token_resources[color]),
			{
				width: 32,
				height: 37,
				offsetX: 16,
				offsetY: 29
			}
		]);

		// Cache animation duration
		animationDuration = require("engine/config").get("player.token.stepTime");

		/**
		 * @param {number} x - New x position (screen space)
		 * @param {number} y - New y position (screen space)
		 * @param {Boolean} animate - Use animation for transition
		 * @param {function} [callback] - Callback when token become stationary
		 * @override
		 */
		this.moveTo = function(x, y, animate, callback){
			// Update position to new position
			// value will not be animated
			this.x = x;
			this.y = y;

			// Update sprite
			var targetPos = this.getBoundingOffset(x,y);
			var doCallback = callback || $.noop; // Define callback
			if(animate){
				this.view.animate(targetPos, animationDuration, mina.easeinout, doCallback);
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

		//Render tooltip as spatial element
		require("render/script/popup")(msg, extras);
	};

	return PlayerToken;
});