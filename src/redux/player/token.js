import Immutable from "seamless-immutable";
import playerTypes from "./types";

// Types
export const types = {
	"SET_IDLE": "player/token/SET_IDLE",
	"SET_ORDER": "player/token/SET_ORDER",
};

// Actions
export const actions = {
	setIdle: (playerId, bool) => ({
		type: types.SET_IDLE,
		id: playerId,
		idle: bool,
	}),

	setOrder: arr => ({
		type: types.SET_ORDER,
		order: arr,
	}),
};

// Initial state
const initialState = Immutable({
	idle: true,
});

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.SET_IDLE:
			return state.set("idle", action.idle);

		case playerTypes.SET_POSITION:
			return state.set("position", action.position);

		case playerTypes.SET_COLOR:
			return state.set("color", action.color);

		default:
			return state;
	}
}