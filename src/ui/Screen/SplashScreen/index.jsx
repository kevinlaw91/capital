import Screen from "../Screen";

import { connect } from "react-redux";
import CSSModules from "react-css-modules";

import styles from "./splash.scss";

function SplashScreen(props) {
	if (!props.hidden) {
		return <Screen fullscreen className={ props.styles.wrapper }> LOADING </Screen>;
	}
}

SplashScreen.propTypes = {
	hidden: React.PropTypes.bool,
	styles: React.PropTypes.object
};

const mapStateToProps = (state) => {
	return {
		hidden: state.splash.hidden
	};
};

export default connect(mapStateToProps)(
	CSSModules(SplashScreen, styles)
);