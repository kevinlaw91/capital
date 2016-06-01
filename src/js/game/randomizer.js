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
		}
	};
});