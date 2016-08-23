// Actions
export const HIDE_SPLASH = "app/splash/HIDE_SPLASH";

// Reducer
const initialState = {
	hidden: false
};

export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case HIDE_SPLASH:
			return Object.assign({}, state, {
				hidden: true
			});
		default: return state;
	}
}