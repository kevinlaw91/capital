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
	var ListView = $("<ul/>", { "class": "leaderboard-list" });

	//
	// Model and View bindings
	//
	function bindView(model, view) {
		model.$.data("LeaderboardRow", view);
	}

	function unbindView(model) {
		model.$.removeData("LeaderboardRow");
	}

	/** Discard old cache/data */
	function reset() {
		var ranking = Leaderboard.getRankings();

		if (ranking) {
			// Old model binding exists
			// Unlink player model with view
			ranking.forEach(unbindView);

			// Delete rows from view
			ListView.empty();
		}
	}

	function populate() {
		// Rebuild leaderboard
		var ranking = Leaderboard.getRankings();

		for (var i = 0; i < ranking.length; i++) {
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

			// Bind view to model
			bindView(ranking[i], newRow);
		}
	}

	/** Reorder rows when RankingChanged event was received */
	function reorder() {
		// Loop every rank
		Leaderboard.getRankings().forEach(
			function(player, index) {
				// Get paired row
				let row = player.$.data("LeaderboardRow");

				// Set position
				row.css("top", index * 65);
			}
		);
	}

	/** Update data when Update event was received */
	function update() {
		// Loop every rank
		Leaderboard.getRankings().forEach(
			function(player) {
				// Get paired row
				let row = player.$.data("LeaderboardRow");

				// Update info
				row.find(".player-color").css("backgroundColor", player.color.LIGHT);
				row.find(".player-name").text(player.name);
				row.find(".player-net-worth").text(formatAsCurrency(player.netWorth));
			}
		);
	}

	/** Force refresh data and rankings */
	function forceRefresh() {
		update();
		reorder();
	}

	return {
		init: function(Tab) {
			// Render
			$("<section/>")
				.append(ListView)
				.appendTo(Tab.container);

			// Register handlers
			$.subscribe("Session.Leaderboard.onReset", reset);
			$.subscribe("Session.Leaderboard.Populate", populate);
			$.subscribe("Session.Leaderboard.onUpdate", update);
			$.subscribe("Session.Leaderboard.onRankingChanged", reorder);
			$.subscribe("UI.InfoPanel.Leaderboard.forceRefresh", forceRefresh);
			$.subscribe("UI.InfoPanel.Leaderboard.show", Tab.select);
		}
	};
});