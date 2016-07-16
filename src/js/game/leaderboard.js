define([
	"jquery",
	"jquery.pub-sub"
], function($) {
	"use strict";

	/** Ranking */
	var ranking;

	/**
	 * Sorting function
	 * @param {Player} a
	 * @param {Player} b
	 * @returns {number}
	 */
	function sort_networth_descending(a, b) {
		return b.netWorth - a.netWorth;
	}

	/** Sort leaderboard */
	function sort() {
		// Perform sorting
		var newRanking = ranking.slice(0);

		newRanking.sort(sort_networth_descending);

		// Check if ranking changed
		var same = newRanking.every(function(player, index) {
			// Compare each rank
			// Check if players are still in the same order
			return player === ranking[index];
		});

		// Stats updated
		$.publish("Session.Leaderboard.onUpdate");

		if (!same) {
			// Ranking changed
			ranking = newRanking;
			$.publish("Session.Leaderboard.onRankingChanged");
		}
	}

	/**
	 * Subscribe update from all players
	 * @param {Array.<Player>} list
	 */
	function subscribeAll(list) {
		for (var i in list) {
			if (list.hasOwnProperty(i)) {
				list[i].$.on("Update.NetWorth", sort);
			}
		}
	}

	/**
	 * Unsubscribe update from all players
	 * @param {Array.<Player>} list
	 */
	function unsubscribeAll(list) {
		for (var i in list) {
			if (list.hasOwnProperty(i)) {
				list[i].$.off("Update.NetWorth", sort);
			}
		}
	}

	/**
	 * Rebuild leaderboard table
	 * @public
	 * @param {Array.<Player>} players
	 */
	function populate(players) {
		// Discard old cache
		if (ranking) {
			// Old ranking cache exists
			unsubscribeAll(ranking);
		}

		// Clone player list
		ranking = players.slice(0);

		// Subscribe update from each player
		subscribeAll(ranking);

		// Fire Reset event
		$.publish("Session.Leaderboard.onReset");
	}

	return {
		getRankings: function() { return ranking; },
		populate: populate,
		sort: sort
	};
});
