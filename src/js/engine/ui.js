define([
	"ui/stage",
	"ui/dice-button",
	"ui/info-panel",
	"ui/user-action-panel",
	"ui/tooltip"
], function() {
	'use strict';

	var UI = {
		init: function() {
			UI.Stage = require("ui/stage");
			UI.Stage.init();

			UI.DiceButton = require("ui/dice-button");
			UI.DiceButton.init();

			UI.InfoPanel = require("ui/info-panel");
			UI.InfoPanel.init();

			UI.UserActionPanel = require("ui/user-action-panel");
			UI.UserActionPanel.init();

			require("ui/tooltip");

			delete UI.init;
		}
	};

	return UI;
});