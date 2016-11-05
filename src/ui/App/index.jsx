import { connect } from "react-redux";
import CSSModules from "react-css-modules";
import { VelocityTransitionGroup } from "velocity-react";
import Screen from "./components/Screen";
import SplashScreen from "ui/SplashScreen";
import GameScreen from "ui/GameScreen";
import Tooltip from "ui/Tooltip";
import { getStateIsHidden as getSplashHidden } from "redux/ui/splash";
import { init, load } from "game/bootstrap";
import styles from "./App.scss";

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
		init().then(() => {
			// CSS loaded, reveal app ui frame
			this.setState({
				bootstrap: false,
			});

			// Begin loading app
			load();
		});
	}

	render() {
		return (
			<div
				/* Hide app when css is still loading */
				style={this.state.bootstrap ? { display: "none" } : {}}

				className="fullscreen"
				styleName="container"
			>
				{gameScreen}
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