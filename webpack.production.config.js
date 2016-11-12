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

// Config
// noinspection JSUnresolvedFunction
module.exports = {
	context: path.join(__dirname, "src"),
	entry: {
		"app": "./app.jsx",
		"vendor": [
			"react",
			"react-dom",
			"react-hot-loader",
			"react-redux",
			"redux",
			"svg-pan-zoom",
			"velocity-animate",
			"velocity-react",
		],
	},
	output: {
		// Local output dir (absolute)
		path: path.join(__dirname, "build"),
		filename: "app.min.js",
	},
	resolve: {
		modules: [
			path.join(__dirname, "src"),
			"node_modules"
		],
		extensions: [".js", ".jsx"],
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				options: {
					cacheDirectory: true,
				},
				include: path.join(__dirname, "src"),
			},
			{
				// Import vendor css as global scoped
				test: /vendor\.css$/,
				loader: ExtractTextPlugin.extract({
					loader: [
						"css-loader",
					],
					// publicPath from 'build/css' to 'build/'
					publicPath: "../",
				}),
			},
			{
				test: /\.scss$/,
				// Single css bundle
				loader: ExtractTextPlugin.extract({
					loader: [
						"css-loader?modules&importLoaders=2&localIdentName=[name]-[local]-[hash:base64:5]",
						"postcss-loader",
						"sass-loader",
					],
					// publicPath from 'build/css' to 'build/'
					publicPath: "../",
				}),
				include: path.join(__dirname, "src"),
			},
			{
				test: /\.(woff|woff2)$/,
				loader: "file-loader",
				options: {
					name: "fonts/[name].[ext]",
				},
				include: path.join(__dirname, "src"),
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),
		new ExtractTextPlugin({
			filename: "css/styles.min.css",
			allChunks: true,
		}),
		new OptimizeCssAssetsPlugin(),
		new webpack.ProvidePlugin({
			React: "react",
			ReactDOM: "react-dom",
		}),
		new HTMLWebpackPlugin({
			title: "Capital",
			filename: "index.html",
			template: "template.html",
			env: process.env.NODE_ENV,
		}),
		// Create vendor chunk
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			filename: "vendor.bundle.min.js",
		}),
	    // Disable Dedupe that causes error
	    // https://github.com/webpack/webpack/issues/2644
		// new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			comments: false,
		}),
	],
};