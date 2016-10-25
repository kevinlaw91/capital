// Types
export const types = {
	"SET_ACTIVE": "game/player/SET_ACTIVE",
	"SET_COLOR": "game/player/SET_COLOR",
	"SET_POSITION": "game/player/SET_POSITION",
};

// Actions
export const actions = {
	setActive: playerId => ({
		type: types.SET_ACTIVE,
		id: playerId,
	}),

	setColor: (playerId, color) => ({
		type: types.SET_COLOR,
		id: playerId,
		color: color,
	}),

	setPosition: (playerId, pos) => ({
		type: types.SET_POSITION,
		id: playerId,
		position: pos,
	}),
};