/* eslint-env node */

/*
** Webpack production config
*/

// Imports
const path = require("path");
const webpack = require("webpack");

// Plugins
const HTMLWebpackPlugin = require("html-webpack-plugin");

// Config
module.exports = {
	context: path.join(__dirname, "src"),
	entry: ["./app.jsx"],
	output: {
		// Local output dir (absolute)
		path: path.join(__dirname, "build"),
		filename: "app.min.js"
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
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
		}),
		new webpack.ProvidePlugin({
			React: "react",
			ReactDOM: "react-dom"
		}),
		new HTMLWebpackPlugin({
			title: "Loading...",
			filename: "index.html"
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			comments: false
		})
	]
};