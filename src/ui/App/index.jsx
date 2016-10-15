import { connect } from "react-redux";
import { init } from "../../game/bootstrap";
import Screen from "./components/Screen";
import SplashScreen from "../SplashScreen";
import GameScreen from "../GameScreen";
import CSSModules from "react-css-modules";
import { VelocityComponent } from "velocity-react";
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
			</div>
		);
	}
}

App.propTypes = {
	hideSplash: React.PropTypes.bool,
	styles: React.PropTypes.object
};

const mapStateToProps = (state) => {
	return {
		hideSplash: state.ui.splash.hidden
	};
};

export default connect(mapStateToProps)(
	CSSModules(App, styles)
);