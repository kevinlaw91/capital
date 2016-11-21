import { connect } from "react-redux";
import Token from "./Token";
import { getScreenOffset } from "game/map/tile/tokenPosition";
import { selectOrder as selectTokenOrder } from "redux/game/stage/token/order";
import { selectAllTokens } from "redux/game/stage/token/items";
import { selectActivePlayerId } from "redux/game/session/turn";

function renderToken(id, entry) {
	let x, y;

	if (entry.position) {
		({ x, y } = (typeof entry.position === "string") ?
			getScreenOffset(entry.position) : entry.position
		);
	}

	return (
		<Token
			key={id}
			tokenId={id}
			color={entry.color}
			x={x}
			y={y}
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