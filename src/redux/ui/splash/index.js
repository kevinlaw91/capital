import Immutable from "seamless-immutable";

// Types
export const types = {
	"HIDE": "ui/splash/HIDE",
};

// Actions
export const actions = {
	hide: () => ({ type: types.HIDE }),
};

// Initial state
const initialState = Immutable({
	hidden: false
});

export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.HIDE:
			return state.set("hidden", true);
		default: return state;
	}
}

// Selectors
export const getStateIsHidden = state => state.ui.splash.hidden;