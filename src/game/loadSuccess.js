import * as session from "./session";
import * as splash from "./splash";

export default function loadSuccess() {
	logger.info("Game loaded");

	// Create new game session
	session.create();
	session.start();

	// Hide splash screen when loading complete
	splash.hide();
}