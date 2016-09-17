// Actions
export const ADD = "gamestate/floor/ADD";

// Reducer
const initialState = [
	{
		symbol: "grass-2x2",
		variant: "01",
		x: 10,
		y: 25
	}
];

export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case ADD:
			return [...state, action.data];
		default: return state;
	}
}