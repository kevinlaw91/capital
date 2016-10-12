import { connect } from "react-redux";
import Token from "../components/Token";

function renderToken(entry) {
	return (
		<Token
			x={entry.position.x}
			y={entry.position.y}
			color={entry.color}
		/>
	);
}

function TokenLayer(props) {
	return (
		<g>
			{ props.tokens.map(renderToken) }
		</g>
	);
}

TokenLayer.propTypes = {
	tokens: React.PropTypes.array,
};

const mapStateToProps = (state) => {
	return {
		tokens: state.game.tokens,
	};
};

export default connect(mapStateToProps)(TokenLayer);