import { connect } from "react-redux";
import { VelocityTransitionGroup } from "velocity-react";
import { getScreenOffset } from "game/map/tile/tokenPosition";
import { selectOrder as selectTokenOrder } from "redux/game/stage/token/order";
import { selectAllTokens } from "redux/game/stage/token/items";
import { selectAllEntities } from "redux/game/session/map";
import { selectAllPlayers } from "redux/game/session/players";
import { selectActivePlayerId } from "redux/game/session/turn";
import ActiveMarker from "./ActiveMarker";
import PropertyColorBar from "./PropertyColorBar";
import { token as animation } from "game/config/animations";

function renderActiveMarker(id, token) {
	if (!id || !token) {
		return;
	}

	let x, y;

	if (token.position) {
		({ x, y } = (typeof token.position === "string") ?
			getScreenOffset(token.position) : token.position
		);
	}

	return (
		<ActiveMarker
			key={id}
			x={x}
			y={y}
		    idle={token.idle}
		/>
	);
}

function renderPropertyColorBar(id, color) {
	return (
		<PropertyColorBar
			key={id}
			location={id}
		    color={color}
		/>
	);
}

function GroundMarkerLayer(props) {
	return (
		<g>
			<g>
				{
					Object
						.entries(props.map)
						.map(([id, lot]) => {
							return renderPropertyColorBar(
								id,
								lot.owner && props.players[lot.owner].color
							);
						})
				}
			</g>
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
		</g>
	);
}

GroundMarkerLayer.propTypes = {
	tokens: React.PropTypes.object,
	order: React.PropTypes.arrayOf(React.PropTypes.string),
	players: React.PropTypes.object,
	map: React.PropTypes.object,
	active: React.PropTypes.string,
};

const mapStateToProps = state => ({
	active: selectActivePlayerId(state),
	order: selectTokenOrder(state),
	players: selectAllPlayers(state),
	map: selectAllEntities(state),
	tokens: selectAllTokens(state),
});

export default connect(mapStateToProps)(GroundMarkerLayer);
