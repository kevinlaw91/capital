import { connect } from "react-redux";

import Token from "./components/Token";

import { selectAllTokens } from "../../../redux/game/stage/tokens";
import {
	selectActivePlayerId,
	selectTurnOrder,
} from "../../../redux/game/session/turn";

function renderToken(id, entry) {
	return (
		<Token
			key={id}
			color={entry.color}
			x={entry.x}
			y={entry.y}
		    onMove={entry.onMove}
		/>
	);
}

function TokenLayer(props) {
	// Render active token separately
	// to make it always on top
	let inactive, active;
	if (props.order && props.active) {
		inactive = props.order
		                .filter(token => token !== props.active)
		                .map(k => renderToken(k, props.tokens[k]));
		active = renderToken(props.active, props.tokens[props.active]);
	}

	return (
		<g>
			{inactive}
			{active}
		</g>
	);
}

TokenLayer.propTypes = {
	tokens: React.PropTypes.object,
	order: React.PropTypes.arrayOf(React.PropTypes.string),
	active: React.PropTypes.string,
};

const mapStateToProps = state => ({
	active: selectActivePlayerId(state),
	order: selectTurnOrder(state),
	tokens: selectAllTokens(state),
});

export default connect(mapStateToProps)(TokenLayer);