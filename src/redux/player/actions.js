import types from "./types";

// Actions
export default {
	setActive: id => ({
		type: types.SET_ACTIVE,
		id,
	}),

	setColor: (id, color) => ({
		type: types.SET_COLOR,
		id,
		color,
	}),

	setPosition: (id, position) => ({
		type: types.SET_POSITION,
		id,
		position,
	}),
};