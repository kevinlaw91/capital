define([
	"jquery",
	"opentype",
	"snapsvg"
], function( $, OpenType, Snap) {
	"use strict";

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

	/** @namespace */
	AssetManager.FontStore = (function(){
		/**
		 * Cache loaded fonts
		 * @private
		 */
		var fonts = new Map();

		return {
			/**
			 * Loads a font file
			 * @param path
			 */
			loadFromFile: function(path){
				// Define object to track progress
				var tracking = $.Deferred();

				// Push to monitoring stacks
				loading_tasks.push(tracking);

				// Load file
				OpenType.load( path,
					(function ( progress ) {
						return function(errorMsg, font) {
							if (!errorMsg) {
								// Font loaded successfully

								// Obtaining font metadata
								var fontFamily = font.names.fontFamily.en,
								    fontSubfamily = font.names.fontSubfamily.en;

								// Register to font collection
								if (fonts.has(fontFamily)){
									fonts.get(fontFamily).set(fontSubfamily, font);
								} else {
									fonts.set(fontFamily, new Map().set(fontSubfamily, font));
								}

								// Mark task as completed
								progress.resolve();
							} else {
								err(errorMsg);
							}
						};
					})(tracking)
				);
			},

			/**
			 * Get a Font object from collection
			 * @returns {Font}
			 */
			getFont: function (family, subFamily) {
				return fonts.get(family).get(subFamily);
			}
		};
	})();
	
	/** @namespace */
	AssetManager.FragmentStore = (function(){
		/**
		 * Place to store loaded fragments
		 * @private
		 */
		var store = new Map();

		/**
		 * Check support for template element
		 * @type {boolean}
		 */
		var supported = ("content" in document.createElement("template"));

		/** @param el - A template element returned from ajax */
		function cacheTemplate(index, el) {
			// For browser that doesn't support <template>
			if(!supported){
				var fragment = document.createDocumentFragment(),
					children = el.children;

				for(var i=0, l=children.length; i<l; i++) {
					fragment.appendChild(children[i]);
				}

				el.content = fragment;
			}

			store.set(el.getAttribute("data-templateid"), el.content);
		}

		return {
			/**
			 * Retrieve a DOM template
			 * @param {string} id
			 * @returns {DocumentFragment|undefined}
			 */
			get: function(id) {
				return store.get(id);
			},
			/**
			 * Load a file that contains DOM fragment
			 * @param path - Path of the file to be loaded
			 */
			loadFromFile: function(path) {
				// Promise to track progress
				var tracking = $.Deferred();

				// Push to monitoring stacks
				loading_tasks.push(tracking);

				$.get(path, "html").done(
					function(contents) {
						$(contents).filter("template").each(cacheTemplate);
						tracking.resolve();
					}
				);
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

		// Load Fonts
		[
			"src/resources/fonts/passion-one-regular.woff",
			"src/resources/fonts/pathway-gothic-one-regular.woff"
		].forEach(AssetManager.FontStore.loadFromFile);

		// Load UI Fragments
		[
			"src/resources/templates/dialogs.html"
		].forEach(AssetManager.FragmentStore.loadFromFile);

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