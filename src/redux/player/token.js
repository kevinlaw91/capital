import Immutable from "seamless-immutable";
import playerTypes from "./types";

// Types
export const types = {
	"SET_IDLE": "player/token/SET_IDLE",
	"SET_ONMOVE": "player/token/SET_ONMOVE",
	"SET_ORDER": "player/token/SET_ORDER",
};

// Actions
export const actions = {
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

// Initial state
const initialState = Immutable({
	idle: true,
});

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.SET_IDLE:
			return state.set("idle", action.idle);

		case types.SET_ONMOVE:
			if (action.callback) {
				return state.set("onMove", action.callback);
			} else {
				return state.without("onMove");
			}

		case playerTypes.SET_POSITION:
			return state.set("position", action.position);

		case playerTypes.SET_COLOR:
			return state.set("color", action.color);

		default:
			return state;
	}
}