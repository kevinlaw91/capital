/* global APP_DEBUG */
import { AppContainer as ReactAppWrapper } from "react-hot-loader";

// Main App
import App from "./ui/App";

// Logger
import { register as registerLogger } from "./logger";
window.logger = registerLogger();

// Page Title
document.title = "Capital";

if (typeof APP_DEBUG !== "undefined") {
	// Dev build only
	// APP_DEBUG is only defined in dev build
	document.title += " (Development Build)";
	logger.info("===== DEVELOPER MODE ENABLED =====");
}

// Create wrapper element
let wrapper  = document.createElement("div");
document.body.insertBefore(wrapper, document.body.firstChild);

function render() {
	ReactDOM.render(
		<ReactAppWrapper>
			<App />
		</ReactAppWrapper>,
		wrapper
	);
}

// First render
render();

if (module.hot) {
	module.hot.accept("./ui/App", render);
}