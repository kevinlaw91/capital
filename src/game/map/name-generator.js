import names from "./name";

export default function* RandomNameGenerator() {
	// Name pool
	let pool = names.slice(0);

	while (pool.length > 0) {
		// Randomly pick an index in the pool
		let i = Math.floor(Math.random() * pool.length);
		// Output name
		yield pool.splice(i, 1)[0];
	}
}