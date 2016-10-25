import { VelocityComponent } from "velocity-react";

import { tokens as sprite } from "../../../utils/sprites";

// Offset to be applied to the sprite
const offsetY = -30;

export default function Token(props) {
	const animatedProps = {
		x: props.x,
		y: props.y + offsetY,
	};

	return (
		<VelocityComponent animation={animatedProps} duration={300}>
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
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	color: React.PropTypes.string,
};