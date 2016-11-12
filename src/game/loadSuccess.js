import * as splash from "./splash";

export default function loadSuccess() {
	logger.info("Game loaded");

	// Hide splash screen when loading complete
	splash.hide();
}