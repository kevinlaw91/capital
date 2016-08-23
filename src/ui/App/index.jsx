import ReactCSSModules from "react-css-modules";
import styles from "./app.scss";

function App() {
	return (
		<div className="fullscreen" styleName="container" />
	);
}

export default ReactCSSModules(App, styles);