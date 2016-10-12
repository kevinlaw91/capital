import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

// Reducers
import * as game from "./game";
import * as ui from "./ui";

const reducers = combineReducers({
	game: game.reducer,
	ui: ui.reducer,
});

// Redux store
const store = createStore(
	reducers,
	// Redux DevTools Extension
	composeWithDevTools({
		name: "Capital",
	})()
);

export default store;