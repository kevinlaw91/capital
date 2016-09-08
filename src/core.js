import store from "./redux/store";

/** Load app */
function load(resolve, reject) {
	// TODO
	// Resolve immediately for now
	resolve();
}

/** When app loaded */
function loadComplete() {
	logger.timeEnd("App ready");

	// Hide splash screen when app is ready
	store.dispatch({
		type: require("./redux/splash").HIDE_SPLASH
	});
}

/** Engine init */
export function init() {
	logger.log("Initializing engine...");
	logger.time("App ready");

	// Handle Loading
	new Promise(load).then(loadComplete);
}