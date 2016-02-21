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
	var Config = require("engine/config");
	var Renderer = require("engine/renderer");
	var UI = require("engine/ui");
	var Camera = require("engine/camera");
	var AssetManager = require("engine/assets");

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
		// Construct SVG stage and attach to ui
		var svg = UI.getStage(Config.getAsId("draw.svg"));
		$(svg).appendTo($(Config.get("draw.container")));

		// Construct camera viewport for stage
		var viewport = UI.getViewport(Config.getAsId("camera.viewport"));
		Renderer.setCanvas(viewport);
		Camera.setup();

		// Async load game assets
		log("Loading game assets...");
		AssetManager.setStorage(svg);
		AssetManager.preload().done(onAssetLoaded);

		// Build render layers
		require("render/script/layers")();

		// init() can run only once
		delete Engine.init;
	};

	//
	// Event handling
	//
	
	function onAssetLoaded(){
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