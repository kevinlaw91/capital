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
	devtool: "module-source-map",
	entry: {
		"app": [
			"react-hot-loader/patch", // React HOT Loader
			"./app.jsx",
		],
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
		filename: "app.js",
		// Required for style-loader with sourceMap option enabled
		// https://github.com/webpack/style-loader/issues/55
		publicPath: "http://localhost:8080/",
	},
	resolve: {
		alias: {
			// Use modified svg-pan-zoom
			"svg-pan-zoom": path.join(__dirname, "src/js/vendor/svg-pan-zoom"),
		},
		extensions: [".js", ".jsx"],
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
				// Import vendor css as global scoped
				test: /vendor\.css$/,
				use: [
					"style",
					"css",
				],
			},
			{
				test: /\.scss$/,
				use: [
					"style",
					{
						loader: "css",
						options: {
							modules: true,
							importLoaders: 2,
							localIdentName: "[name]-[local]-[hash:base64:5]",
							sourceMap: true,
						},
					},
					{
						loader: "postcss",
						options: {
							sourceMap: "inline",
						},
					},
					{
						loader: "sass",
						options: {
							sourceMap: true,
						},
					},
				],
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
			"APP_DEBUG": true,
		}),
		new webpack.ProvidePlugin({
			React: "react",
			ReactDOM: "react-dom",
		}),
		new HTMLWebpackPlugin({
			title: "Loading...",
			filename: "index.html",
		}),
		// Module will be named by file name instead of numbers
		new webpack.NamedModulesPlugin(),
		// Create vendor chunk
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			filename: "vendor.bundle.js",
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