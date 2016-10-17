import mapping from "./mappings";

// Types
export const types = {
	"UPDATE": "game/stage/floor/UPDATE",
};

// Actions
export const actions = {
	update: (id, data) => ({
		type: types.UPDATE,
		id: mapping[id],
		data: data,
	}),
};