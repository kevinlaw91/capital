import { types } from "./index";
import tileReducer from "./tileReducer";

export function reducerFactory(initialState) {
	return function (state = initialState, action = {}) {
		switch (action.type) {
			case types.CHANGE_SYMBOL:
				if (action.id && state[action.id]) {
					return state.set(
						action.id,
						tileReducer(state[action.id], action),
						{ deep: true }
					);
				}

				return state;

			default:
				return state;
		}
	};
}