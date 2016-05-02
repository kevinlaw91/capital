define([
	"snapsvg",
	"engine/assets",
	"engine/renderer"
], function(Snap, AssetManager) {
	'use strict';

	var customEaseIn = function(n) { return Math.pow(n,0.68); };

	/**
	 * @function
	 * @param {string} msg - Message to be rendered
	 * @param {object} [options] - Customization options
	 * @param {number} [options.x] - X screen coordinate to render
	 * @param {number} [options.y] - Y screen coordinate to render
	 * @param {string} [options.color=white] - Color for message text
	 * @param {string} [options.iconColor] - Color for icon
	 * @param {string} [options.icon] - Icon to be displayed on top of text (symbol id)
	 * @param {string} [options.prefix] - Text to be appended before message
	 * @param {string} [options.prefixColor=white] - Color for prefix text
	 */
	return function(msg, options) {
		var posX = (options && options.x) || 0,
		    posY = (options && options.y) || 0;

		var newGroup = require("engine/renderer").layers.popups.paper.g();

		//
		// Create Animation Path
		//
		var r1 = Math.random(), r2 = Math.random(), r3 = Math.random(),
			rise =  25 /* minimum */ + r1 * 15,
		    horizontal_range = 20, // Move left or right (max to this amount)
		    vertical_range = 45, // Move to bottom (max to this amount)
		    end_dX = Math.floor(r2 * (horizontal_range * 2 + 1)) - (horizontal_range),
		    end_dY = 15 + Math.floor(r3 * (vertical_range + 1)),
		    path_str = "M" + posX + "," + posY +
		               " C" + posX + "," + (posY - rise) + " " +
		               (posX + end_dX) + "," + (posY - rise) + " " +
		               (posX + end_dX) + "," + (posY + end_dY),
			path = newGroup.path(path_str).attr({
				stroke: "none",
				fill: "none"
			});

		//
		// Contents
		//
		var animateGroup = newGroup.g().attr({ opacity: 0});

		// Draw message

		// Shadow (behind) will be drawn first
		var textShadow = animateGroup.text(0, 0, msg).attr({
			//Styles
			dominantBaseline: "central",
			textAnchor: "middle",
			fontFamily: 'Roboto Condensed',
			fontSize: "12px",
			fontWeight: 900,
			letterSpacing: "-0.25px",
			fill: "rgba(0, 0, 0, 0.33)"
		});

		// Text (foreground) will be drawn later
		var text = animateGroup.text(0, 0, msg).attr({
			//Styles
			dominantBaseline: "central",
			textAnchor: "middle",
			fontFamily: 'Roboto Condensed',
			fontSize: "12px",
			fontWeight: 900,
			letterSpacing: "-0.25px",
			fill: "white"
		});


		// Change color
		if(options && options.color) {
			text.attr({
				fill: options.color
			});
		}

		// Shadow offset
		textShadow.transform("translate(0, 1)");

		// Use text bounding box as anchor point for other elements
		var anchor = text.getBBox();

		// Draw prefix
		if(options && typeof options.prefix != "undefined"){
			//Draw at baseline
			var prefix_text = animateGroup.text(0, 0, options.prefix).attr({
				//Styles
				dominantBaseline: "central",
				textAnchor: "end",
				fontFamily: 'Roboto',
				fontSize: "18px",
				fontWeight: 900,
				fill: "white",
				x: anchor.x - /* Extra right padding */ 2,
				y: 0
			});

			//Change color
			if(options && options.prefixColor) {
				prefix_text.attr({
					fill: options.prefixColor
				});
			}
		}

		//
		// Icon
		//

		//Draw icon
		if(options && options.icon){
			//Centered
			var iconSize = 24,
			    iconPosition = {
					x: -(iconSize / 2),
					y: anchor.y - iconSize
				};

			if(AssetManager.hasSymbol(options.icon)) {
				var icon = animateGroup.use(options.icon);
				var iconStyles = {
					x: iconPosition.x,
					y: iconPosition.y,
					height: iconSize,
					width: iconSize
				};

				//Apply color
				if(options && options.iconColor){
					iconStyles.fill = options.iconColor;
				}

				icon.attr(iconStyles);
			} else {
				warn("Missing symbol: " + options.icon + ". Icon was not drawn to the popup.");
			}
		}

		//
		// Animations
		//

		// Randomize life span
		var life = r1 * 1500;

		// Fade in for 1000ms
		animateGroup.animate(
			{ opacity: 1 },
			1000,
			mina.easeout
		);

		// Path animation function
		var pathAnimation = (function(p){
			var l = p.node.getTotalLength();

			return function(val){
				var scale = 1.5-Math.abs(val - 0.25),
				    length = l,
				    point = path.getPointAtLength(length * val),

				    // Optimized transform matrix, included operations:
				    // matrix.scale(scale, scale, point.x, point.y);
				    // matrix.translate(point.x, point.y);
				    matrix = new Snap.matrix(scale,0,0,scale,point.x,point.y);

				animateGroup.transform(matrix);
			};
		})(path);
		// Start path animation
		Snap.animate(0, 1, pathAnimation, 4500 + life, customEaseIn);

		// Fade out
		window.setTimeout(function(){
			animateGroup.animate(
				{ opacity: 0 },
				1000,
				mina.easeout,
				function(){ Snap(newGroup).remove(); }
			);
		}, 4500 + life - 1000);
	};
});