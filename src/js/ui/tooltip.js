define([
	"jquery",
	"jquery.pub-sub",
	"engine/core"
], function($) {
	'use strict';

	var Tooltip = {
		show: function(){
			$("#game-tooltip").show();
		},
		hide: function() {
			$("#game-tooltip").hide();
		},
		redraw: function(data){
			Tooltip.setPosition(data.position.left, data.position.top);

			// Fetch live info from game session
			var info = require("engine/core").getSession().map[data.id];
			$("#game-tooltip-contents").text(info.name);
		},
		setPosition: function( left, top ) {
			$("#game-tooltip").css({
				"left": left,
				"top": top
			});
		},
		controller: function(evt, data){
			var actions = {
				"show": function(){
					Tooltip.redraw(data);
					Tooltip.show();
				},
				"hide": function() {
					Tooltip.hide();
				}
			};

			actions[evt.data.action]();
		}
	};

	// Register handler for Lot sprite onHoverEnter
	$.subscribe("UI.Tooltip.Show", { "action": "show" }, Tooltip.controller);
	$.subscribe("UI.Tooltip.Hide", { "action": "hide" }, Tooltip.controller);

	return Tooltip;
});