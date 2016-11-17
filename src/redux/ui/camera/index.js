import Immutable from "seamless-immutable";

// Types
export const types = {
	"GRAB": "game/camera/GRAB",
	"PAN": "game/camera/PAN",
};

// Actions
export const actions = {
	setGrabbing: grab => ({
		type: types.GRAB,
		grab,
	}),

	setPanning: pan => ({
		type: types.PAN,
		pan,
	}),
};

// Initial state
const initialState = Immutable({
	grabbing: false,
	panning: false,
});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.GRAB:
			return state.set("grabbing", action.grab);

		case types.PAN:
			return state.set("panning", action.pan);

		default: return state;
	}
}

// Selectors
export const isGrabbing = state => state.ui.camera.grabbing;
export const isPanning = state => state.ui.camera.panning;