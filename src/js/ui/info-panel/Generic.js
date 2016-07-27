define(function() {
	"use strict";

	return {
		node: $("<section/>", { id: "info-panel-default" }),
		templateID: "panel-info-generic",
		init: function(Tab) {
			$.subscribe("UI.InfoPanel.Generic.show", function() {
				// Hide all sub-panels
				Tab.showSubPanel(this);
			}.bind(this));
		}
	};
});