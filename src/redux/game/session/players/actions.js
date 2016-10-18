// Types
export const types = {
	"ADD": "game/session/players/ADD",
	"CLEAR": "game/session/players/CLEAR",
	"SET_POSITION": "game/session/players/SET_POSITION",
};

// Actions
export const actions = {
	add: playerId => ({
		type: types.ADD,
		id: playerId,
	}),

	clear: () => ({ type: types.CLEAR }),

	setPosition: (playerId, pos) => ({
		type: types.SET_POSITION,
		id: playerId,
		positon: pos,
	}),
};