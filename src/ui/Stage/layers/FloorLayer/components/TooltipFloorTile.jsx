import { connect } from "react-redux";
import { actions as tooltipActions } from "redux/ui/tooltip";
import FloorTile from "./FloorTile";

class TooltipFloorTile extends React.Component {
	constructor(props) {
		super(props);

		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
	}

	handleMouseEnter(evt) {
		// Show Tooltip
		this.props.dispatch(
			tooltipActions.show("LotTooltip", this.props.tooltip)
		);
	}

	handleMouseMove(evt) {
		// Move tooltip
		const { left, top, width, height } = evt.target.getBoundingClientRect();
		this.props.dispatch(
			tooltipActions.move(left + (width / 2), top + (height / 2))
		);
	}

	handleMouseOut(evt) {
		this.props.dispatch(
			tooltipActions.hide()
		);
	}

	render() {
		const {
			/* eslint-disable no-unused-vars */
			// Consumed
			tooltip,
			dispatch,
			/* eslint-enable no-unused-vars */
			...otherProps,
		} = this.props;

		return (
			<g
				onMouseEnter={this.handleMouseEnter}
				onMouseMove={this.handleMouseMove}
				onMouseOut={this.handleMouseOut}
			>
				<FloorTile {...otherProps} />
			</g>
		);
	}
}

TooltipFloorTile.propTypes = {
	dispatch: React.PropTypes.func,
	tooltip: React.PropTypes.string,
};

export default connect()(TooltipFloorTile);
