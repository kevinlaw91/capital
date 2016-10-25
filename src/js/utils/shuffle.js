/**
 * Return a shallow copy of shuffled array
 * @link https://bost.ocks.org/mike/shuffle/
 * @returns {Array} A new array with shuffled values
 */
export default arr => {
	let clone = arr.slice(0);
	let m = clone.length, t, i;
	while (m) {
		i = Math.random() * m-- | 0;
		t = clone[m];
		clone[m] = clone[i];
		clone[i] = t;
	}

	return clone;
};