import { connect } from "react-redux";
import { actions as tooltipActions } from "redux/ui/tooltip";
import FloorTile from "./FloorTile";

function TooltipFloorTile(props) {
	const {
		tooltip,
		...otherProps,
	} = props;

	const handleMouseEnter = () => {
		// Show Tooltip
		props.dispatch(
			tooltipActions.show("LotTooltip", tooltip)
		);
	};

	const handleMouseMove = evt => {
		// Move tooltip
		const { left, top, width, height } = evt.target.getBoundingClientRect();
		props.dispatch(
			tooltipActions.move(left + (width / 2), top + (height / 2))
		);
	};

	const handleMouseOut = () => {
		props.dispatch(
			tooltipActions.hide()
		);
	};

	return (
		<g
			onMouseEnter={handleMouseEnter}
			onMouseMove={handleMouseMove}
			onMouseOut={handleMouseOut}
		>
			<FloorTile {...otherProps} />
		</g>
	);
}

TooltipFloorTile.propTypes = {
	dispatch: React.PropTypes.func,
	tooltip: React.PropTypes.string,
};

export default connect()(TooltipFloorTile);