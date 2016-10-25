import { connect } from "react-redux";

import Token from "./components/Token";

import { selectOrder as selectTokenOrder } from "../../../redux/game/stage/token/order";
import { selectAllTokens } from "../../../redux/game/stage/token/items";
import { selectActivePlayerId } from "../../../redux/game/session/turn";

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
	return (
		<g>
			{ props.order.map(k => renderToken(k, props.tokens[k])) }
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
	order: selectTokenOrder(state),
	tokens: selectAllTokens(state),
});

export default connect(mapStateToProps)(TokenLayer);