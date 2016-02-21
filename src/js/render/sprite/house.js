define([
	"engine/renderer",
	"render/sprite/sprite"
], function(Renderer, Sprite) {
	'use strict';
	/**
	 * Marker sprite to indicate active player
	 * @augments Sprite
	 */
	function House(){
		// Inherits Sprite object
		Sprite.apply(this, [
			Renderer.layers.buildings.paper.use("house-normal"),
			{
				height: 64,
				width: 64,
				offsetX: 25,
				offsetY: 25
			}
		]);

		/** @override */
		this.moveTo = function(x,y){
			this.x = x;
			this.y = y;

			//Update view
			this.view.attr(this.getBoundingOffset(x,y));

			//Reorder Z
			//Recalculate z
			var thisZ = Number(this.view.node.y.baseVal.value);

			var instances = Renderer.layers.buildings.paper.node.children,
			    i = instances.length - 1,
			    target = null,
			    targetZ;

			while(i>=0){
				var now = instances[i];

				//No need to compare with myself
				if(now !== this.view.node){
					// Determine order in Z space by scanning Y value
					var nowZ = Number(now.y.baseVal.value);

					// Compare Z depth by scanning reversely in DOM
					// Stop scan when found final target position
					if(thisZ<nowZ){
						//This should be moved and put behind
						if(target === null || nowZ<targetZ){
							target = now;
							targetZ = nowZ;
						}
					}else{
						break; // Found target, stop scanning
					}
				}
				i--;
			}

			//Reorder element to the target Z
			if(target !== null){
				this.view.insertBefore(target);
			}
		};
	}

	return House;
});