// A pending promise
let pending;

export function subscribe() {
	return new Promise(resolve => {
		pending = resolve;
	});
}

export function click() {
	if (pending) {
		pending();
	}
}