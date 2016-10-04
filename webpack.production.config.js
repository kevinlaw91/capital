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
		extensions: ["", ".js", ".jsx"],
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel",
				options: {
					cacheDirectory: true,
				},
				include: path.join(__dirname, "src"),
			},
			{
				test: /\.scss$/,
				// Single css bundle
				loader: ExtractTextPlugin.extract({
					loader: [
						"css?modules&importLoaders=2&localIdentName=[name]-[local]-[hash:base64:5]",
						"postcss",
						"sass",
					],
					// publicPath from 'build/css' to 'build/'
					publicPath: "../",
				}),
				include: path.join(__dirname, "src"),
			},
			{
				test: /\.(woff|woff2)$/,
				loader: "file",
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
			title: "Loading...",
			filename: "index.html",
		}),
		// Create vendor chunk
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			filename: "vendor.bundle.min.js",
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
	    // Disable Dedupe that causes error
	    // https://github.com/webpack/webpack/issues/2644
		// new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			comments: false,
		}),
		// Loader Options (backward compatibility)
		new webpack.LoaderOptionsPlugin({
			test: /\.scss$/,
			options: {
				context: __dirname,
				postcss: [
					PostCSSAutoprefixer({
						browsers: ["last 2 versions"],
					}),
				],
			},
		}),
	],
};