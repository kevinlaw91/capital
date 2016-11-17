import Deferred from "js/utils/deferred";

// Dice button click as deferred
let onClick;

export function subscribe() {
	onClick = new Deferred();

	return onClick.promise;
}

export function click() {
	if (onClick) {
		onClick.resolve();
	}
}