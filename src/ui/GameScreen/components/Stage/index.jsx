import { connect } from "react-redux";
import { isGrabbing } from "redux/ui/camera";
import { setSVGElement, init } from "game/camera";
import StageCanvas from "ui/StageCanvas";
import styles from "./Stage.scss";

class Stage extends React.Component {
	componentDidMount() {
		// At this point StageCanvas was alredy mounted and refs was stored in module
		// Now wait for DOM painting to finish before initialize svg-pan-zoom
		// http://stackoverflow.com/a/28748160/585371
		setTimeout(() => window.requestAnimationFrame(init), 0);
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
				<StageCanvas />
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