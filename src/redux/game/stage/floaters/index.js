import { combineReducers } from "redux";
import shortid from "shortid";

// Floater templates
export const templates = {
	GOLD_CHANGE_TEXT: "GOLD_CHANGE_TEXT",
};

// Types
export const types = {
	"ADD": "game/stage/floaters/ADD",
	"REMOVE": "game/stage/floaters/REMOVE",
	"CLEAR": "game/stage/floaters/CLEAR",
};

// Actions
export const actions = {
	add: (template, data) => ({
		type: types.ADD,
		id: shortid.generate(),
		template,
		data,
	}),

	remove: id => ({
		type: types.REMOVE,
		id,
	}),

	clear: () => ({
		type: types.CLEAR,
	}),
};

// Reducers
import { reducer as gold_change_text } from "./gold_change_text";

export const reducer = combineReducers({
	[templates.GOLD_CHANGE_TEXT]: gold_change_text,
});

// Selectors
export const selectAllByTemplate = (state, template) => state.game.stage.floaters[template];