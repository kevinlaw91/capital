define(["jquery", "snapsvg"], function( $, Snap) {

	var module = {},
		store,
		task_preload = $.Deferred(),
	    task_preload_progress = [];

	// cache dimensions of loaded symbols
	var dimensions = new Map();

	// Define SVG element to store loaded symbols
	module.setSymbolStore = function(elem){
		store = Snap(elem);
		return module;
	};

	// Preload assets
	module.preload = function(){
		// Define a new file loading task
		var currentFile = $.Deferred();
		// Put the task to the ongoing list
		task_preload_progress.push(currentFile);
		// Perform async file load
		Snap.load("src/resources/svg/floor.svg", (function(task){
			return function(contents) {
				loadSymbolsFromFile(contents);
				task.resolve();
			};
		})(currentFile));

		// Token
		currentFile = $.Deferred();
		task_preload_progress.push(currentFile);
		Snap.load("src/resources/svg/token.svg", (function(task){
			return function(contents) {
				loadSymbolsFromFile(contents);
				task.resolve();
			};
		})(currentFile));

		//Icons
		currentFile = $.Deferred();
		task_preload_progress.push(currentFile);
		Snap.load("src/resources/svg/icons.svg", (function(task){
			return function(contents) {
				loadSymbolsFromFile(contents);
				task.resolve();
			};
		})(currentFile));

		//Houses
		currentFile = $.Deferred();
		task_preload_progress.push(currentFile);
		Snap.load("src/resources/svg/houses.svg", (function(task){
			return function(contents) {
				loadSymbolsFromFile(contents);
				task.resolve();
			};
		})(currentFile));

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

	// Extract symbols from a loaded svg file
	function loadSymbolsFromFile(fragment){
		fragment.selectAll("symbol").forEach(addSymbol);
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
	module.getSymbolDimensions = function(id) {
		return dimensions.get(id); //Return {x:, y:} or undefined
	};

	// (Public) Check availability of a symbol by id
	module.hasSymbol = function(id) {
		return dimensions.has(id); //Return true if symbol is loaded
	};

	return module;
});