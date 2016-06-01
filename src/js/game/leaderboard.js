define([
	"jquery",
	"jquery.pub-sub"
], function ($) {
	'use strict';

	/** @exports game/leaderboard */
	var Leaderboard = {
		ranking: null,
		populate: function( playerList ) {
			// Clone player list
			Leaderboard.ranking = playerList.slice(0);
			Leaderboard.sort();
		},
		sort: function() {
			// Perform sorting
			var newRanking = Leaderboard.ranking.slice(0);
			newRanking.sort(
				function( a, b ) {
					/**
					 * @param {Player} a
					 * @param {Player} b
					 */
					return b.netWorth - a.netWorth;
				}
			);

			// Check if ranking changed
			var same = newRanking.every(function( player, index ) {
				// Compare each rank to check if still are the same players
				return player === Leaderboard.ranking[index];
			}, Leaderboard);

			if(!same) {
				Leaderboard.ranking = newRanking;
				Leaderboard.onRankingChanged();
			}
			Leaderboard.onUpdated();
		},
		/**
		 * Called when leaderboard was updated
		 * @function
		 */
		onUpdated: $.noop,
		/**
		 * Called when ranking had changed
		 * @function
		 */
		onRankingChanged: $.noop,
		reset: function() {
			// Clear rankings
			Leaderboard.ranking = [];
		}
	};

	$.subscribe("Leaderboard.sort", Leaderboard.sort);

	return Leaderboard;
});
