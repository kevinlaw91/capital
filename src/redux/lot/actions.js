import types from "./types";

// Actions
export default {
	setName: (id, name) => ({
		type: types.SET_NAME,
		id,
		name,
	}),

	setTradable: (id, tradable) => ({
		type: types.SET_TRADABLE,
		id,
		tradable,
	}),

	setPrice: (id, price) => ({
		type: types.SET_PRICE,
		id,
		price,
	}),

	setUpgradeCost: (id, cost) => ({
		type: types.SET_UPGRADE_COST,
		id,
		upgrades: cost,
	}),

	setRent: (id, rent) => ({
		type: types.SET_RENT,
		id,
		rent,
	}),

	setOwner: (id, owner) => ({
		type: types.SET_OWNER,
		id,
		owner,
	}),

	setTier: (id, tier) => ({
		type: types.SET_TIER,
		id,
		tier,
	})
};
