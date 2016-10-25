import Immutable from "seamless-immutable";

// Types
export const types = {
	"SET_ACTIVE": "game/session/turn/SET_ACTIVE",
	"SET_ORDER": "game/session/turn/SET_ORDER",
};

// Actions
export const actions = {
	setActive: playerId => ({
		type: types.SET_ACTIVE,
		id: playerId,
	}),

	setOrder: arr => ({
		type: types.SET_ORDER,
		order: arr,
	}),
};

// Initial state
const initialState = Immutable({
	active: null,
	order: [],
});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.SET_ACTIVE:
			return state.set("active", action.id);

		case types.SET_ORDER:
			return state.set("order", action.order);

		default:
			return state;
	}
}

// Selectors
export const selectActivePlayerId = state => state.game.session.turn.active;
export const selectTurnOrder = state => state.game.session.turn.order;