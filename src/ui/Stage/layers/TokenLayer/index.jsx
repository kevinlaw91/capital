import { connect } from "react-redux";
import Token from "./Token";
import { getScreenOffset } from "game/map/tile/tokenPosition";
import { selectOrder as selectTokenOrder } from "redux/game/stage/token/order";
import { selectAllTokens } from "redux/game/stage/token/items";
import { selectActivePlayerId } from "redux/game/session/turn";

class TokenLayer extends React.Component {
	constructor(props) {
		super(props);

		/** Register instances */
		this.items = new Map();
		this.registerToken = (id, instance) => this.items.set(id, instance);
		this.unregisterToken = id => this.items.delete(id);

		/**
		 * Find instance of Token by player id
		 * @public
		 */
		this.find = id => this.items.get(id);
	}

	render() {
		function renderToken(id, register, unregister, entry) {
			let x, y;

			if (entry.position) {
				({ x, y } = (typeof entry.position === "string") ?
						getScreenOffset(entry.position) : entry.position
				);
			}

			return (
				<Token
					key={id}
					register={register}
					unregister={unregister}
					tokenId={id}
					color={entry.color}
					x={x}
					y={y}
				/>
			);
		}

		return (
			<g>
				{
					this.props.order.map(k => renderToken(
						k,
						this.registerToken,
						this.unregisterToken,
						this.props.tokens[k]
					))
				}
			</g>
		);
	}
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

export default connect(
	mapStateToProps,
	null,
	null,
	{ withRef: true }
)(TokenLayer);