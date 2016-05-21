define([
	"jquery",
	"snapsvg",
	"engine/config"
], function($, Snap) {
	'use strict';

	// Imports
	var Config = require("engine/config");

	var Stage = {
		/** <svg> canvas container as Snap instance */
		container: null,
		/** <g> canvas wrapper as Snap instance */
		canvas: null,
		/** Construct stage */
		init: function(){
			// Create new Snap <svg> element
			var stage = new Snap().attr({
				"id": Config.getAsId("canvas.svg"),
				"class": "pannable"
			});

			// Clean up unwanted <desc> element generated by SnapSVG
			$(stage.node).children("desc:first").remove();

			// Append to container
			$(Config.get("canvas.attach")).append(stage.node);

			// Store reference
			Stage.container = stage;

			delete Stage.init;
		}
	};

	return Stage;
});