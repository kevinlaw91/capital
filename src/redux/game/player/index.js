// Types
export const types = {
	"SET_COLOR": "game/player/SET_COLOR",
	"SET_POSITION": "game/player/SET_POSITION",
};

// Actions
export const actions = {
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