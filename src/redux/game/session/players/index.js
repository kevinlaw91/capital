import Immutable from "seamless-immutable";
import shortid from "shortid";

import pathfinder from "./pathfinder";

// Types
export const types = {
	"ADD": "game/session/players/ADD",
	"CLEAR": "game/session/players/CLEAR",
	"MOVE": "game/session/players/MOVE",
	"SET_POSITION": "game/session/players/SET_POSITION",
};

// Actions
export const actions = {
	add: () => ({ type: types.ADD }),
	clear: () => ({ type: types.CLEAR }),

	/**
	 * Move player one step forward or to a specific location
	 * @param {string} playerId
	 * @param {string} [destination] - (Optional) If specified, move to the specified destination
	 */
	move: (playerId, destination) => ({
		type: types.MOVE,
		id: playerId,
		destination,
	}),

	setPosition: (playerId, pos) => ({
		type: types.SET_POSITION,
		id: playerId,
		positon: pos,
	}),
};

// Initial state
const initialState = Immutable({});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			// Generate a player id
			let id;

			// Make sure id is unique
			do {
				id = shortid.generate();
			} while (id in state);

			return state.merge({ [id]: {
				// Start position
				position: "CORNER-BOTTOM",
			} }, { deep: true });

		case types.MOVE:
			let nextPos = null;

			if (action.destination) {
				nextPos = action.destination;
			} else {
				// Use pathfinder to find location of next step
				nextPos = pathfinder(state[action.id].position);
			}

			return state.merge(
				{ [action.id]: {
					position: nextPos
				} }, { deep: true });

		case types.SET_POSITION:
			return state.merge(
				{ [action.id]: {
					position: action.position
				} }, { deep: true });

		case types.CLEAR:
			return initialState;

		default: return state;
	}
}