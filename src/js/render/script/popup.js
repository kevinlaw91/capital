define([
	"snapsvg",
	"engine/assets",
	"engine/renderer"
], function(Snap, AssetManager) {
	'use strict';

	var animation_path_str = "M{start.x},{start.y} C{start.cX},{start.cY} {end.cX},{end.cY}  {end.x},{end.y}",
		customEaseIn = function(n) { return Math.pow(n,0.68); };

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
		var rise = 25 + Math.random() * 15,
		    horizontal_range = 20, // Move left or right (max to this amount)
		    vertical_range = 45, // Move to bottom (max to this amount)
		    end_dX = Math.floor(Math.random() * (horizontal_range * 2 + 1)) - (horizontal_range),
		    end_dY = 15 + Math.floor(Math.random() * (vertical_range + 1)),
		    path = newGroup.path(
			    Snap.format(animation_path_str, {
						start: {
							// Starting Point
							x: posX,
							y: posY,
							// Control Point
							cX: posX,
							cY: posY - rise
						},
						end: {
							// Ending Point
							x: posX + end_dX,
							y: posY + end_dY,
							// Control Point
							cX: posX + end_dX,
							cY: posY - rise
						}
				})
		    ).attr({
				stroke: "none",
				fill: "none"
			});

		//
		// Contents
		//
		var scaleGroup = newGroup.g(),
		    animateGroup = scaleGroup.g().attr({ opacity: 0});

		// Draw message
		// Shadow
		var textShadow = animateGroup.text(posX, posY, msg).attr({
			//Styles
			fontFamily: 'Roboto Condensed',
			fontSize: "12px",
			fontWeight: 900,
			letterSpacing: "-0.25px",
			fill: "rgba(0, 0, 0, 0.33)"
		});

		// Text
		var text = animateGroup.text(posX, posY, msg).attr({
			//Styles
			fontFamily: 'Roboto Condensed',
			fontSize: "12px",
			fontWeight: 900,
			letterSpacing: "-0.25px",
			fill: "white"
		});


		//Change color
		if(options && options.color) {
			text.attr({
				fill: options.color
			});
		}

		//Align center
		var center = {
			x : posX - (text.getBBox().width/2),
			y : posY + (text.getBBox().height/2) - /* Extra bottom padding */ 15
		};

		text.attr(center);
		textShadow.attr(center);
		textShadow.attr({
			y: textShadow.asPX("y") + 0.5
		});

		//Message position finalized.
		//Use text bounding box as anchor point for other elements
		var anchor = text.getBBox();

		//Draw prefix
		if(options && typeof options.prefix != "undefined"){
			//Draw at baseline
			var prefix_text = animateGroup.text(posX, posY, options.prefix).attr({
				//Styles
				fontFamily: 'Roboto',
				fontSize: "14px",
				fontWeight: 900,
				fill: "white"
			});

			//Change color
			if(options && options.prefixColor) {
				prefix_text.attr({
					fill: options.prefixColor
				});
			}

			//Calculate the diff between message & prefix vertical center point
			var centerY_prefix = prefix_text.getBBox().y + (prefix_text.getBBox().height / 2),
				diff = centerY_prefix - (anchor.y + (anchor.height / 2)); //center prefix - center message

			//Move to left and vertically center with message
			prefix_text.attr({
				x : text.node.x.baseVal[0].value - prefix_text.getBBox().width - /* Extra right padding */ 2,
				y : prefix_text.node.y.baseVal[0].value - diff
		    });
		}

		//
		// Icon
		//

		//Centered
		var iconSize = 24;
		var iconPosition = {
			x: posX - (iconSize / 2),
			y: anchor.y - iconSize
		};

		//Draw icon
		if(options && options.icon){
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

		// Random life
		var life = Math.random() * 1500;

		// Fade in for 1000ms
		animateGroup.animate({
			opacity: 1
		}, 1000, mina.easeout);

		Snap.animate(0, 1, function(val){
			// Move along path
			var length = path.getTotalLength(),
			    point = path.getPointAtLength(length * val),
			    matrix = new Snap.matrix();
			matrix.translate(point.x - posX, point.y - posY);
			animateGroup.transform(matrix);

			// Scale
			var bb = scaleGroup.getBBox(),
				scale = 1.5-Math.abs(val - 0.25);
			matrix = new Snap.matrix();
			matrix.scale(scale, scale, bb.cx, bb.cy);
			scaleGroup.transform(matrix);
		}, 4500 + life, customEaseIn);

		// Fade out
		window.setTimeout(function(){
			animateGroup.animate({
				opacity: 0
			}, 1000, mina.easeout, function(){
				Snap(newGroup).remove();
			});
		}, 4500 + life - 1000);
	};
});