define(function() {
	'use strict';

	/** Collection of randomize functions */
	return {
		/** @returns {number} An integer between 1 to 6 */
		DiceRoll: function(){
			return 1 + Math.floor(Math.random() * 6);
		},

		/** @returns {number} An integer between 0 to 1 */
		CoinFlip: function(){
			return Math.floor(Math.random() * 2);
		},

		/** @returns {number} An integer between 1 to n */
		Roll: function(n){
			return 1 + Math.floor(Math.random() * n);
		},

		/**
		 * Shuffle an array (change array itself)
		 * {@link https://bost.ocks.org/mike/shuffle/}
		 * @returns {Array} arr - Shuffled array
		 */
		Shuffle: function(arr) {
			var m = arr.length, t, i;
			while (m) {
				i = Math.random() * m-- | 0;
				t = arr[m];
				arr[m] = arr[i];
				arr[i] = t;
			}
			return arr;
		}
	};
});