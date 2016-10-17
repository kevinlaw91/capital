import { types } from "./index";

// Reducer factory
// Generate reducers for north, south, east, and west
export default function (side, initialState) {
	return function (state = initialState, action = {}) {
		switch (action.type) {
			case types.UPDATE:
				// Extract fields from id string
				const group = action.id.split("-")[1];

				if (group === side) {
					return state.merge(
						{ [action.id]: action.data },
						{ deep: true }
					);
				}

				return state;

			default: return state;
		}
	};
}