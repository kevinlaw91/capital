require.config({
	baseUrl: "js",
	paths: {
		"chartist": "lib/chartist",
		"chartist-plugin-tooltip": "lib/chartist-plugin-tooltip.min",
		"chartist-plugin-pointlabels": "lib/chartist-plugin-pointlabels.min",
		"jquery": "lib/jquery-3.0.0",
		"jquery.easing": "lib/jquery.easing.1.3",
		"jquery.pub-sub": "lib/jquery.tinypubsub",
		"opentype": "lib/opentype",
		"snapsvg": "lib/snap.svg",
		"svg-pan-zoom": "lib/svg-pan-zoom", // Namespace have to be svg-pan-zoom
		"velocity": "lib/velocity"
	},
	shim: {
		"jquery.easing": ["jquery"],
		"jquery.pub-sub": ["jquery"],
		"velocity": ["jquery"],
		"chartist-plugin-tooltip": ["chartist"],
		"chartist-plugin-pointlabels": ["chartist"]
	},
	defaultErrback: null
});

// Benchmark game load time
console.time("Game Loaded");

// Call entry point
require([
	"jquery",
	"engine/config",
	"engine/dev",
	"engine/core",
	"engine/transform",
	"utils",
	"polyfills",
	"velocity"
], function($, Config, Dev, Engine) {
	"use strict";
	// Use custom logger
	Dev.logger.init();

	// Inject polyfills
	require("polyfills");

	// Generate projection transform matrix
	require("engine/transform").generate({
		column: 17,
		row: 17,
		tileSize: 64
	});

	// Async wait for configs to load
	Config.load().done(function() {
		// Async wait for dom to get ready
		$(document).ready(function() {
			// DOM is ready
			// Initialize engine
			Engine.init();
		});
	});
});

