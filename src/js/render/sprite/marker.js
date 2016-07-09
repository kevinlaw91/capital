define([
	"jquery",
	"render/sprite/sprite",
	"snapsvg",
	"engine/renderer"
], function($, Sprite, Snap, Renderer) {
	"use strict";

	/**
	 * Marker sprite to indicate active player
	 * @augments Sprite
	 * @constructor
	 */
	function GroundMarker() {
		// Inherits Sprite object
		Sprite.apply(this, [
			function() {
				var group = Renderer.layers.markers.paper.g(),
					fragment = Snap.parse(
						"<g transform='matrix(1,0,0,0.5,0,0)'>" +
						"<circle cx='42' cy='42' r='37' />" +
						"</g>"
					);

				group.append(fragment)
				     .addClass("token-active-mark");

				return group;
			},
			{
				offsetX: 42,
				offsetY: 21
			}
		]);

		/**
		 * Re-generates offset matrix every time when offset changes
		 * @override
		 */
		this.setOffset = function(x, y) {
			this.offset.x = x;
			this.offset.y = y;
			this.offset.matrix = new Snap.Matrix().translate(-x, -y);
		};

		/** @override */
		this.moveTo = function(x, y) {
			this.x = x;
			this.y = y;

			// Matrix for positioning the sprite
			var tData = new Snap.Matrix();

			tData.translate(x, y); // Move to x,y
			tData.add(this.offset.matrix); // Apply offset

			// Apply transformation matrix
			this.view.transform(tData);
		};

		//
		// Subclass constructor set ups
		//

		// Calculates offset matrix for the first time
		this.setOffset(this.offset.x, this.offset.y);

		// Renders at origin
		this.moveTo(0, 0);
	}

	/** Reveal the sprite using animation */
	GroundMarker.prototype.show = function() {
		this.view
		    .removeClass("hidden")
		    .addClass("appear");
	};

	/** Hides the sprite */
	GroundMarker.prototype.hide = function() {
		this.view
		    .removeClass("appear")
		    .addClass("hidden");
	};

	return GroundMarker;
});