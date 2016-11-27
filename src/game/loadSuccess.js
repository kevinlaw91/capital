import * as session from "./session";
import * as splash from "./splash";

export default function loadSuccess() {
	logger.info("Game loaded");

	// Create new game session
	session.create()

	// This was added to start game automatically
	// Ideally game should be started only after clicking start game button
	// TODO: Add start game button to call session.start();
	.then(session.start);

	// Hide splash screen when loading complete
	splash.hide();
}
