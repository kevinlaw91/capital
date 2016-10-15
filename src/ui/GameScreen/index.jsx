import Stage from "./components/Stage";
import OverlayPanel from "./components/OverlayPanel";
import CSSModules from "react-css-modules";

import styles from "./GameScreen.scss";

function GameScreen(props) {
	return (
		<section className={props.styles["main"]}>
			<Stage />
			<OverlayPanel />
		</section>
	);
}

GameScreen.propTypes = {
	styles: React.PropTypes.object
};

export default CSSModules(GameScreen, styles);