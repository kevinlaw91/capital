import CSSModules from "react-css-modules";
import { connect } from "react-redux";
import styles from "./TokenTooltip.scss";
import { selectPlayerById } from "redux/game/session/players";

function TokenTooltip(props) {
	return (
		<div
			style={{
				left: props.x || 0,
				top: props.y - 20 || 0,
			}}
			styleName="tooltip"
		>
			<div styleName="contents">
				{ props.data.name || "Player" }
			</div>
		</div>
	);
}

TokenTooltip.propTypes = {
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	player: React.PropTypes.string.isRequired,
	data: React.PropTypes.object,
};

const mapStateToProps = (state, props) => ({
	data: selectPlayerById(state, props.player),
});

export default connect(mapStateToProps)(
	CSSModules(TokenTooltip, styles)
);