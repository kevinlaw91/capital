import Immutable from "seamless-immutable";

// Types
export const types = {
	"START_PAN": "game/camera/START_PAN",
	"STOP_PAN": "game/camera/STOP_PAN",
};

// Actions
export const actions = {
	setPanningStatus: (bool) => ({
		type: bool ? types.START_PAN : types.STOP_PAN,
	}),
};

// Initial state
const initialState = Immutable({
	panning: false,
});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.START_PAN:
			return state.set("panning", true);

		case types.STOP_PAN:
			return state.set("panning", false);

		default: return state;
	}
}