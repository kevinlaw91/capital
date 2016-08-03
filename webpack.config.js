/* eslint-env node */

/*
** Webpack development config
*/

// Imports
const path = require("path");
const webpack = require("webpack");

// Plugins
const HTMLWebpackPlugin = require("html-webpack-plugin");

// PostCSS
const PostCSSAutoprefixer = require("autoprefixer");

// Config
module.exports = {
	context: path.join(__dirname, "src"),
	// Source map
	devtool: "cheap-module-source-map",
	entry: ["./app.jsx"],
	output: {
		// Local output dir (absolute)
		path: path.join(__dirname, "build"),
		filename: "app.js"
	},
	resolve: {
		extensions: ["", ".js", ".jsx"]
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: "babel?cacheDirectory",
				include: path.join(__dirname, "src")
			},
			{
				test: /\.scss$/,
				// Hot Module Reload support + SourceMaps
				loader: [
					"style",
					"css?modules&importLoaders=2&localIdentName=[name]-[local]-[hash:base64:5]&sourceMap",
					"postcss?sourceMap=inline",
					"sass?sourceMap"
				],
				include: path.join(__dirname, "src")
			},
			{
				test: /\.(woff|woff2)$/,
				loader: "file?name=fonts/[name].[ext]",
				include: path.join(__dirname, "src")
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
			"APP_DEBUG": true
		}),
		new webpack.ProvidePlugin({
			React: "react",
			ReactDOM: "react-dom"
		}),
		new HTMLWebpackPlugin({
			title: "Loading...",
			filename: "index.html"
		}),
		// Module will be named by file name instead of numbers
		new webpack.NamedModulesPlugin()
	],
	postcss: function () {
		return [
			PostCSSAutoprefixer({
				browsers: ["last 2 versions"]
			})
		];
	}
};