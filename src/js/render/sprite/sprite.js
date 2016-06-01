define(["engine/renderer"], function(Renderer){
	'use strict';

	/**
	 * An instance of 2D sprite object
	 * @param spriteObj - Reference to a sprite element or a render script
	 * @param prop - Properties of the sprite
	 * @param [prop.width] - Width of the sprite
	 * @param [prop.height] - Height of the sprite
	 * @param [prop.offsetX] - X registration point (offset)
	 * @param [prop.offsetY] - Y registration point (offset)
	 * @returns {Sprite}
	 * @constructor
	 */
	function Sprite(spriteObj, prop){
		// To inherit this class, please refer
		// http://javascript.info/tutorial/all-one-constructor-pattern

		/** Reference to a 2D sprite */
		this.view = null;

		if(typeof spriteObj === "function"){
			// Render new sprite using render script
			this.view = spriteObj();
		} else {
			// Use rendered sprite object
			this.view = spriteObj;
		}

		/** True position X */
		this.x = 0;

		/** True position Y */
		this.y = 0;

		/** Registration */
		this.offset = { x: 0, y: 0};

		/** Method to write registration point */
		this.setOffset = function(x,y){
			this.offset.x = x;
			this.offset.y = y;
		};

		/**
		 * Calculate bounding box offset for rendering
		 * @readonly
		 * @returns {{x: number, y: number}}
		 */
		this.getBoundingOffset = function(x,y){
			return {
				x: x - this.offset.x,
				y: y - this.offset.y
			};
		};

		/**
		 * Get sprite registration with camera zoom/pan transformation applied
		 * @returns {{x: number, y: number}}
		 */
		this.getRegistrationPoint = function() {
			// Create a SVGPoint
			var layerNode = Renderer.layers.anchors.paper.node,
			    p         = layerNode.ownerSVGElement.createSVGPoint();
			// Reposition SVGPoint to registration point
			p.x = this.x;
			p.y = this.y;

			// Get current camera pan/zoom transform matrix
			// and apply it to the point
			var matrix = Renderer.canvas.node.getScreenCTM();
			p = p.matrixTransform(matrix);
			// Return registration point
			return { x: p.x, y: p.y };
		};

		/** Move the sprite to x,y position */
		this.moveTo = function(x,y){
			this.x = x;
			this.y = y;

			// Update view
			this.view.attr(this.getBoundingOffset(x,y));
		};

		// Override default properties if specified
		if(prop){
			if(typeof prop.width === "number"){
				// Set width
				this.width = prop.width;
				this.view.attr({ width: prop.width});
			}

			if(typeof prop.height === "number") {
				// Set height
				this.height = prop.height;
				this.view.attr({ height: prop.height});
			}

			if(typeof prop.offsetX === "number" &&
			   typeof prop.offsetY === "number"){
				// Set offset
				// Both axis need to be specified to be valid
				this.setOffset(prop.offsetX, prop.offsetY);
				this.view.attr(this.getBoundingOffset(this.x, this.x));
			}
		}

		return this;
	}

	return Sprite;
});