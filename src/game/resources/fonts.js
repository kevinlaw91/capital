import { load as loadFromFile } from "opentype.js";

// Limit require context to src/resources/fonts
const r = require.context("../../resources/fonts", false, /.*\.(woff|woff2)$/);

/**
 * A font object
 * @external Font
 * @see opentype.Font
 */

/**
 * Loaded fonts
 * Note that the key must match with the fullName of the loaded font.
 * Value is a url string before load. When loaded, it will be replaced by the loaded Font object
 * @type {Object.<string,(string|Font)>}
 */
const fonts = {
	"Passion One": r("./passion-one-regular.woff"),
};

/**
 * Get a Font object from collection
 * @returns {Font}
 */
export function getFont(fontFullName) {
	return fonts[fontFullName];
}

/**
 * Load fonts
 * @return {Promise}
 */
export function load() {
	logger.log("Loading fonts...");

	const tasks = [];

	Object.keys(fonts).forEach(fontFullName => {
		tasks.push(
			new Promise((resolve, reject) => {
				// Font file URL
				const path = fonts[fontFullName];

				// Load file
				loadFromFile(path, function (errorMsg, font) {
					if (!errorMsg) {
						// Font loaded successfully
						const fontFullName = font.getEnglishName("fullName");

						if (fontFullName) {
							// Register
							fonts[fontFullName] = font;
							resolve();
						} else {
							reject(new Error(`Font "${path}" does not have a full name`));
						}
					} else {
						reject(new Error(`Failed to load "${path}"`));
					}
				});
			})
		);
	});

	return Promise.all(tasks);
}