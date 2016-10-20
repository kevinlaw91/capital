import { createStore, combineReducers } from "redux";
import { enableBatching } from "redux-batched-actions";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

// Reducers
import * as game from "./game";
import * as ui from "./ui";

let reducers = combineReducers({
	game: game.reducer,
	ui: ui.reducer,
});

// Enable dispatching actions in batch
reducers = enableBatching(reducers);

// Redux store
const store = createStore(
	reducers,
	// Redux DevTools Extension
	composeWithDevTools({
		name: "Capital",
	})()
);

export default store;