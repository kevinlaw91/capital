// Support gulpfile.babel.js written in ES2015

// Babel require hook
// The .babelrc config disabled transformation of modules
// Use custom config for babel-register to re-enable transformation
require("babel-register")({
	presets: ["es2015"]
});

// Transform and load "gulpfile.babel.js"
require("./gulpfile.babel.js");