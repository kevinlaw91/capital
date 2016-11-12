import * as session from "./session";

export default function load() {
	logger.log("Loading app...");

	// TODO: Loading tasks
	return new Promise(resolve => {
		// Create new game session
		session.create();
		session.start();

		resolve();
	});
}