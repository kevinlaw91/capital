import { connect } from "react-redux";
import CSSModules from "react-css-modules";
import { VelocityTransitionGroup } from "velocity-react";
import Screen from "./components/Screen";
import SplashScreen from "ui/SplashScreen";
import GameScreen from "ui/GameScreen";
import Tooltip from "ui/Tooltip";
import { getStateIsHidden as getSplashHidden } from "redux/ui/splash";
import { init } from "game/bootstrap";
import styles from "./App.scss";

// Splash screen
const splashScreen = (
	<Screen fullscreen>
		<SplashScreen />
	</Screen>
);

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
				<VelocityTransitionGroup
					leave={{
						animation: {
							opacity: 0,
						},
						duration: 500,
					}}
				    component="div"
				>
					{this.props.splash && splashScreen}
				</VelocityTransitionGroup>
				<Tooltip />
			</div>
		);
	}
}

App.propTypes = {
	splash: React.PropTypes.bool,
	styles: React.PropTypes.object
};

const mapStateToProps = state => ({
	splash: !getSplashHidden(state)
});

export default connect(mapStateToProps)(
	CSSModules(App, styles)
);