define(function() {
	'use strict';

	var devMode = true;

	/**
	 * Reference to game engine
	 * @type {Engine}
	 */
	var G = null,
	    /**
	     * Returns current game session
	     * @private
	     * @returns {GameSession}
	     */
	    S = function() { return G.getSession(); },
	    /**
	     * Get player by index
	     * @private
	     * @returns {Player}
	     */
	    playerById = function(id) { return S().players[id]; },
	    /** @lends module:engine/dev */
	    dev = {
		    /** @type {Engine} */
		    g: null,
		    init: function( gameEngine ) {
			    G = this.g = gameEngine;

			    // Export to global if dev tool enabled
			    if(devMode) {
				    window.g   = dev.g;
				    window.dev = dev;
			    }

			    delete this.init;
		    },
		    enableLogging: function() {
			    var style = {
				    "default": "color: silver",
				    "event": "color: gold",
				    "complete": "color: #00cc65; font-weight: bold",
				    "success": "color: #00cc65; font-weight: bold",
				    "gameevent": "color: #F490B1"
			    };

			    window.info    = window.console.info.bind(window.console);
			    window.warn    = window.console.warn.bind(window.console);
			    window.err     = window.console.error.bind(window.console);
			    window.time    = window.console.time.bind(window.console);
			    window.timeEnd = window.console.timeEnd.bind(window.console);
			    window.log     = function() {
				    var args = [];

				    if(arguments[0] && arguments[0].length>0) {
					    args.push("%c" + arguments[0]);
					    if(arguments[1]) {
						    args.push(style[arguments[1]] || arguments[1]);
					    }else{
						    //use default style if not specified
						    args.push(style["default"]);
					    }
				    }
				    window.console.log.apply(window.console, args);
			    };
		    },
		    disableLogging: function() {
			    window.time = window.timeEnd = window.info = window.warn = window.err = window.log = function() {};
		    },
		    useShortLogging: function() {
			    if(devMode) {
				    this.enableLogging();
				    info("Developer debug tool enabled");
			    } else {
				    this.disableLogging();
			    }
		    }
	    };

	/** Instantly move player to starting position, completing a cycle */
	dev.movePlayerToStartPosition = function(player) {
		var lot = S().map[0];
		playerById(player).moveTo(lot.x, lot.y);
	};

	/** Step player forwards */
	dev.movePlayerBySteps = function(player, steps) {
		if(!steps){ steps = 1; }
		playerById(player).hideActiveMarker();
		playerById(player).moveBySteps(steps);
	};

	/** Sell specified lot to a player */
	dev.setLotOwner = function(lot, player) {
		S().map[lot].sellTo(playerById(player));
	};

	/** Upgrade specified lot */
	dev.upgradeLot = function(lot) {
		var l = S().map[lot];
		if(l.upgradeAvailable()){
			l.upgrade();
		}
	};

	/** Define conditions for debugging */
	dev.runPreset = function(){
		//Write debug script here
	};

	return dev;
});