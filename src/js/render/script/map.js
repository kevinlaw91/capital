define([
	"engine/camera",
	"render/script/floor"
], function() {
	return function() {
		// Render floor
		require("render/script/floor")();

		var Camera = require("engine/camera");

		// Remove dummy scene if present
		if(Camera.removeDummyScene) {
			Camera.removeDummyScene();
		}
		// Re-calculates camera's boundary
		Camera.updateBBox();
		Camera.center();
	};
});