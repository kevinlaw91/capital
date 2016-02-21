define([
	"snapsvg",
	"engine/assets",
	"engine/renderer"
], function(Snap, AssetManager) {
	'use strict';
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
		var posX = (options && options.x) || 0;
		var posY = (options && options.y) || 0;

		var newGroup = require("engine/renderer").layers.popups.paper.g().attr({ opacity: 0});

		//
		// Text
		//

		//Draw message
		var text = newGroup.text(posX, posY, msg).attr({
			//Styles
			fontFamily: 'Advent Pro',
			fontWeight: 800,
			fill: "white"
		});

		//Change color
		if(options && options.color) {
			text.attr({
				fill: options.color
			});
		}

		//Align center
		text.attr({
			x : posX - (text.getBBox().width/2),
			y : posY + (text.getBBox().height/2) - /* Extra bottom padding */ 15
		});

		//Message position finalized.
		//Use text bounding box as anchor point for other elements
		var anchor = text.getBBox();

		//Draw prefix
		if(options && typeof options.prefix != "undefined"){
			//Draw at baseline
			var prefix_text = newGroup.text(posX, posY, options.prefix).attr({
				//Styles
				fontFamily: 'Advent Pro',
				fontSize: "24px",
				fontWeight: 800,
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
				x : text.node.x.baseVal[0].value - prefix_text.getBBox().width - /* Extra right padding */ 5,
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
				var icon = newGroup.use(options.icon);
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

		//Fade in for 300ms
		newGroup.animate({
			opacity: 1,
			transform: "translate(0,-10)"
		}, 300, mina.easein);

		//Fade out after 2300ms
		window.setTimeout(function(){
			newGroup.animate({
				opacity: 0,
				transform: "translate(0,-20)"
			}, 300, mina.easeout, function(){
				Snap(newGroup).remove();
			});
		}, 2300);
	};
});