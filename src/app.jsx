/* global APP_DEBUG */
import { AppContainer as ReactAppWrapper } from "react-hot-loader";
import store from "./redux";
import { Provider } from "react-redux";

// Main App
import App from "./ui/App";

// Styles
import "./stylesheets/vendor.css";
import "./stylesheets/styles.scss";

// Logger
import { register as registerLogger } from "./logger";
window.logger = registerLogger();

// Page Title
document.title = "Capital";

// Debug
import devDebugObj from "./game/dev";

if (typeof APP_DEBUG !== "undefined") {
	// Dev build only
	// APP_DEBUG is only defined in dev build
	document.title += " (Development Build)";
	logger.info("===== DEVELOPER MODE ENABLED =====");

	// Expose debug object to global
	window.app = devDebugObj;
}

// Create wrapper element
let wrapper  = document.createElement("div");
document.body.insertBefore(wrapper, document.body.firstChild);

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
	module.hot.accept("./ui/App", render);
}