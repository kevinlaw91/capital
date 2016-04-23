define([
	"snapsvg",
	"engine/assets",
	"engine/renderer"
], function(Snap, AssetManager) {
	'use strict';

	// Shadow filter
	var filter_shadow,
	    customEaseIn = function(n) { return Math.pow(n,0.68); },
	    createSVGPathText = function(text, font, options) {
			var x = options.x || 0,
			    y = options.y || 0,
			    fontSize = options.fontSize || 16, // in px
			    kerning = options.kerning || true,
			    precision = options.precision || 5, // decimal points
			    fontScale = 1 / font.unitsPerEm * fontSize;

			// Calculate bounding box
			var width = 0, glyphs = font.stringToGlyphs(text);
			for (var i = 0, len = glyphs.length; i < len; i++) {
				var glyph = glyphs[i];

				if (glyph.advanceWidth) {
					width += glyph.advanceWidth * fontScale;
				}

				if (kerning && i < len - 1) {
					var kerningValue = font.getKerningValue(glyph, glyphs[i + 1]);
					width += kerningValue * fontScale;
				}
			}

			var height = (font.ascender + font.descender) * fontScale;

			// Apply anchor offsets
			if('align' in options) {
				switch(options.align){
					case "middle":
					case "center":
						x -= width / 2;
						break;
					case "right":
						x -= width;
						break;
				}
			}

			if('baseline' in options) {
				switch(options.baseline){
					case "middle":
					case "center":
						y += height / 2;
						break;
					case "top":
						y += height;
						break;
				}
			}

			return font
				.getPath(text, x, y, fontSize, { kerning: kerning })
				.toPathData(precision);
		};

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

		var Renderer = require("engine/renderer");

		var newGroup = Renderer.layers.popups.paper.g();

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

		//
		// Draw message
		//

		// Font
		var font = AssetManager.FontStore.getFont("Passion One", "Regular");

		var text = animateGroup.path(
			createSVGPathText(msg, font, {
				fontSize: 16,
				align: "right",
				baseline: "middle"
			})
		);

		// Change color
		if(options && options.color) {
			text.attr({
				fill: options.color
			});
		}

		// Use text bounding box as anchor point for other elements
		var anchor = text.getBBox();

		// Add shadow
		filter_shadow = filter_shadow || Renderer.canvas.filter(Snap.filter.shadow(0, 1, 0.3, "black", 0.3));
		text.attr({
			filter: filter_shadow
		});

		// Draw prefix
		if(options && typeof options.prefix != "undefined"){
			var prefix_text = animateGroup.path(
				createSVGPathText(options.prefix, font, {
					fontSize: 18,
					align: "right",
					baseline: "middle",
					x: anchor.x - /* Extra right padding */ 2
				})
			);

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