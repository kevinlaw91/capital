define([
	"jquery",
	"opentype",
	"snapsvg"
], function($, OpenType, Snap) {
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
				delete this.setSymbolStore;
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
				return new Promise(function(resolve, reject) {
					// Load file
					Snap.load(path, function(fragment) {
						try {
							fragment.selectAll("symbol")
							        .forEach(AssetManager.SymbolStore.onFileLoaded);
							resolve();
						} catch(e) {
							reject(new Error("(SymbolStore) Failed to process [" + path + "]"));
						}
					});
				});
			},

			/**
			 * Extract symbols from a loaded file
			 * @callback
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
				return new Promise(function(resolve, reject) {
					// Load file
					OpenType.load(path, function(errorMsg, font) {
						if (!errorMsg) {
							try {
								// Font loaded successfully
								AssetManager.FontStore.onFileLoaded(font);
								resolve();
							} catch(e) {
								reject(new Error("(FontStore) Failed to process [" + path + "]"));
							}
						} else {
							reject(new Error("(FontStore) Failed to load [" + path + "]"));
						}
					});
				});
			},

			/**
			 * Handle loaded fonts
			 * @callback
			 */
			onFileLoaded: function(font){
				// Obtaining metadata
				var fontFamily = font.names.fontFamily.en,
					fontSubfamily = font.names.fontSubfamily.en;

				// Register at font collection
				if (fonts.has(fontFamily)){
					fonts.get(fontFamily).set(fontSubfamily, font);
				} else {
					fonts.set(fontFamily, new Map().set(fontSubfamily, font));
				}
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

				while(children[0]) {
					fragment.appendChild(children[0]);
				}

				el.content = fragment;
			}

			var templateID = el.getAttribute("data-templateid");
			if(typeof templateID === "string" && templateID.length){
				store.set(el.getAttribute("data-templateid"), el.content);
			} else {
				throw new Error("Template ID not found");
			}
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
				return new Promise(function(resolve, reject) {
					$.get(path, "html").done(function(contents) {
						try {
							$(contents).filter("template")
							           .each(cacheTemplate);
							resolve();
						} catch(e) {
							reject(new Error("(FragmentStore) Failed to process [" + path + "]"));
						}
					}).fail(function(e) {
						reject(new Error("(FragmentStore) " + e.status.toString() + " " + e.statusText + " [" + path + "]"));
					});
				});
			}
		};
	})();

	return AssetManager;
});