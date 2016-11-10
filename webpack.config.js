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
	devtool: "module-source-map",
	entry: {
		"app": [
			"react-hot-loader/patch", // React HOT Loader
			"./app.jsx",
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
				use: [
					"style-loader",
					"css-loader",
				],
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: true,
							importLoaders: 2,
							localIdentName: "[name]-[local]-[hash:base64:5]",
							sourceMap: true,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							map: "inline",
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
						},
					},
				],
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
			"APP_DEBUG": true,
		}),
		new webpack.ProvidePlugin({
			React: "react",
			ReactDOM: "react-dom",
		}),
		new HTMLWebpackPlugin({
			title: "Capital (Development Build)",
			filename: "index.html",
			template: "template.html",
			env: process.env.NODE_ENV,
		}),
		// Module will be named by file name instead of numbers
		new webpack.NamedModulesPlugin(),
		// Load DLL manifest
		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require("./build/vendor.dll.manifest.json"),
		}),
	],
};