import store from "../redux";
import * as splash from "../redux/ui/splash";

/** Hide splash screen */
export function hide() {
	store.dispatch(splash.actions.hide());
}