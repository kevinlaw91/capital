// Name list of places
const names = [
	"Al Zaco Creek",
	"Azral Canyon",
	"Boulevard Road",
	"Cape Loop",
	"Cape Rolnard",
	"Carole Bay",
	"Cattown Road",
	"Central Road",
	"Chamont Town",
	"Champs Pass",
	"Cobbs Creek",
	"Coin Road",
	"Dorkov Bay",
	"Downtown Troyes",
	"East Lake",
	"Esteryn Street",
	"Fox Valley",
	"Harbour Road",
	"Juniper Bay",
	"Miracle Hills",
	"Mont Alice",
	"Moon Hill",
	"Mormont Valley",
	"Newton Road",
	"Northwood Valley",
	"Ostgate Street",
	"Ox River",
	"Reed Lake",
	"Ruby Valley",
	"Saint Viborg",
	"Sun Castle",
	"Tales Lake",
	"Vintage Creek",
	"Weldon Park",
	"Westway Town",
	"Winter Lagoon",
];

export default function* generator() {
	// Name pool
	let pool = names.slice(0);

	while (pool.length > 0) {
		// Randomly pick an index in the pool
		let i = Math.floor(Math.random() * pool.length);
		// Output name
		yield pool.splice(i, 1)[0];
	}
}