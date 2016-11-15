const webpack = require("webpack");

module.exports = {
	entry: {
		vendor: [
			"classnames",
			"react",
			"react-dom",
			"react-redux",
			"redux",
			"redux-batched-actions",
			"redux-devtools-extension",
			"seamless-immutable",
			"shortid",
			"svg-pan-zoom",
			"velocity-animate",
			"velocity-react",
		],
	},
	resolve: {
		modules: ["node_modules"],
	},
	output: {
		filename: "vendor.dll.js",
		path: "build/",
		library: "libvendor",
	},
	plugins: [
		new webpack.DllPlugin({
			context: __dirname,
			name: "libvendor",
			path: "build/vendor.dll.manifest.json",
		})
	]
};