import { connect } from "react-redux";
import classnames from "classnames/bind";
import { getStateIsPanning } from "redux/ui/camera";
import { setSVGElement, init } from "game/camera";
import StageCanvas from "ui/StageCanvas";
import styles from "./Stage.scss";

const cx = classnames.bind({
	"cursor-grab": styles["cursor-grab"],
	"cursor-grabbing": styles["cursor-grabbing"],
});

class Stage extends React.Component {
	constructor(props) {
		super(props);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);

		// Default state
		this.state = {
			mouseDown: false,
		};
	}

	componentDidMount() {
		// At this point StageCanvas was alredy mounted and refs was stored in module
		// Now wait for DOM painting to finish before initialize svg-pan-zoom
		// http://stackoverflow.com/a/28748160/585371
		setTimeout(() => window.requestAnimationFrame(init), 0);
	}

	handleMouseDown() {
		this.setState({ mouseDown: true });
	}

	handleMouseUp() {
		this.setState({ mouseDown: false });
	}

	render() {
		return (
			<svg
				width="100%"
				height="100%"
				ref={setSVGElement}
				className={cx({
					"cursor-grab": !this.props.panning,
					"cursor-grabbing": this.props.panning || this.state.mouseDown,
				})}
			    onMouseDown={this.handleMouseDown}
			    onMouseUp={this.handleMouseUp}
			>
				<StageCanvas />
			</svg>
		);
	}
}

Stage.propTypes = {
	panning: React.PropTypes.bool,
};

const mapStateToProps = state => ({
	panning: getStateIsPanning(state),
});

export default connect(mapStateToProps)(Stage);