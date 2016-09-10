/**
 * Returns a number whose value is clamped to the given range.
 * @param {number} value - Number to be clamped
 * @param {number} min - The lower boundary of the output range
 * @param {number} max - The upper boundary of the output range
 * @returns {number} A number in the range [min, max]
 */
export default function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}