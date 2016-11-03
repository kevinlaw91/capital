import CSSModules from "react-css-modules";
import { VelocityComponent } from "velocity-react";
import { token as animation } from "game/config/animations";
import styles from "./styles.scss";

function ActiveMarker(props) {
	const idleTransitions = {
		animation: {
			opacity: (props.idle ? 1 : 0),
		},
		duration: animation.DURATION_ACTIVE_INDICATOR_TRANSITION,
	};

	return (
		// Root <g> element will be used for token enter/leave transition effects
		<g>
			<VelocityComponent {...idleTransitions}>
				{ /* This wrapper <g> will be used for idle state transitions */ }
				<g>
					<g transform={`translate(${props.x}, ${props.y})`}>
						<g transform="translate(-37, -18.5) scale(1, 0.5)">
							<circle cx="37" cy="37" r="37" styleName="circle" />
						</g>
					</g>
				</g>
			</VelocityComponent>
		</g>
	);
}

ActiveMarker.propTypes = {
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	idle: React.PropTypes.bool,
};

export default CSSModules(ActiveMarker, styles);