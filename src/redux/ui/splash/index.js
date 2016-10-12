// Types
export const types = {
	"HIDE": "ui/splash/HIDE",
};

// Actions
export const actions = {
	hide: () => ({ type: types.HIDE }),
};

// Initial state
const initialState = {
	hidden: false
};

export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.HIDE:
			return Object.assign({}, state, {
				hidden: true
			});
		default: return state;
	}
}