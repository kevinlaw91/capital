import { VelocityComponent } from "velocity-react";

import { tokens as sprite } from "../../../utils/sprites";

// Offset to be applied to the sprite
const offsetX = -32;
const offsetY = -43;

export default function Token(props) {
	const animatedProps = {
		x: props.x + offsetX,
		y: props.y + offsetY,
	};

	return (
		<VelocityComponent animation={animatedProps} duration={300} complete={props.onMove}>
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
	onMove: React.PropTypes.func,
};