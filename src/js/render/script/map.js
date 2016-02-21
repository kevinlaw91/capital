define([
	"engine/ui",
	"engine/camera",
	"render/script/floor"
], function() {
	return function() {
		// Render floor
		require("render/script/floor")();

		// Remove dummy scene object
		require("engine/ui").removePlaceholder();

		// Update camera cache
		var camera = require("engine/camera");
		camera.updateBBox();
		camera.center();
	};
});