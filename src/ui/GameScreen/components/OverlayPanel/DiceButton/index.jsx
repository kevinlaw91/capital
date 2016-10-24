import { connect } from "react-redux";
import CSSModules from "react-css-modules";
import classNames from "classnames/bind";

import {
	getStateDisabled,
	getStateIndeterminate
} from "../../../../../redux/ui/dice";
import { getStateIsPanning } from "../../../../../redux/ui/camera";

import styles from "./DiceButton.scss";
import onClick from "../../../../../game/rules/dice/onclick";

let cx = classNames.bind({
	"circle-ignore": styles["circle-ignore"],
	"circle-hover": styles["circle-hover"],
	"circle-pressed": styles["circle-pressed"],
	"circle-indeterminate": styles["circle-indeterminate"],
	"container-indeterminate": styles["container-indeterminate"],
	"container-disabled": styles["container-disabled"],
});

class DiceButton extends React.Component {
	constructor(props) {
		super(props);

		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);

		this.state = {
			hover: false,
			pressed: false,
		};
	}

	handleMouseEnter() { this.setState({ hover: true }); }
	handleMouseLeave() { this.setState({ pressed: false, hover: false }); }
	handleMouseDown() { this.setState({ pressed: true }); }
	handleMouseUp() { this.setState({ pressed: false }); }

	render() {
		let svgStyle = cx({
			"container-disabled": this.props.disabled,
			"container-indeterminate": this.props.indeterminate,
		});

		let circleStyle = cx({
			"circle-hover": !this.props.disabled && !this.props.indeterminate && this.state.hover,
			"circle-ignore": this.props.ignoreInputs,
			"circle-pressed": !this.props.disabled && !this.props.indeterminate && this.state.pressed,
			"circle-indeterminate": this.props.indeterminate,
		});

		return (
			<svg
				styleName="container"
				className={svgStyle}
			>
				<circle
					cx="53" cy="53" r="40"
					className={circleStyle}
					styleName="circle"
					onClick={onClick}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
					onMouseDown={this.handleMouseDown}
					onMouseUp={this.handleMouseUp}
				/>
			</svg>
		);
	}
}

DiceButton.propTypes = {
	ignoreInputs: React.PropTypes.bool,
	disabled: React.PropTypes.bool,
	indeterminate: React.PropTypes.bool,
};

const mapStateToProps = state => ({
	ignoreInputs: getStateIsPanning(state),
	disabled: getStateDisabled(state),
	indeterminate: getStateIndeterminate(state),
});

export default connect(mapStateToProps)(
	CSSModules(DiceButton, styles)
);