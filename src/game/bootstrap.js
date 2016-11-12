import loadApp from "game/load";
import loadSuccess from "game/loadSuccess";

// App loaded flag
// State will persists between HMR events
let APP_LOADED = false;
export const isAppLoaded = () => APP_LOADED;

export function load() {
	return loadApp().then(() => {
		// Run load complete
		loadSuccess();

		// Set flag
		APP_LOADED = true;
	});
}