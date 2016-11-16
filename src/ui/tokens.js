/** Reference of Token instances */
const tokens = new Map();

/** Find instance of rendered Token by player id */
export function find(id) {
	return tokens.get(id);
}

/** Register instance of rendered Token */
export function register(id, instance) {
	tokens.set(id, instance);
}

/** Unegister instance */
export function unregister(id) {
	tokens.delete(id);
}