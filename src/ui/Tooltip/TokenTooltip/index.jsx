import { connect } from "react-redux";
import styles from "./TokenTooltip.scss";
import { selectPlayerById } from "redux/game/session/players";

function TokenTooltip(props) {
	return (
		<div
			style={{
				left: props.x || 0,
				top: props.y - 15 || 0,
			}}
			className={styles["tooltip"]}
		>
			<div className={styles["contents"]}>
				{ props.data.name || "Player" }
			</div>
		</div>
	);
}

TokenTooltip.propTypes = {
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	entityId: React.PropTypes.string.isRequired,
	data: React.PropTypes.object,
};

const mapStateToProps = (state, props) => ({
	data: selectPlayerById(state, props.entityId),
});

export default connect(mapStateToProps)(TokenTooltip);