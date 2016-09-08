import Screen from "../Screen";

import { connect } from "react-redux";
import CSSModules from "react-css-modules";
import { VelocityComponent } from "velocity-react";

import styles from "./splash.scss";

function SplashScreen(props) {
	return (
		<VelocityComponent
			animation={{ opacity: (props.hidden ? 0 : 1) }}
			duration={ 300 }
			display={ props.hidden ? "none" : null } >
			<Screen fullscreen className={ props.styles.wrapper }> LOADING </Screen>
		</VelocityComponent>
	);
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