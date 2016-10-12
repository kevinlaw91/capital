import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

// Import reducers
import reducers from "./reducers";

// Redux store
const store = createStore(
	reducers,
	// Redux DevTools Extension
	composeWithDevTools({
		name: "UI",
	})()
);

if (module.hot) {
	// Enable Webpack hot module replacement for reducers
	module.hot.accept("./reducers", () => {
		store.replaceReducer(require("./reducers").default);
	});
}

export default store;