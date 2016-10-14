import * as splash from "./splash";
import * as game from "./index";

/** Execute tasks during loading */
function load(resolve, reject) {
	// Benchmark loading time
	logger.time("App ready");

	resolve();
}

/** App loaded */
function loaded() {
	logger.timeEnd("App ready");

	// TODO: Refactor
	game.createGame();

	// Hide splash screen when app is ready
	splash.hide();
}

/** App was mounted */
export function init() {
	logger.log("Initializing engine...");

	// Run boot tasks
	new Promise(load).then(loaded);
}