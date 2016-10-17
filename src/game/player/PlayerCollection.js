import GamePlayer from "./GamePlayer";

function PlayerCollection() {
	this.items = new Map();
}

PlayerCollection.prototype.add = function () {
	const newPlayer = new GamePlayer();
	this.items.set(newPlayer.id, newPlayer);

	return newPlayer;
};

export default PlayerCollection;