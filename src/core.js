import store from "./redux";
import * as splash from "./redux/ui/splash";

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
	store.dispatch(splash.actions.hide());
}

/** Engine init */
export function init() {
	logger.log("Initializing engine...");
	logger.time("App ready");

	// Handle Loading
	new Promise(load).then(loadComplete);
}