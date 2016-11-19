import { load as loadFonts } from "game/resources/fonts";

export default function load() {
	logger.log("Loading app...");

	return Promise.all([
		loadFonts(),
	]);
}