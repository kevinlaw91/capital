import DiceButton from "../DiceButton";
import UserPrompt from "../UserPrompt";
import styles from "./OverlayPanel.scss";

export default function OverlayPanel(props) {
	return (
		<section className={styles["container"]}>
			<div className={styles["layer-dice-button"]}>
				<DiceButton />
			</div>
			<div className={styles["layer-prompt"]}>
				<UserPrompt />
			</div>
		</section>
	);
}