define([
	"jquery",
	"jquery.pub-sub",
	"game/leaderboard",
	"utils"
], function($) {
	"use strict";

	// Import
	var Leaderboard = require("game/leaderboard");
	var formatAsCurrency = require("utils").formatAsCurrency;

	// Main UI
	var ListView = $("<ol/>", { "class": "leaderboard-list" });

	// Rows in leaderboard UI
	var rows = [];

	function resize() {
		// Clean existing UI
		ListView.empty();

		// Start from clean node
		rows = [];

		// Rebuild leaderboard
		while (rows.length < Leaderboard.getRankings().length) {
			// Generate DOM for new row
			let newRow = $("<li/>").append(
				$("<div/>", { "class": "player-color" }).css("backgroundColor", "white"),
				$("<div/>", { "class": "player-details" }).append(
					$("<div/>", { "class": "player-name" }).text("PLAYER_NAME"),
					$("<div/>", { "class": "player-net-worth" }).text("PLAYER_CASH")
				)
			);

			// Add new row to view
			newRow.appendTo(ListView);

			// Store reference
			rows.push(newRow);
		}
	}

	function refresh() {
		// Fill data for all ranks
		Leaderboard.getRankings().forEach(
			function(player, index) {
				// Loop every rank
				// and locate corresponding rows
				var row = rows[index];

				// Update info
				row.find(".player-color").css("backgroundColor", player.color.LIGHT);
				row.find(".player-name").text(player.name);
				row.find(".player-net-worth").text(formatAsCurrency(player.netWorth));
			}
		);
	}

	return {
		init: function(Tab) {
			// Render
			$("<section/>")
				.append(ListView)
				.appendTo(Tab.container);

			// Register handlers
			$.subscribe("Session.Leaderboard.onReset", resize);
			$.subscribe("Session.Leaderboard.onUpdate", refresh);
			$.subscribe("UI.InfoPanel.Leaderboard.Show", Tab.select);
		}
	};
});