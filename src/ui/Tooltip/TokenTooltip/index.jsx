import { connect } from "react-redux";
import styles from "./TokenTooltip.scss";
import { selectPlayerById } from "redux/game/session/players";
import { getZoom } from "redux/ui/camera";

function TokenTooltip(props) {
	return (
		<div
			style={{
				left: props.x,
				top: props.y - (5 * props.zoom),
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
	zoom: React.PropTypes.number,
};

TokenTooltip.defaultProps = {
	x: 0,
	y: 0,
};

const mapStateToProps = (state, props) => ({
	data: selectPlayerById(state, props.entityId),
	zoom: getZoom(state),
});

export default connect(mapStateToProps)(TokenTooltip);
