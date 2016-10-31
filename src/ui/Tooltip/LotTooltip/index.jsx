import CSSModules from "react-css-modules";
import { connect } from "react-redux";

import styles from "./LotTooltip.scss";

import { selectEntityById } from "../../../redux/game/session/map";

function LotTooltip(props) {
	return (
		<div
			style={{
				left: props.x || 0,
				top: props.y + 35 || 0,
			}}
			styleName="tooltip"
		>
			<div styleName="contents">
				{ props.data.name }
			</div>
		</div>
	);
}

LotTooltip.propTypes = {
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	lot: React.PropTypes.string.isRequired,
	data: React.PropTypes.object,
};

const mapStateToProps = (state, props) => ({
	data: selectEntityById(state, props.lot),
});

export default connect(mapStateToProps)(
	CSSModules(LotTooltip, styles)
);