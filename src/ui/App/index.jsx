import { connect } from "react-redux";
import classnames from "classnames/bind";
import { VelocityTransitionGroup } from "velocity-react";
import Screen from "./components/Screen";
import SplashScreen from "ui/SplashScreen";
import GameScreen from "ui/GameScreen";
import Tooltip from "ui/Tooltip";
import { getStateIsHidden as getSplashHidden } from "redux/ui/splash";
import {
	GameStatus,
	getGameState
} from "redux/game/session/status";
import { isAppLoaded, load } from "game/bootstrap";
import styles from "./App.scss";

const cx = classnames.bind({
	"container": styles["container"],
});

function waitForStylesheetReady() {
	return new Promise(loaded => {
		// Wait for stylesheets to load
		window.addEventListener("load", loaded);
	});
}

// Game Screen
const gameScreen = (
	<Screen fullscreen>
		<GameScreen />
	</Screen>
);

// Splash screen
const splashScreen = (
	<Screen fullscreen>
		<SplashScreen />
	</Screen>
);

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			bootstrap: true,
		};
	}

	componentDidMount() {
		if (!isAppLoaded()) {
			// First launch
			logger.log("Initializing engine...");

			// Wait for stylesheet to load
			waitForStylesheetReady()
			.then(() => {
				// Stylesheets loaded
				// Reveals app loading UI
				this.setState({ bootstrap: false });
				// Load game
				load();
			});
		} else {
			// App already loaded, this is only a module reload
			// Don't hide UI as stylesheets were already loaded
			this.setState({ bootstrap: false });
		}
	}

	render() {
		return (
			<div
				/*
				 * Hide ui when stylesheet is still loading
				 * This has to be implemented using inline style
				 * or else FOUC will happens
				 */
				style={this.state.bootstrap ? { display: "none" } : {}}
				className={cx({
					"fullscreen": true,
					"container": true,
				})}

			>
				{ this.props.gameState === GameStatus.ACTIVE && gameScreen}
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
	gameState: React.PropTypes.oneOf(Object.values(GameStatus)),
	splash: React.PropTypes.bool,
};

const mapStateToProps = state => ({
	gameState: getGameState(state),
	splash: !getSplashHidden(state),
});

export default connect(mapStateToProps)(App);