define([
	"engine/camera",
	"ui/stage",
	"engine/renderer",
	"script/make-layers"
], function(Camera, Stage, Renderer) {
	'use strict';

	return function(deferred) {
		// Constructs camera viewport
		Camera.setup();

		// Pass reference of camera viewport to renderer
		Renderer.setCanvas(Stage.canvas);

		// Construct rendering layers
		require("script/make-layers")();

		// Notify stage is ready
		deferred.resolve();
	};

});