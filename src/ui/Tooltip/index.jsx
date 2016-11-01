import CSSModules from "react-css-modules";

import { connect } from "react-redux";
import { getTooltipClass, getTooltipData } from "../../redux/ui/tooltip";

import LotTooltip from "./LotTooltip";
import TokenTooltip from "./TokenTooltip";

import styles from "./styles.scss";

function Tooltip(props) {
	let tooltip = null;

	switch (props.type) {
		case "LotTooltip":
			tooltip = <LotTooltip x={props.data.x} y={props.data.y} lot={props.data.lot} />;
			break;
		case "TokenTooltip":
			tooltip = <TokenTooltip x={props.data.x} y={props.data.y} player={props.data.player} />;
			break;
	}

	return (
		<div styleName="layer">
			{tooltip}
		</div>
	);
}

Tooltip.propTypes = {
	type: React.PropTypes.string,
	data: React.PropTypes.object,
};

const mapStateToProps = state => ({
	type: getTooltipClass(state),
	data: getTooltipData(state),
});

export default connect(mapStateToProps)(
	CSSModules(Tooltip, styles)
);