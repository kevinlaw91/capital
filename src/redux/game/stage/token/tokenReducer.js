import Immutable from "seamless-immutable";
import { types as playerTypes } from "redux/game/player";
import { types as tokenTypes } from "./actions";

// Initial state
const initialState = Immutable({
	idle: true,
});

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case tokenTypes.ADD:
			return initialState;

		case playerTypes.SET_POSITION:
			return state.set("position", action.position);

		case playerTypes.SET_COLOR:
			return state.set("color", action.color);

		case tokenTypes.SET_IDLE:
			return state.set("idle", action.idle);

		case tokenTypes.SET_ONMOVE:
			if (action.callback) {
				return state.set("onMove", action.callback);
			} else {
				return state.without("onMove");
			}

		default:
			return state;
	}
}