define([
	"snapsvg",
	"velocity",
	"engine/assets",
	"engine/renderer"
], function(Snap, Velocity, AssetManager) {
	'use strict';

	// Shadow filter
	var filter_shadow,
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
		    horizontal_range = 15, // Move left or right (max to this amount)
		    vertical_range = 35, // Move to bottom (max to this amount)
		    end_dX = Math.floor(r2 * (horizontal_range * 2 + 1)) - (horizontal_range),
		    end_dY = 15 + Math.floor(r3 * (vertical_range + 1)),
		    path_str = "M" + posX + "," + posY +
		               " C" + posX + "," + posY + " " +
		               (posX + end_dX) + "," + posY + " " +
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
				align: "center",
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
		animateGroup.attr({
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
		// Animations
		//

		// Randomize life span
		var life = r1 * 1500;

		// Fade in for 1s during start
		Velocity(animateGroup.node, { opacity: 1, queue: false }, 1000, "ease-out");

		// Tween along path animation
		var pathLength = path.node.getTotalLength();
		Velocity(animateGroup.node,
			{ tween: [1] /* Dummy, from 0 to 1 */ }, {
				queue: false,
				duration: 4500 + life,
				easing: "ease-out",
				progress: function(elements, complete, remaining, start, x) {
					var scale = -2 * Math.pow(x,2) + (1.7 * x) + 1, // y = -2x^2 + 1.7x + 1
						point = path.getPointAtLength(pathLength * x);

					// Optimized transform matrix, included operations:
					// matrix.scale(scale, scale, point.x, point.y);
					// matrix.translate(point.x, point.y);
					var matrix = Snap.matrix(scale,0,0,scale,point.x,point.y);
					Snap(elements[0]).transform(matrix);
			}
		});

		// Start fading out at 1s before finish
		Velocity(animateGroup.node, { opacity: 0 }, {
			queue: false,
			delay: 4500 + life - 1000,
			duration: 1000,
			easing: "ease-out",
			complete: function() { newGroup.remove(); }
		});

	};
});