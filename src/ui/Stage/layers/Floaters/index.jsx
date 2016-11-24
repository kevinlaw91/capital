import { connect } from "react-redux";
import {
	templates,
	actions,
	selectAllByTemplate,
} from "redux/game/stage/floaters";
import GoldChangeText from "./GoldChangeText";

class Floaters extends React.Component {
	constructor(props) {
		super(props);

		/** @public */
		this.addItem = this.props.addItem;

		/** @public */
		this.removeItem = this.props.removeItem;

		/** @public */
		this.clear = this.props.clear;
	}

	render() {
		return (
			<g>
				{ Object.entries(this.props.items.GOLD_CHANGE_TEXT).map(([id, i]) =>
					<GoldChangeText
						key={id}
						id={id}
						x={i.x}
						y={i.y}
						text={i.text}
						color={i.color}
						removeItem={this.props.removeItem}
					/>
				)}
			</g>
		);
	}
}

Floaters.propTypes = {
	items: React.PropTypes.object,
	addItem: React.PropTypes.func,
	removeItem: React.PropTypes.func,
	clear: React.PropTypes.func,
};

const mapStateToProps = state => ({
	items: {
		GOLD_CHANGE_TEXT: selectAllByTemplate(state, templates.GOLD_CHANGE_TEXT),
	},
});

const mapDispatchToProps = {
	addItem: actions.add,
	removeItem: actions.remove,
	clear: actions.clear,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{ withRef: true }
)(Floaters);