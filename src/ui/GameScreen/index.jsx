import Stage from "./components/Stage";
import OverlayPanel from "./components/OverlayPanel";
import styles from "./GameScreen.scss";

export default function GameScreen(props) {
	return (
		<section className={styles["main"]}>
			<Stage />
			<OverlayPanel />
		</section>
	);
}