import { init } from "../../game/bootstrap";
import {
	SplashScreen,
	GameScreen
} from "../Screen";

import ReactCSSModules from "react-css-modules";
import styles from "./app.scss";

class App extends React.Component {
	componentDidMount() {
		init();
	}

	render() {
		return (
			<div className="fullscreen" styleName="container">
				<GameScreen />
				<SplashScreen />
			</div>
		);
	}
}

export default ReactCSSModules(App, styles);