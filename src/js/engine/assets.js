define(["jquery", "snapsvg"], function( $, Snap) {

	/** @namespace */
	var AssetManager = {};

	/** @namespace */
	AssetManager.SymbolStore = (function(){
		/**
		 * Place to store loaded symbols
		 * @private
		 */
		var store;

	    /**
	     * Cache info of loaded symbols
	     * @private
	     */
		var list = new Map();

		return {
			/**
			 * Set location to store loaded symbols
			 * @public
			 * @param {Snap} elem - Snap element
			 */
			setSymbolStore: function(elem){
				store = Snap(elem);
			},

			/**
			 * Check availability of a symbol by id
			 * @public
			 * @returns {boolean} Symbol is loaded into game, true/false
			 */
			hasSymbol: function(id) {
				return list.has(id);
			},

			/**
			 * Get cached symbol size by id
			 * @public
			 * @returns {{number,number}|undefined} Dimensions if symbol is loaded, 'undefined' otherwise
			 */
			getSymbolDimensions: function(id) {
				return list.get(id);
			},

			/**
			 * Loads a file
			 * @public
			 * @param path - Path of the file to be loaded
			 */
			loadFromFile: function(path){
				// Define object to track progress
				var tracking = $.Deferred();

				// Push to monitoring stacks
				loading_tasks.push(tracking);

				// Load file
				Snap.load( path,
					(function( progress ) {
						return function( fragment ) {
							fragment.selectAll("symbol")
							        .forEach(AssetManager.SymbolStore.onFileLoaded);
							progress.resolve();
						};
					})(tracking)
				);
			},

			/**
			 * Extract symbols from a loaded file
			 * @callback
			 * @public
			 * @param snapSymbol - Snap instance of a loaded symbol
			 */
			onFileLoaded: function(snapSymbol){
				// Cache loaded symbol size
				var symbolEl = snapSymbol.node,
				    viewbox = symbolEl.viewBox.baseVal;
				list.set( symbolEl.id,
					{
						height: Number(viewbox.height),
						width: Number(viewbox.width)
					}
				);

				//Attach symbol to canvas and put inside <defs>
				snapSymbol.appendTo(store).toDefs();
			}
		};
	})();


	/** Stores file load promise objects */
	var loading_tasks = [];

	/** Pre-load assets */
	AssetManager.load = function(){
		// Track completion of task
		var task = $.Deferred();

		// Load SVG symbols from file
		[
			"src/resources/svg/floor.svg",
			"src/resources/svg/token.svg",
			"src/resources/svg/icons.svg",
			"src/resources/svg/houses.svg"
		].forEach(AssetManager.SymbolStore.loadFromFile);

		// Mark task as resolved when all asset files are loaded
		$.when.apply($, loading_tasks).done(function() {
			//Called when all assets are loaded
			info("Game asset load complete");
			task.resolve();
		 });

		return task.promise();
	};

	return AssetManager;
});