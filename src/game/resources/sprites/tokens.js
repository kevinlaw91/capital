// Limit require context to src/resources/svg/tokens
const r = require.context("svg-sprite-loader?name=[path][name]!../../../resources/svg/tokens", true, /.*\.svg$/);

const symbols = {
	"black": r("./black.svg"),
	"blue": r("./blue.svg"),
	"brown": r("./brown.svg"),
	"green": r("./green.svg"),
	"pink": r("./pink.svg"),
	"purple": r("./purple.svg"),
	"red": r("./red.svg"),
	"white": r("./white.svg"),
	"yellow": r("./yellow.svg"),
};

export default color => symbols[color];