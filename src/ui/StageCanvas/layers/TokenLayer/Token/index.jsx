import { VelocityComponent } from "velocity-react";
import { connect } from "react-redux";

import { token as animation } from "../../../../../game/config/animations";

import { tokens as sprite } from "../../../../utils/sprites";

import { actions as tooltipActions } from "../../../../../redux/ui/tooltip";

// Offset to be applied to the sprite
const offsetX = -32;
const offsetY = -43;

function Token(props) {
	const animatedProps = {
		x: props.x + offsetX,
		y: props.y + offsetY,
	};

	function handleMouseEnter(evt) {
		// Show tooltip
		const { left, top, width, height } = evt.target.getBoundingClientRect();
		props.showTooltip("TokenTooltip", {
			player: props.tooltip,
			x: left + (width / 2),
			y: top + (height / 2),
		});
	}

	const handleMouseOut = props.hideTooltip;

	return (
		<VelocityComponent
			animation={animatedProps}
			duration={animation.DURATION_MOVE}
			complete={props.onMove}
		>
			<use
				width={64}
				height={64}
				xlinkHref={ sprite(props.color) }
				style={{
					"shapeRendering": "crispEdges",
				}}
				onMouseEnter={handleMouseEnter}
				onMouseOut={handleMouseOut}
			/>
		</VelocityComponent>
	);
}

Token.propTypes = {
	x: React.PropTypes.number.isRequired,
	y: React.PropTypes.number.isRequired,
	color: React.PropTypes.string.isRequired,
	onMove: React.PropTypes.func,
	tooltip: React.PropTypes.string,
	showTooltip: React.PropTypes.func,
	hideTooltip: React.PropTypes.func,
};

export default connect(null, {
	showTooltip: tooltipActions.show,
	hideTooltip: tooltipActions.hide,
})(Token);