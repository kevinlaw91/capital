/**
 * Round number to increment of 100
 * "~~" to strip decimals
 * @param n
 * @return {number}
 */
export default n => ~~(n / 100) * 100;