define([
	"engine/game",
	"engine/ui",
	"engine/assets",
	"engine/camera",
	"engine/renderer",
	"ui/stage",
	"ui/dialogs",
	"engine/script/make-layers",
	"engine/script/asset-load"
], function() {
	"use strict";

	// Imports
	var AssetManager = require("engine/assets"),
		Camera = require("engine/camera"),
		DialogManager = require("ui/dialogs"),
		Renderer = require("engine/renderer"),
		Stage = require("ui/stage"),
		UI = require("engine/ui");

	/** @namespace Engine */
	var Engine = {
		/**
		 * Game definition
		 * @type {Game}
		 * @see module:engine/game
		 */
		game: require("engine/game"),

		/** @returns {Game} Game definition object */
		getGame: function() {
			return Engine.game;
		},

		/** @returns {GameSession} Current game session */
		getSession: function() {
			return Engine.game.getSession();
		},
		/**
		 * Called when all modules are loaded successfully
		 * @callback
		 */
		onload: function() {
			// Called when game engine is loaded
			console.timeEnd("Game Loaded");

			// Create new game session
			Engine.getGame()
			      .newSession();
		}
	};

	/**
	 * Entry point for app logic
	 * This function will run after configs are loaded and dom is ready
	 * @callback
	 */
	Engine.init = function() {
		// Initializing app
		log("[EVENT] Initializing engine...", "event");

		// Init UI
		UI.init();

		// Fired when stage SVG node was created
		Stage.nodeReady.done(function() {
			// Define SVG symbol defs container svg
			AssetManager.SymbolStore.setSymbolStore(Stage.container.node);

			// Set up stage
			Camera.setup();
			Renderer.setCanvas(Stage.canvas);
			require("engine/script/make-layers")();

			// Load game assets
			log("Loading game assets...");
			var STATUS_ASSETLOADED = new Promise(function(resolve) {
				resolve(require("engine/script/asset-load")());
			});

			var STATUS_PREPAREUI = new Promise(function(resolve, reject) {
				STATUS_ASSETLOADED
					.then(function() {
						log("Unpacking assets...");
					})
					.then(function() {
						// Prepare UI
						UI.UserActionPanel.init();
						UI.InfoPanel.init();
					})
					.then(function() {
						// Prepare Dialog
						try {
							var getUIFragment = AssetManager.FragmentStore.get;

							DialogManager.register("treasurehunt", getUIFragment("dialog-minigame-treasurehunt"));

							return Promise.resolve();
						} catch (e) {
							return Promise.reject(new Error("(DialogManager) Failed when registering dialog boxes."));
						}
					})
					.then(resolve, reject);
			});

			// Run in parallel
			Promise.all([
				STATUS_ASSETLOADED,
				STATUS_PREPAREUI
			]).then(Engine.onload);
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