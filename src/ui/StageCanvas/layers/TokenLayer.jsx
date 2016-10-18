import { connect } from "react-redux";
import Token from "./components/Token";

function renderToken(id, entry) {
	return (
		<Token
			key={id}
			color={entry.color}
			x={entry.x}
			y={entry.y}
		/>
	);
}

function TokenLayer(props) {
	return (
		<g>
			{ Object.keys(props.tokens).map(k => renderToken(k, props.tokens[k])) }
		</g>
	);
}

TokenLayer.propTypes = {
	tokens: React.PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		tokens: state.game.stage.tokens,
	};
};

export default connect(mapStateToProps)(TokenLayer);