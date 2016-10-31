import { connect } from "react-redux";
import { VelocityTransitionGroup } from "velocity-react";

import { getTopFaceMidpoint } from "../../utils/coordinates";
import tokenPosition from "../../utils/tokenPosition";

import { selectOrder as selectTokenOrder } from "../../../../redux/game/stage/token/order";
import { selectAllTokens } from "../../../../redux/game/stage/token/items";
import { selectActivePlayerId } from "../../../../redux/game/session/turn";

import ActiveMarker from "./ActiveMarker";

import { token as animation } from "../../../../game/config/animations";

function renderActiveMarker(id, token) {
	if (!id || !token) {
		return;
	}

	let screenX, screenY;

	if (token.position) {
		if (typeof token.position === "string") {
			// Position is a property lot id
			// Based on the id,
			// get the grid x,y for placing the token
			const grid = tokenPosition(token.position);

			// Transform grid x,y to screen x,y
			[screenX, screenY] = getTopFaceMidpoint(grid.y, grid.x);
		} else {
			// Position is an object with x and y props
			({ x: screenX, y: screenY } = token.position);
		}
	} else {
		// Move to origin if position undefined
		screenX = screenY = 0;
	}

	return (
		<ActiveMarker
			key={id}
			x={screenX}
			y={screenY}
		    idle={token.idle}
		/>
	);
}

function GroundMarkerLayer(props) {
	return (
		<g>
			<VelocityTransitionGroup
				enter={{
					animation: {
						opacity: 1,
						translateY: 0,
					},
					duration: animation.DURATION_ACTIVE_INDICATOR_TRANSITION,
				}}
				leave={{
					animation: {
						opacity: 0,
						translateY: -10,
					},
					duration: animation.DURATION_ACTIVE_INDICATOR_TRANSITION,
				}}
			    component="g"
			>
				{ renderActiveMarker(props.active, props.tokens[props.active]) }
			</VelocityTransitionGroup>
		</g>
	);
}


GroundMarkerLayer.propTypes = {
	tokens: React.PropTypes.object,
	order: React.PropTypes.arrayOf(React.PropTypes.string),
	active: React.PropTypes.string,
};

const mapStateToProps = state => ({
	active: selectActivePlayerId(state),
	order: selectTokenOrder(state),
	tokens: selectAllTokens(state),
});

export default connect(mapStateToProps)(GroundMarkerLayer);