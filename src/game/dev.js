import session from "./session";

/**
 * Public data to be exposed to global for debugging
 */
export default {
	get activeSession() {
		return session.active;
	},
};