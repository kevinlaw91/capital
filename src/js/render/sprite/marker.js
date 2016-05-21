define([
	"jquery",
	"render/sprite/sprite",
	"snapsvg",
	"engine/renderer"
], function($, Sprite, Snap) {
	/**
	 * Marker sprite to indicate active player
	 * @augments Sprite
	 * @constructor
	 */
	function GroundMarker(){
		// Inherits Sprite object
		Sprite.apply(this, [
			function(){
				var Renderer = require("engine/renderer"),
				    Snap = require("snapsvg");

				var group = Renderer.layers.markers.paper.g();
				group.append(Snap.parse(
					"<g transform='matrix(1,0,0,0.5,0,0)'>" +
						"<circle cx='42' cy='42' r='37' class='player-token' />" +
					"</g>"
				));
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
		this.setOffset = function(x,y){
			this.offset.x = x;
			this.offset.y = y;
			this.offset.matrix = new Snap.Matrix().translate(-x, -y);
		};

		/** @override */
		this.moveTo = function(x,y){
			this.x = x;
			this.y = y;

			// Matrix for positioning the sprite
			var tData = new Snap.Matrix();
			tData.translate(x,y); // Move to x,y
			tData.add(this.offset.matrix); // Apply offset

			//Apply transformation matrix
			this.view.transform(tData);
		};

		//
		// Subclass constructor set ups
		//

		// Calculates offset matrix for the first time
		this.setOffset(this.offset.x, this.offset.y);

		// Renders at origin
		this.moveTo(0,0);
	}

	/** Reveal the sprite using animation */
	GroundMarker.prototype.show = function(){
		this.view.attr({ display: ""});
		var circleElem = this.view.select("circle").node;
		//Play appear animation
		$(circleElem).addClass("player-token-appear");
	};

	/** Hides the sprite */
	GroundMarker.prototype.hide = function(){
		this.view.attr({ display: "none"});
		//Resets appear animation
		var circleElem = this.view.select("circle").node;
		$(circleElem).removeClass("player-token-appear");
	};

	return GroundMarker;
});