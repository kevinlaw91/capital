import { connect } from "react-redux";
import { isGrabbing } from "redux/ui/camera";
import {
	setSVGElement,
	setViewportElement,
	init,
} from "game/camera";
import {
	register,
	unregister,
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
		this.setRef_floaters = ref => {
			this.floaters = ref.getWrappedInstance();
		};
	}

	componentDidMount() {
		// Register stage instance
		register(this);

		// At this point StageCanvas was alredy mounted and refs was stored in module
		// Now wait for DOM painting to finish before initialize svg-pan-zoom
		// http://stackoverflow.com/a/28748160/585371
		setTimeout(() => window.requestAnimationFrame(init), 0);
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
				ref={setSVGElement}
				className={this.props.grabbing ? styles["cursor-grabbing"] : styles["cursor-grab"]}
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
			>
				<Defs />
				<g ref={ setViewportElement }>
					<rect width="1" height="1" fill="transparent">
						{ /* Placeholder element to prevent svg-pan-zoom from generating errors if content is empty */ }
					</rect>

					{ /* Floor */ }
					<FloorLayer />

					{ /* Ground Markers */ }
					<GroundMarkerLayer />

					{ /* Tokens */ }
					<TokenLayer />

					{ /* Floaters */}
					<Floaters ref={this.setRef_floaters} />
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