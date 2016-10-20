/**
 * Generate a sample from a standard normal (gaussian) distribution
 * Generator was implemented using Marsaglia polar method
 * @return {number}
 */
export default function gaussian(mean, stDev) {
	let u, v, s;

	do {
		u = (2.0 * Math.random()) - 1.0;
		v = (2.0 * Math.random()) - 1.0;
		s = (u * u) + (v * v);
	} while (s >= 1.0 || s === 0);

	s = Math.sqrt((-2.0 * Math.log(s)) / s);
	let y = u * s; // Interchangeable with v * s

	return mean + (stDev * y);
}