import coordinate from "../../coordinates";

// Initial state
const initialState = [
	{
		color: "white",
		position: {
			x: coordinate(13, 13)[0],
			y: coordinate(13, 13)[1],
		}
	}
];

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		default: return state;
	}
}