define([
	"jquery",
	"jquery.pub-sub",
	"engine/config",
	"engine/ui",
	"engine/camera",
	"engine/renderer",
	"engine/assets",
    "engine/game",
    "engine/dev",
	"render/script/layers"
],function($) {

	// Load modules
	var Config = require("engine/config"),
	    Renderer = require("engine/renderer"),
	    UI = require("engine/ui"),
	    Camera = require("engine/camera"),
	    AssetManager = require("engine/assets");

	/**
	 * @namespace Engine
	 */
	var Engine = {
		/**
		 * Game definition
		 * @type {Game}
		 */
		game: require("engine/game"),

		/** @returns {Game} Game definition object */
		getGame: function(){
			return this.game;
		},

		/** @returns {GameSession} Current game session */
		getSession: function(){
			return this.game.getSession();
		},

		/**
		 * Expose config module to public
		 * @require module:engine/config
		 */
		config: Config,

		/**
		 * Expose renderer module to public
		 * @require module:engine/renderer
		 */
		renderer: Renderer
	};

	/**
	 * Entry point for app logic
	 * This function will run after configs are loaded and dom is ready
	 */
	Engine.init = function() {
		// Developer debug tool
		require("engine/dev").init(this);

		log("Preparing stage...");
		// Construct SVG stage
		UI.Stage.init();

		// Construct camera viewport for stage
		Camera.setup();

		// Point stage reference to renderer
		Renderer.setCanvas(UI.Stage.canvas);

		// Async load game assets
		log("Loading game assets...");
		AssetManager.SymbolStore.setSymbolStore(UI.Stage.container.node);
		AssetManager.load().done(onAssetLoaded);

		// Build render layers
		require("render/script/layers")();

		// init() can run only once
		delete Engine.init;
	};

	//
	// Event handling
	//
	
	function onAssetLoaded(){
		// Build UI
		UI.init();

		//create new game session
		Engine.getGame().newSession();
	}

	// Window resize
	function onWindowResize(){
		log("[EVENT] Window re-sized", "event");
		Camera.resize();
	}

	$(window).on("resize", onWindowResize);

	return Engine;
});