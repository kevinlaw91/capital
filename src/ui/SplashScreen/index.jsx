import CSSModules from "react-css-modules";
import styles from "./SplashScreen.scss";

function SplashScreen() {
	return (
		<section styleName="wrapper">
			<div>LOADING</div>
		</section>
	);
}

export default CSSModules(SplashScreen, styles);