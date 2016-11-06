import types from "./types";

// Actions
export default {
	setActive: playerId => ({
		type: types.SET_ACTIVE,
		id: playerId,
	}),

	setColor: (playerId, color) => ({
		type: types.SET_COLOR,
		id: playerId,
		color: color,
	}),

	setPosition: (playerId, position) => ({
		type: types.SET_POSITION,
		id: playerId,
		position,
	}),
};