define([
	"jquery",
	"engine/game"
],function($) {
	'use strict';

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
		},

		loading: {
			ASSET_LOADED: $.Deferred(),
			STAGE_READY: $.Deferred()
		}
	};

	/**
	 * Entry point for app logic
	 * This function will run after configs are loaded and dom is ready
	 */
	Engine.init = function() {
		// Initializing app
		log("[EVENT] Initializing engine...", "event");

		require(["engine/ui"], function(UI) {
			UI.init();
		});

		require([
			"ui/stage",
			"engine/assets",
			"engine/script/stage-setup"
		], function(Stage, AssetManager) {
			// Fired when stage SVG node was created
			Stage.nodeReady.done(
				function() {
					// Set up stage
					require("engine/script/stage-setup")(Engine.loading.STAGE_READY);

					// Async load game assets
					log("Loading game assets...");
					AssetManager.SymbolStore.setSymbolStore(Stage.container.node);
					AssetManager.load().done(function(){
						// Notify assets ready
						Engine.loading.ASSET_LOADED.resolve();
					});

					log("[EVENT] Engine is running", "event");
				}
			);
		});

		$.when(
			Engine.loading.ASSET_LOADED,
			Engine.loading.STAGE_READY
		).done(function(){
			// Called when game engine is loaded
			console.timeEnd("Game Loaded");

			// Create new game session
			Engine.getGame().newSession();
		});

		// Load developer module
		require(["engine/dev"], function(Dev) {
			Dev.init(Engine);
		});

		// init() can run only once
		delete Engine.init;
	};

	return Engine;
});