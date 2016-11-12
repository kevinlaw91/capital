/* global APP_DEBUG */
import { AppContainer as ReactAppWrapper } from "react-hot-loader";
import store from "redux/store";
import { Provider } from "react-redux";

// Main App
import App from "ui/App";

// Styles
import "stylesheets/vendor.css";
import "stylesheets/styles.scss";

// Logger
import { register as registerLogger } from "./logger";
window.logger = registerLogger();

// Debug
import devDebugObj from "game/dev";

if (typeof APP_DEBUG !== "undefined") {
	// APP_DEBUG exist in dev build only
	logger.info("===== DEVELOPER MODE ENABLED =====");

	// Expose debug object to global
	window.app = devDebugObj;
}

// React injection point
let wrapper = document.getElementById("app");

function render() {
	ReactDOM.render(
		<ReactAppWrapper>
			<Provider store={store}>
				<App />
			</Provider>
		</ReactAppWrapper>,
		wrapper
	);
}

// First render
render();

if (module.hot) {
	module.hot.accept("ui/App", render);
}