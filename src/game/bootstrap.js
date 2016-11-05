import * as splash from "./splash";
import * as session from "./session";

export function init() {
	logger.log("Initializing engine...");

	return new Promise(resolve => {
		window.addEventListener("load", resolve);
	});
}

function loaded() {
	// Hide splash screen when loading complete
	splash.hide();
}

export function load() {
	logger.log("Loading app");

	// TODO: Loading
	new Promise(resolve => {
		// Create new game session
		session.create();

		// Start session
		session.start();

		// Load complete
		resolve();
	}).then(loaded);
}