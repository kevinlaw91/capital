import generateMap from "./map/map-generator";
import PlayerCollection from "./player/PlayerCollection";

/**
 * Current active game session
 * @type {Object}
 * @public
 */
export let active = null;

/** Create new game session */
export function create() {
	const players = new PlayerCollection();

	const player1 = players.add();
	player1.setPosition(map.findNextMove(null));

	active = {
		map: generateMap(),
		players: players,
	};
}

/** Destroy active game session */
export function destroy() {
	active = null;
}