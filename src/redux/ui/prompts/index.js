import Immutable from "seamless-immutable";

// Prompt templates
export const templates = {
	"LOT_PURCHASE": "LOT_PURCHASE",
	"LOT_UPGRADE": "LOT_UPGRADE",
};

// Types
export const types = {
	"CREATE": "game/prompts/CREATE",
	"REMOVE": "game/prompts/REMOVE",
};

// Actions
export const actions = {
	create: (template, id, data) => ({
		type: types.CREATE,
		id,
		prompt: {
			template,
			...data
		},
	}),

	remove: id => ({
		type: types.REMOVE,
		id,
	})
};

// Initial state
const initialState = Immutable({});

// Reducer
export function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.CREATE:
			return state.set(action.id, action.prompt);

		case types.REMOVE:
			return state.without(action.id);

		default:
			return state;
	}
}

// Selectors
export const selectAllPrompts = state => state.ui.prompts;
