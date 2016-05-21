define([
	"engine/ui",
	"engine/camera",
	"engine/renderer",
	"engine/assets",
	"engine/game",
	"engine/dev",
	"script/make-layers"
],function() {
	'use strict';

	// Load modules
	var Renderer = require("engine/renderer"),
	    UI = require("engine/ui"),
	    Camera = require("engine/camera"),
	    AssetManager = require("engine/assets");

	/** @namespace Engine */
	var Engine = {
		/**
		 * Game definition
		 * @type {Game}
		 * @see module:engine/game
		 */
		game: require("engine/game"),

		/** @returns {Game} Game definition object */
		getGame: function(){
			return Engine.game;
		},

		/** @returns {GameSession} Current game session */
		getSession: function(){
			return Engine.game.getSession();
		}
	};

	/**
	 * Entry point for app logic
	 * This function will run after configs are loaded and dom is ready
	 */
	Engine.init = function() {
		// Developer debug tool
		require("engine/dev").init(this);

		// Initialize UI
		log("Initializing UI...");
		UI.init();

		// Construct camera viewport for stage
		Camera.setup();

		// Point stage reference to renderer
		Renderer.setCanvas(UI.Stage.canvas);

		// Async load game assets
		log("Loading game assets...");
		AssetManager.SymbolStore.setSymbolStore(UI.Stage.container.node);
		AssetManager.load().done(onAssetLoaded);

		// Build render layers
		require("script/make-layers")();

		// init() can run only once
		delete Engine.init;
	};

	//
	// Event handling
	//

	// Called when asset loading task is completed
	function onAssetLoaded(){
		// Create new game session
		Engine.getGame().newSession();
	}

	return Engine;
});