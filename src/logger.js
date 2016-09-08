/**
 * App debug logger
 * @global
 */
const logger = {};

export default logger;

export function register() {
	// Use environment variable to enable/disable logger
	const enabled = (typeof APP_DEBUG !== "undefined");

	// Common methods in console
	const methods = [
		"assert",
		"clear",
		"count",
		"dir",
		"dirxml",
		"error",
		"group",
		"groupCollapsed",
		"groupEnd",
		"info",
		"log",
		"profile",
		"profileEnd",
		"table",
		"time",
		"timeEnd",
		"timeStamp",
		"trace",
		"warn",
	];

	let i = methods.length;
	while (--i >= 0) {
		let m = methods[i];

		// Replace with noop
		logger[m] = Function.prototype;

		if (enabled && window.console && window.console[m]) {
			logger[m] = window.console[m];
		}
	}

	return logger;
};