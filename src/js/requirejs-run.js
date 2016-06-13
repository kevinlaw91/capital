require.config({
		baseUrl: 'js',
		paths: {
			jquery: 'lib/jquery-3.0.0',
			'jquery.easing': 'lib/jquery.easing.1.3',
			'jquery.pub-sub': 'lib/jquery.tinypubsub',
			'opentype': 'lib/opentype',
			'snapsvg': 'lib/snap.svg',
			'svg-pan-zoom': 'lib/svg-pan-zoom', // namespace have to be svg-pan-zoom
			'polyfills': 'lib/polyfills'
		},
		shim: {
			'jquery.easing': ['jquery'],
			'jquery.pub-sub': ['jquery']
		}
	}
);

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
	"polyfills"
], function($, Config, Dev, Engine){
	// Provide shortcut methods to console object
	Dev.useShortLogging();

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

