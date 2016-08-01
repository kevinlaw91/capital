/* eslint-env node */

/*
** Webpack production config
*/

// Imports
const path = require("path");
const webpack = require("webpack");

// Plugins
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// PostCSS
const PostCSSAutoprefixer = require("autoprefixer");

// Config
// noinspection JSUnresolvedFunction
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
			},
			{
				test: /\.scss$/,
				// Single css bundle
				loader: ExtractTextPlugin.extract({
					loader: [
						"css?modules&importLoaders=2&localIdentName=[name]-[local]-[hash:base64:5]",
						"postcss",
						"sass"
					],
					// publicPath from 'build/css' to 'build/'
					publicPath: "../"
				}),
				include: path.join(__dirname, "src")
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
		}),
		new ExtractTextPlugin({
			filename: "css/styles.min.css",
			allChunks: true
		}),
		new OptimizeCssAssetsPlugin(),
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
	],
	postcss: function () {
		return [
			PostCSSAutoprefixer({
				browsers: ["last 2 versions"]
			})
		];
	}
};