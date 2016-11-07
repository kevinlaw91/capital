import Immutable from "seamless-immutable";

// Types
export const types = {
	"SHOW": "ui/tooltip/SHOW",
	"HIDE": "ui/tooltip/HIDE",
	"MOVE": "ui/tooltip/MOVE",
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
	move: (x, y) => ({
		type: types.MOVE,
		position: { x, y },
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

		case types.MOVE:
			return state.merge(action.position);

		case types.HIDE:
			return initialState;

		default:
			return state;
	}
}

// Selectors
export const getTooltipClass = state => state.ui.tooltip.tooltipClass;
export const getTooltipPosition = state => ({ x: state.ui.tooltip.x, y: state.ui.tooltip.y });
export const getTooltipData = state => state.ui.tooltip.data;