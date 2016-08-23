import {
	SplashScreen
} from "../Screen";

import ReactCSSModules from "react-css-modules";
import styles from "./app.scss";

function App() {
	return (
		<div className="fullscreen" styleName="container">
			<SplashScreen />
		</div>
	);
}

export default ReactCSSModules(App, styles);