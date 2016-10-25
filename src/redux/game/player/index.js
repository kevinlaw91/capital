// Types
export const types = {
	"SET_POSITION": "game/player/SET_POSITION",
};

// Actions
export const actions = {
	setPosition: (playerId, pos) => ({
		type: types.SET_POSITION,
		id: playerId,
		position: pos,
	}),
};