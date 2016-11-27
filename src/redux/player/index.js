import Immutable from "seamless-immutable";
import types from "./types";

// Re-export types and actions
export { types };
export { default as actions } from "./actions";

// Initial state
const initialState = Immutable({
	gold: 0,
});
export { initialState };

// Reducer
export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.GOLD_SET:
			return state.set("gold", action.gold);

		case types.GOLD_ADD:
			return state.set("gold", state.gold + action.gold);

		case types.GOLD_DEDUCT:
			return state.set("gold", state.gold - action.gold);

		case types.SET_COLOR:
			return state.set("color", action.color);

		case types.SET_POSITION:
			return state.set("position", action.position);

		default:
			return state;
	}
}
