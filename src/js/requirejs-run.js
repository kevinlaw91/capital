require.config({
		baseUrl: 'js',
		paths: {
			domReady: 'lib/require.domReady',
			jquery: 'lib/jquery-2.2.0',
			'jquery.easing': 'lib/jquery.easing.1.3',
			'jquery.raf': 'lib/jquery.requestAnimationFrame',
			'jquery.pub-sub': 'lib/jquery.tinypubsub',
			'snapsvg': 'lib/snap.svg',
			'svg-pan-zoom': 'lib/svg-pan-zoom', //namespace must be svg-pan-zoom
			utils: 'lib/utils'
		},
		shim: {
			'jquery.easing': ['jquery'],
			'jquery.raf': ['jquery'],
			'jquery.pub-sub': ['jquery']
		}
	}
);

// Call entry point
require([
	"domReady",
	"engine/config",
	"engine/dev",
	"engine/core",
    "engine/transform",
	"utils"
], function(domReady, Config, Dev){
	//Provide shortcut methods to console object
	Dev.useShortLogging();

	Config.load().done(function() {
		// Configs are loaded
		// Start initialize app
		log("[EVENT] App initializing", "event");

		// Generate projection transform matrix
		require("engine/transform").generate({
			column: 17,
			row: 17,
			tileSize: 64
		});

		// Async wait for dom to get ready
		domReady(function() {
			// Dom is ready
			var Engine = require("engine/core");
			Engine.init();
		});
	});
});

