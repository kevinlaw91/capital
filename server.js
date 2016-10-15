/* eslint-env node */

// Imports
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config");

// Plugins
const WebpackBrowserPlugin = require("webpack-browser-plugin");

// Modify entry
// Use unshift() to load these before app entry
config.entry.app.unshift(
	// webpack-dev-server
	"webpack-dev-server/client?http://localhost:8080",
	// Hot Module Reloading
	"webpack/hot/only-dev-server"
);

// Initialize plugins
config.plugins = config.plugins || [];

// Attach plugins
config.plugins.push(
	// Enable HMR
	new webpack.HotModuleReplacementPlugin(),

	// Open browser after build
	new WebpackBrowserPlugin({
		url: "http://localhost",
		port: 8080
	})
);

// Start server
new WebpackDevServer(webpack(config), {
	// Local folder (relative) to serve as web server root
	contentBase: "build/",
	hot: true,
	publicPath: "http://localhost:8080/",
	historyApiFallback: true,
	stats: { colors: true }
}).listen(8080);