// Loaded SVG symbols
export let store = [];

// Files to be loaded
/* eslint-disable comma-style */
let files = {
	"concrete-01": "tiles/floor/01/concrete.svg"
	, "grass-2x2-01": "tiles/floor/01/grass-2x2.svg"
	, "grass-3x3-01": "tiles/floor/01/grass-3x3.svg"
	, "grass-01": "tiles/floor/01/grass.svg"
	, "lot-east-01": "tiles/floor/01/lot-east.svg"
	, "lot-north-01": "tiles/floor/01/lot-north.svg"
	, "lot-south-01": "tiles/floor/01/lot-south.svg"
	, "lot-west-01": "tiles/floor/01/lot-west.svg"
};
/* eslint-enable comma-style */

for (let id in files) {
	if (files.hasOwnProperty(id)) {
		// Load svg contents and wraps in <symbol> tag
		// webpack does not support loader with dynamic query value
		// @see https://github.com/webpack/webpack/issues/2992
		// use manual string replacement instead
		let symbol = require("!!svg-as-symbol?id=_placeholder-id_!../../svg/" + files[id]);
		symbol = symbol.replace("_placeholder-id_", id);
		store.push(symbol);
	}
}