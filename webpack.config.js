/* eslint-env node */

/*
** Webpack development config
*/

// Imports
const path = require("path");
const webpack = require("webpack");

// Plugins
const HTMLWebpackPlugin = require("html-webpack-plugin");

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
		extensions: ["", ".js"]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
			"APP_DEBUG": true
		}),
		new HTMLWebpackPlugin({
			title: "Loading...",
			filename: "index.html"
		}),
		// Module will be named by file name instead of numbers
		new webpack.NamedModulesPlugin()
	]
};