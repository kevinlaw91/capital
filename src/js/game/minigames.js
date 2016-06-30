define([
	"game/treasurehunt"
], function() {
	'use strict';

	// Imports
	var gTreasureHunt = require("game/treasurehunt");

	return {
		PlayTreasureHunt: function() {
			return new Promise(function(r) {
				gTreasureHunt.onResult(r).showDialog();
			});
		}
	};
});