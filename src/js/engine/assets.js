define(["jquery", "snapsvg"], function( $, Snap) {

	var AssetManager = {},
		store,
		task_preload = $.Deferred(),
	    task_preload_progress = [];

	// cache dimensions of loaded symbols
	var dimensions = new Map();

	// Define SVG element to store loaded symbols
	AssetManager.setSymbolStore = function(elem){
		store = Snap(elem);
		return module;
	};

	// Preload assets
	AssetManager.preload = function(){
		// Load SVG symbols from file
		[
			"src/resources/svg/floor.svg",
			"src/resources/svg/token.svg",
			"src/resources/svg/icons.svg",
			"src/resources/svg/houses.svg"
		].forEach(loadSVGSymbolFromFile);

		// Mark preload task as resolved when all asset files are loaded
		$.when.apply($, task_preload_progress).done(function() {
			//Called when all assets are loaded
			info("Game asset load complete");
			task_preload.resolve();
		 });

		return task_preload.promise();
	};

	//
	// For SVG Symbols
	//
	function loadSVGSymbolFromFile(path) {
		// Define object to track progress
		var tracking = $.Deferred();

		// Push to monitoring stacks
		task_preload_progress.push(tracking);

		// Load file
		Snap.load(path, (function( progress ) {
			return function( fragment ) {
				fragment.selectAll("symbol")
				        .forEach(addSymbol);
				progress.resolve();
			};
		})(tracking));
	}

	// Cache a loaded symbol and make it available to be rendered
	function addSymbol(symbolSnapObj){
		//cache symbol size
		var symbolEl = symbolSnapObj.node;
		var viewbox = symbolEl.viewBox.baseVal;
		dimensions.set( symbolEl.id, { height: viewbox.height,
										width: viewbox.width } );

		//Attach symbol to canvas and put inside <defs>
		symbolSnapObj.appendTo(store).toDefs();
	}

	// (Public) Get cached symbol size by id
	AssetManager.getSymbolDimensions = function(id) {
		return dimensions.get(id); //Return {x:, y:} or undefined
	};

	// (Public) Check availability of a symbol by id
	AssetManager.hasSymbol = function(id) {
		return dimensions.has(id); //Return true if symbol is loaded
	};

	return AssetManager;
});