import Immutable from "seamless-immutable";

import mapDefinition from "./initialState";
import lotReducer from "./lot";

// Types
export const types = {
	"RESET": "game/session/map/RESET",
	"SET_NAME": "game/session/map/SET_NAME",
	"SET_TRADABLE": "game/session/map/SET_TRADABLE",
	"SET_PRICE": "game/session/map/SET_PRICE",
	"SET_UPGRADE_COST": "game/session/map/SET_UPGRADE_COST",
	"SET_RENT": "game/session/map/SET_RENT",
};

// Actions
export const actions = {
	reset: () => ({ type: types.RESET }),

	setName: (lotId, name) => ({
		type: types.SET_NAME,
		id: lotId,
		name
	}),

	setTradable: (lotId, isTradable) => ({
		type: types.SET_TRADABLE,
		id: lotId,
		tradable: isTradable
	}),

	setPrice: (lotId, price) => ({
		type: types.SET_PRICE,
		id: lotId,
		price
	}),

	setUpgradeCost: (lotId, cost) => ({
		type: types.SET_UPGRADE_COST,
		id: lotId,
		upgrades: cost,
	}),

	setRent: (lotId, rent) => ({
		type: types.SET_RENT,
		id: lotId,
		rent
	}),
};

// Initial state
const initialState = Immutable(mapDefinition);

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.RESET:
			return initialState;

		case types.SET_NAME:
		case types.SET_TRADABLE:
		case types.SET_PRICE:
		case types.SET_UPGRADE_COST:
		case types.SET_RENT:
			if (action.id) {
				return state.set(
					action.id,
					lotReducer(state[action.id], action),
					{ deep: true }
				);
			}

			return state;

		default:
			return state;
	}
}