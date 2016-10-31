import { connect } from "react-redux";
import CSSModules from "react-css-modules";
import { VelocityComponent } from "velocity-react";

import Screen from "./components/Screen";
import SplashScreen from "../SplashScreen";
import GameScreen from "../GameScreen";
import Tooltip from "../Tooltip";

import { getStateIsHidden as getSplashHidden } from "../../redux/ui/splash";

import { init } from "../../game/bootstrap";

import styles from "./App.scss";

class App extends React.Component {
	componentDidMount() {
		init();
	}

	render() {
		return (
			<div className="fullscreen" styleName="container">
				<Screen fullscreen>
					<GameScreen />
				</Screen>
				<VelocityComponent
					animation={{ opacity: (this.props.hideSplash ? 0 : 1) }}
					duration={ 300 }
					display={ this.props.hideSplash ? "none" : null } >
					<Screen fullscreen>
						<SplashScreen />
					</Screen>
				</VelocityComponent>
				<Tooltip />
			</div>
		);
	}
}

App.propTypes = {
	hideSplash: React.PropTypes.bool,
	styles: React.PropTypes.object
};

const mapStateToProps = state => ({
	hideSplash: getSplashHidden(state)
});

export default connect(mapStateToProps)(
	CSSModules(App, styles)
);