define([
	"jquery",
	"jquery.pub-sub"
], function ($) {
	'use strict';

	/** @namespace Leaderboard */
	return {
		ranking: null,
		populate: function( playerList ) {
			// Clone player list
			this.ranking = playerList.slice(0);
			this.sort();
		},
		sort: function() {
			// Perform sorting
			var newRanking = this.ranking.slice(0);
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
				return player === this.ranking[index];
			}, this);

			if(!same) {
				this.ranking = newRanking;
				this.onRankingChanged();
			}
			this.onUpdated();
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
			this.ranking = [];
		}
	};
});