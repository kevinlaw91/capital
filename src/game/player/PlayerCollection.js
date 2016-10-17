import shortid from "shortid";
import GamePlayer from "./GamePlayer";

function PlayerCollection() {
	this.items = new Map();
}

PlayerCollection.prototype.generateUniqueId = function () {
	let id;

	do {
		id = shortid.generate();
	} while (this.items.has(id));

	return id;
};

PlayerCollection.prototype.add = function () {
	const id = this.generateUniqueId();
	const newPlayer = new GamePlayer(id);
	this.items.set(id, newPlayer);

	return newPlayer;
};

export default PlayerCollection;