// Types
export const types = {
	"ADD": "game/stage/token/ADD",
	"CLEAR": "game/stage/token/CLEAR",
	"SET_IDLE": "game/stage/token/SET_IDLE",
	"SET_ONMOVE": "game/stage/token/SET_ONMOVE",
	"SET_ORDER": "game/stage/token/SET_ORDER",
};

// Actions
export const actions = {
	add: playerId => ({
		type: types.ADD,
		id: playerId,
	}),

	clear: () => ({ type: types.CLEAR }),

	setIdle: (playerId, bool) => ({
		type: types.SET_IDLE,
		id: playerId,
		idle: bool,
	}),

	setOnMove: (playerId, callbackFn) => ({
		type: types.SET_ONMOVE,
		id: playerId,
		callback: callbackFn,
	}),

	setOrder: arr => ({
		type: types.SET_ORDER,
		order: arr,
	}),
};