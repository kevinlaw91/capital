import dispatch from "redux/dispatch";
import * as splash from "redux/ui/splash";

/** Hide splash screen */
export function hide() {
	dispatch(splash.actions.hide());
}