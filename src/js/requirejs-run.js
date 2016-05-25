require.config({
		baseUrl: 'js',
		paths: {
			domReady: 'lib/require.domReady',
			jquery: 'lib/jquery-2.2.0',
			'jquery.easing': 'lib/jquery.easing.1.3',
			'jquery.raf': 'lib/jquery.requestAnimationFrame',
			'jquery.pub-sub': 'lib/jquery.tinypubsub',
			'opentype': 'lib/opentype',
			'snapsvg': 'lib/snap.svg',
			'svg-pan-zoom': 'lib/svg-pan-zoom', // namespace have to be svg-pan-zoom
			utils: 'lib/utils'
		},
		shim: {
			'jquery.easing': ['jquery'],
			'jquery.raf': ['jquery'],
			'jquery.pub-sub': ['jquery']
		}
	}
);

// Benchmark game load time
console.time("Game Loaded");

// Call entry point
require([
	"domReady",
	"engine/config",
	"engine/dev",
	"engine/core",
    "engine/transform",
	"utils"
], function(domReady, Config, Dev, Engine){
	//Provide shortcut methods to console object
	Dev.useShortLogging();

	// Generate projection transform matrix
	require("engine/transform").generate({
		column: 17,
		row: 17,
		tileSize: 64
	});

	// Async wait for configs to load
	Config.load().done(function() {
		// Async wait for dom to get ready
		domReady(function() {
			// DOM is ready
			// Initialize engine
			Engine.init();
		});
	});
});

