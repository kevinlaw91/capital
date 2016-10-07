import DiceButton from "../DiceButton";
import CSSModules from "react-css-modules";
import styles from "./OverlayPanel.scss";

function OverlayPanel() {
	return (
		<section styleName="container">
			<DiceButton />
		</section>
	);
}

OverlayPanel.propTypes = {
	styles: React.PropTypes.object,
};

export default CSSModules(OverlayPanel, styles);