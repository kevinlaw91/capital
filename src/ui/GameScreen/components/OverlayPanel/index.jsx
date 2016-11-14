import CSSModules from "react-css-modules";
import styles from "./OverlayPanel.scss";
import DiceButton from "./DiceButton";
import UserPrompt from "./UserPrompt";

function OverlayPanel() {
	return (
		<section styleName="container">
			<div styleName="layer-dice-button">
				<DiceButton />
			</div>
			<div styleName="layer-prompt">
				<UserPrompt />
			</div>
		</section>
	);
}

OverlayPanel.propTypes = {
	styles: React.PropTypes.object,
};

export default CSSModules(OverlayPanel, styles);