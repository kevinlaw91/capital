import Immutable from "seamless-immutable";
import {
	templates as t,
	types,
} from "redux/game/stage/floaters";

// Initial state
const initialState = Immutable({});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ADD:
			if (action.template === t.GOLD_CHANGE_TEXT) {
				return state.set(action.id, action.data);
			}

			return state;

		case types.REMOVE:
			return state.without(action.id);

		case types.CLEAR:
			return initialState;

		default:
			return state;
	}
}