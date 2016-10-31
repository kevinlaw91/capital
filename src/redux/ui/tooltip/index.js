import Immutable from "seamless-immutable";

// Types
export const types = {
	"SHOW": "ui/tooltip/SHOW",
	"HIDE": "ui/tooltip/HIDE",
};

// Actions
export const actions = {
	show: (tooltipClass, data) => ({
		type: types.SHOW,
		tooltipClass,
		data,
	}),
	hide: () => ({
		type: types.HIDE
	}),
};

// Initial state
const initialState = Immutable({});

export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.SHOW:
			if (action.tooltipClass) {
				return Immutable({
					tooltipClass: action.tooltipClass,
					data: action.data,
				});
			}

			return state;

		case types.HIDE:
			return initialState;
		default: return state;
	}
}

// Selectors
export const getTooltipClass = state => state.ui.tooltip.tooltipClass;
export const getTooltipData = state => state.ui.tooltip.data;