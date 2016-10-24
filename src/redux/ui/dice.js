import Immutable from "seamless-immutable";

// Types
export const types = {
	"ENABLE": "ui/dice/ENABLE",
	"DISABLE": "ui/dice/DISABLE",
	"SET_INDETERMINATE": "ui/dice/SET_INDETERMINATE",
};

// Actions
export const actions = {
	enable: () => ({ type: types.ENABLE }),
	disable: () => ({ type: types.DISABLE }),
	setIndeterminate: bool => ({
		type: types.SET_INDETERMINATE,
		value: bool,
	}),
};

// Initial state
const initialState = Immutable({
	disabled: false,
	indeterminate: false,
});

export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.ENABLE:
			return state.set("disabled", false);
		case types.DISABLE:
			return state.set("disabled", true);
		case types.SET_INDETERMINATE:
			return state.set("indeterminate", action.value);
		default: return state;
	}
}

// Selectors
export const getStateDisabled = state => state.ui.dice.disabled;
export const getStateIndeterminate = state => state.ui.dice.indeterminate;