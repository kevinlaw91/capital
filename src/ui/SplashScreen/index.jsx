import CSSModules from "react-css-modules";
import styles from "./SplashScreen.scss";

function SplashScreen() {
	return (
		<section styleName="wrapper">
			<span>LOADING</span>
		</section>
	);
}

export default CSSModules(SplashScreen, styles);