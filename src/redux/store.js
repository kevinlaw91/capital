import { createStore } from "redux";

// Import reducers
import reducers from "./reducers";

// Redux store
const store = createStore(
	reducers,
	/**
	 * Redux DevTools Extension
	 * @property devToolsExtension
	 * @memberOf window
	 */
	window.devToolsExtension && window.devToolsExtension()
);

if (module.hot) {
	// Enable Webpack hot module replacement for reducers
	module.hot.accept("./reducers", () => {
		store.replaceReducer(require("./reducers").default);
	});
}

export default store;