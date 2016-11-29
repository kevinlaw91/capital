import { load as loadFonts } from "game/resources/fonts";
import { preload as preloadPrompts } from "ui/prompts/preload";

export default function load() {
	logger.log("Loading app...");

	return Promise.all([
		loadFonts(),
		preloadPrompts(),
	]);
}
