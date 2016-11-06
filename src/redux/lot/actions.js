import types from "./types";

// Actions
export default {
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