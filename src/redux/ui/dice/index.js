import Immutable from "seamless-immutable";

// Types
export const types = {
	"ENABLE": "ui/dice/ENABLE",
	"DISABLE": "ui/dice/DISABLE",
	"SHOW": "ui/dice/SHOW",
	"HIDE": "ui/dice/HIDE",
	"SET_INDETERMINATE": "ui/dice/SET_INDETERMINATE",
};

// Actions
export const actions = {
	enable: () => ({
		type: types.ENABLE,
	}),

	disable: () => ({
		type: types.DISABLE,
	}),

	show: () => ({
		type: types.SHOW,
	}),

	hide: () => ({
		type: types.HIDE,
	}),

	setIndeterminate: indeterminate => ({
		type: types.SET_INDETERMINATE,
		indeterminate,
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

		case types.SHOW:
			return state.without("hidden");

		case types.HIDE:
			return state.set("hidden", true);

		case types.SET_INDETERMINATE:
			return state.set("indeterminate", action.indeterminate);

		default:
			return state;
	}
}

// Selectors
export const getStateHidden = state => state.ui.dice.hidden;
export const getStateDisabled = state => state.ui.dice.disabled;
export const getStateIndeterminate = state => state.ui.dice.indeterminate;