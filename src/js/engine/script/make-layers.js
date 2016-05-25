define([
	"engine/renderer"
], function(Renderer) {
	'use strict';

	return function(){
		// Define render layers
		Renderer.createLayer("anchors");
		Renderer.createLayer("floor");
		Renderer.createLayer("floor_overlay");
		Renderer.createLayer("markers");
		Renderer.createLayer("tokens");
		Renderer.createLayer("buildings");
		Renderer.createLayer("popups");

		// Ignore pointer events
		Renderer.layers.floor_overlay.paper.addClass("no-pointer-events");
		Renderer.layers.markers.paper.addClass("no-pointer-events");
		Renderer.layers.buildings.paper.addClass("no-pointer-events");
	};
});