define([
	"ui/stage",
	"ui/dice-button",
	"ui/info-panel",
	"ui/user-action-panel",
	"ui/tooltip"
], function() {
	'use strict';

	var UI = {
		UserActionPanel: require("ui/user-action-panel"),
		init: function() {
			UI.Stage = require("ui/stage");
			UI.Stage.init();

			require("ui/dice-button");

			UI.InfoPanel = require("ui/info-panel");
			UI.InfoPanel.init();

			require("ui/tooltip");

			delete UI.init;
		}
	};

	return UI;
});