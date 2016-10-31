import { connect } from "react-redux";

import Token from "./Token/index";

import tokenPosition from "../utils/tokenPosition";
import { getTopFaceMidpoint } from "../../../utils/coordinates";

import { selectOrder as selectTokenOrder } from "../../../../redux/game/stage/token/order";
import { selectAllTokens } from "../../../../redux/game/stage/token/items";
import { selectActivePlayerId } from "../../../../redux/game/session/turn";

function renderToken(id, entry) {
	let screenX, screenY;

	if (entry.position) {
		if (typeof entry.position === "string") {
			// Position is a property lot id
			// Based on the id,
			// get the grid x,y for placing the token
			const grid = tokenPosition(entry.position);

			// Transform grid x,y to screen x,y
			[screenX, screenY] = getTopFaceMidpoint(grid.y, grid.x);
		} else {
			// Position is an object with x and y props
			({ x: screenX, y: screenY } = entry.position);
		}
	} else {
		// Move to origin if position undefined
		screenX = screenY = 0;
	}

	return (
		<Token
			key={id}
			color={entry.color || "white"}
			x={screenX}
			y={screenY}
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