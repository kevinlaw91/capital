define(["engine/assets"], function(AssetManager) {
	'use strict';

	/** Script to automate game asset loading */
	return function(){
		// Collect file load promises
		var assets = [];

		// Load SVG symbols from file
		[
			"src/resources/svg/floor.svg",
			"src/resources/svg/token.svg",
			"src/resources/svg/icons.svg",
			"src/resources/svg/houses.svg"
		].forEach(function(url) {
			assets.push(AssetManager.SymbolStore.loadFromFile(url));
		});

		// Load Fonts
		[
			"src/resources/fonts/passion-one-regular.woff",
			"src/resources/fonts/pathway-gothic-one-regular.woff"
		].forEach(function(url) {
			assets.push(AssetManager.FontStore.loadFromFile(url));
		});

		// Load UI Fragments
		[
			"src/resources/templates/dialogs.html",
			"src/resources/templates/user-action-prompt.html"
		].forEach(function(url) {
			assets.push(AssetManager.FragmentStore.loadFromFile(url));
		});

		// Track completion of task
		return Promise.all(assets);
	};
});