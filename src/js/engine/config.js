define([
	"jquery",
	"utils"
], function($) {
	'use strict';

	var configs = {},   // cache for configs during runtime
		loading = [],   // track parsing status of each config file
	    module = {},    // module object
		task = $.Deferred(); // Define a new async task for loading configs

	module.load = function() {
		//
		// files to be loaded
		//
		var files = [
			"engine",
			"ui",
			"camera",
		    "game"
		];

		log("Loading configuration files...");

		for(var i=0, l = files.length; i<l; i++) {
				loading.push(
					$.ajax("src/cfg/" + files[i] + ".cfg.json", { dataType: 'text' })
					 .done(load_success)
					 .fail(load_error)
				);
		}

		// Mark task as resolved when all config files are loaded
		$.when.apply($, loading)
		 .done(function() {
			 task.resolve();
		 });

		// run once then self destruct
		delete module.load;

		return task.promise();
	};


	//
	// Loading task callbacks
	//

	// Error loading config file
	function load_error(){ //jshint validthis:true
		err("Failed to load configuration file: [" +
		    this.url.match(/[^\/]*\.cfg(?=\.json$)/) +
		    "]");
		task.reject();
		throw new Error("Unable to load configuration file: " +
		                this.url.match(/[^\/]*\.cfg(?=\.json$)/));
	}

	// Success loading config file
	function load_success(text){ //jshint validthis:true
		var json, filename = this.url.match(/[^\/]*\.cfg(?=\.json$)/);

		try {
			// Import JSON.minify from utils
			json = JSON.parse(require("utils").minifyJSON(text));
		} catch(e){
			err("Could not parse " + filename + "\n-> " + e.name + ": " + e.message);
			task.reject();
			return;
		}

		// cache config to memory
		for(var entry in json) {
			configs[entry] = json[entry];
		}

		info("Configuration file loaded: [" + filename + "]");
	}

	//
	// Public API
	//

	/**
	 * Get config value using dotted string notation
	 * @param {string} path - Dotted string notation of config key
	 * @example
	 * get("path.to.config.key") //returns "value"
	 * @returns {*} Value of the config key
	 */
	module.get = function(path){
		// Get config using dotted string notation
		// http://stackoverflow.com/questions/8817394/javascript-get-deep-value-from-object-by-passing-path-to-it-as-string/8817531#8817531
		var tree = arguments[1] || configs;
		var parts = path.split(".");
		if (parts.length==1){
			return tree[parts[0]];
		}
		return module.get(parts.slice(1).join("."), tree[parts[0]]);
	};

	/**
	 * Get id part of a config value
	 * @param {string} path - Dotted string notation of config key
	 * @example
	 * get("path.to.id"); //returns "#identifier"
	 * getAsId("path.to.id"); //returns "identifier"
	 */
	module.getAsId = function(path){
		return module.get(path).match(/#(.+$)/)[1];
	};

	return module;
});