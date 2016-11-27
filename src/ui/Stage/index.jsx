import { connect } from "react-redux";
import { isGrabbing } from "redux/ui/camera";
import {
	register,
	unregister,
	setAsReady,
} from "game/session/stage";
import Defs from "./Defs";
import Floaters from "./layers/Floaters";
import FloorLayer from "./layers/FloorLayer";
import TokenLayer from "./layers/TokenLayer";
import GroundMarkerLayer from "./layers/GroundMarkerLayer";
import styles from "./Stage.scss";

class Stage extends React.Component {
	constructor(props) {
		super(props);

		/**
		 * @public
		 * @type {?Floaters}
		 */
		this.floaters = null;

		/**
		 * @public
		 * @type {?TokenLayer}
		 */
		this.tokens = null;

		/**
		 * SVG element of stage
		 * @public
		 * @type {?SVGSVGElement}
		 */
		this.svgElement = null;

		/**
		 * Viewport element
		 * @public
		 * @type {?SVGGElement}
		 */
		this.viewportElement = null;

		// Set reference
		this.setRef = {
			floaters: ref => {
				this.floaters = ref ? ref.getWrappedInstance() : null;
			},
			tokens: ref => {
				this.tokens = ref ? ref.getWrappedInstance() : null;
			},
			viewportElement: ref => { this.viewportElement = ref; },
			svgElement: ref => { this.svgElement = ref; },
		};
	}

	componentDidMount() {
		// Register stage instance
		register(this);

		// At this point:
		// - StageCanvas was alredy mounted
		// - Refs were stored
		// We want to setup camera so stage needs to be ready
		// i.e. painted with width + height etc...
		// Wait for DOM painting to finish before setting state as ready
		// http://stackoverflow.com/a/28748160/585371
		setTimeout(() => window.requestAnimationFrame(setAsReady));
	}

	componentWillUnmount() {
		// Unregister stage instance
		unregister();
	}

	render() {
		return (
			<svg
				width="100%"
				height="100%"
				ref={this.setRef.svgElement}
				className={this.props.grabbing ? styles["cursor-grabbing"] : styles["cursor-grab"]}
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
			>
				<Defs />
				<g ref={this.setRef.viewportElement}>
					<rect width="1" height="1" fill="transparent">
						{ /* Placeholder element to prevent svg-pan-zoom from generating errors if content is empty */ }
					</rect>

					{ /* Floor */ }
					<FloorLayer />

					{ /* Ground Markers */ }
					<GroundMarkerLayer />

					{ /* Tokens */ }
					<TokenLayer ref={this.setRef.tokens} />

					{ /* Floaters */}
					<Floaters ref={this.setRef.floaters} />
				</g>
			</svg>
		);
	}
}

Stage.propTypes = {
	grabbing: React.PropTypes.bool,
	panning: React.PropTypes.bool,
};

const mapStateToProps = state => ({
	grabbing: isGrabbing(state),
});

export default connect(mapStateToProps)(Stage);
