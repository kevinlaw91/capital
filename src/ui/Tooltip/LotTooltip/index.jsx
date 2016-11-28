import { connect } from "react-redux";
import styles from "./LotTooltip.scss";
import { selectEntityById } from "redux/game/session/map";
import { getZoom } from "redux/ui/camera";

function LotTooltip(props) {
	return (
		<div
			style={{
				left: props.x,
				top: props.y - (7 * props.zoom),
			}}
			className={styles["tooltip"]}
		>
			<div className={styles["contents"]}>
				{ props.data.name }
			</div>
		</div>
	);
}

LotTooltip.defaultProps = {
	x: 0,
	y: 0,
};

LotTooltip.propTypes = {
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	entityId: React.PropTypes.string.isRequired,
	data: React.PropTypes.object,
	zoom: React.PropTypes.number,
};

const mapStateToProps = (state, props) => ({
	data: selectEntityById(state, props.entityId),
	zoom: getZoom(state),
});

export default connect(mapStateToProps)(LotTooltip);
