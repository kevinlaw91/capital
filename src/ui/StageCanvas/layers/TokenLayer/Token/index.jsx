import { VelocityComponent } from "velocity-react";

import { token as animation } from "../../../../../game/config/animations";

import { tokens as sprite } from "../../../../utils/sprites";

// Offset to be applied to the sprite
const offsetX = -32;
const offsetY = -43;

export default function Token(props) {
	const animatedProps = {
		x: props.x + offsetX,
		y: props.y + offsetY,
	};

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
			/>
		</VelocityComponent>
	);
}

Token.propTypes = {
	x: React.PropTypes.number.isRequired,
	y: React.PropTypes.number.isRequired,
	color: React.PropTypes.string.isRequired,
	onMove: React.PropTypes.func,
};