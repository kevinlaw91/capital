import dispatch from "redux/dispatch";
import {
	templates as t,
	actions,
} from "redux/game/stage/floaters";

export function renderGoldChangeText(data) {
	dispatch(actions.add(t.GOLD_CHANGE_TEXT, data));
}

export function removeFloaterById(id) {
	dispatch(actions.remove(id));
}

export function clearFloaters() {
	dispatch(actions.clear());
}