import types from "./types";

// Actions
export default {
	addGold: (id, gold) => ({
		type: types.GOLD_ADD,
		id,
		gold,
	}),

	deductGold: (id, gold) => ({
		type: types.GOLD_DEDUCT,
		id,
		gold,
	}),

	setActive: id => ({
		type: types.SET_ACTIVE,
		id,
	}),

	setColor: (id, color) => ({
		type: types.SET_COLOR,
		id,
		color,
	}),

	setGold: (id, gold) => ({
		type: types.GOLD_SET,
		id,
		gold,
	}),

	setPosition: (id, position) => ({
		type: types.SET_POSITION,
		id,
		position,
	}),
};