/**
 * Get next upgrade tier
 * @param {number} [currentTier=0]
 * @return {number|undefined} - Next tier (if upgradable) or undefined (if not possible)
 */
export default (currentTier = 0) => {
	// Maxed to tier 4
	const nextTier = Math.min(currentTier + 1, 4);

	if (nextTier !== currentTier) {
		// Next upgrade is available
		return nextTier;
	}
};
