// Limit require context to src/svg/tiles/floor
const r = require.context("svg-sprite-loader?name=[path][name]!../../../svg/tiles/floor", true, /.*\.svg$/);

const symbols = {
	"01": {
		"concrete": r("./01/concrete.svg"),
		"grass-2x2": r("./01/grass-2x2.svg"),
		"grass-3x3": r("./01/grass-3x3.svg"),
		"grass": r("./01/grass.svg"),
		"lot-east": r("./01/lot-east.svg"),
		"lot-north": r("./01/lot-north.svg"),
		"lot-south": r("./01/lot-south.svg"),
		"lot-west": r("./01/lot-west.svg"),
	},
};

export default (id, variant = "01") => symbols[variant][id];