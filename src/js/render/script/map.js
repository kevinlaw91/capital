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

		// Camera re-centering will cause beforePan to fire
		// since the beforePan event was fired by code and not mousedown,
		// we cannot rely on the mouseup event to reset the flag
		// so we need to reset the flag manually
		Camera.panCompleted();
	};
});