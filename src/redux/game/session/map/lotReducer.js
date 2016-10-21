import { types } from "./index";

export default function reducer(state, action = {}) {
	switch (action.type) {
		case types.SET_NAME:
			return state.set("name", action.name);

		case types.SET_TRADABLE:
			return state.set("tradable", action.tradable);

		case types.SET_PRICE:
			return state.set("price", action.price);

		case types.SET_UPGRADE_COST:
			return state.set("upgrades", action.upgrades, { deep: true });

		case types.SET_RENT:
			return state.set("rent", action.rent, { deep: true });

		default:
			return state;
	}
}