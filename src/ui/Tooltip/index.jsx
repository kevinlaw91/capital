import { connect } from "react-redux";
import {
	getTooltipClass,
	getTooltipPosition,
	getTooltipData,
} from "redux/ui/tooltip";
import LotTooltip from "./LotTooltip";
import TokenTooltip from "./TokenTooltip";
import styles from "./styles.scss";

function Tooltip(props) {
	let tooltip = null;

	switch (props.type) {
		case "LotTooltip":
			tooltip = <LotTooltip x={props.position.x} y={props.position.y} entityId={props.data} />;
			break;
		case "TokenTooltip":
			tooltip = <TokenTooltip x={props.position.x} y={props.position.y} entityId={props.data} />;
			break;
	}

	return (
		<div className={styles["layer"]}>
			{tooltip}
		</div>
	);
}

Tooltip.propTypes = {
	type: React.PropTypes.string,
	position: React.PropTypes.shape({
		x: React.PropTypes.number,
		y: React.PropTypes.number,
	}),
	data: React.PropTypes.any,
};

const mapStateToProps = state => ({
	type: getTooltipClass(state),
	position: getTooltipPosition(state),
	data: getTooltipData(state),
});

export default connect(mapStateToProps)(Tooltip);