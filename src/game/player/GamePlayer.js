import shortid from "shortid";

export default class GamePlayer {
	constructor() {
		this.id = shortid.generate();
	}

	setPosition(pos) {
		this.position = pos;
	}
}