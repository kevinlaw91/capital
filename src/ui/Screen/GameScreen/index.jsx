import Screen from "../Screen";
import Stage from "./Components/Stage";
import OverlayPanel from "./components/OverlayPanel";
import CSSModules from "react-css-modules";

import styles from "./GameScreen.scss";

function GameScreen(props) {
	return (
		<Screen fullscreen>
			<section className={props.styles["main"]}>
				<Stage />
				<OverlayPanel />
			</section>
		</Screen>
	);
}

GameScreen.propTypes = {
	styles: React.PropTypes.object
};

export default CSSModules(GameScreen, styles);