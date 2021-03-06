import { connect } from "react-redux";
import classNames from "classnames/bind";
import { VelocityComponent } from "velocity-react";
import {
	getStateHidden,
	getStateDisabled,
	getStateIndeterminate,
} from "redux/ui/dice";
import { isPanning } from "redux/ui/camera";
import { click } from "game/rules/dice/click";
import styles from "./DiceButton.scss";

let cx = classNames.bind({
	"circle": styles["circle"],
	"circle-disabled": styles["circle-disabled"],
	"circle-ignore": styles["circle-ignore"],
	"circle-hover": styles["circle-hover"],
	"circle-pressed": styles["circle-pressed"],
	"circle-indeterminate": styles["circle-indeterminate"],
	"container": styles["container"],
	"container-indeterminate": styles["container-indeterminate"],
});

class DiceButton extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.state = {
			hover: false,
			pressed: false,
		};
	}

	handleClick() { !this.props.disabled && click(); }
	handleMouseEnter() { this.setState({ hover: true }); }
	handleMouseLeave() { this.setState({ pressed: false, hover: false }); }
	handleMouseDown() { this.setState({ pressed: true }); }
	handleMouseUp() { this.setState({ pressed: false }); }

	render() {
		let svgStyle = cx({
			"container": true,
			"container-indeterminate": this.props.indeterminate,
		});

		let circleStyle = cx({
			"circle": true,
			"circle-disabled": this.props.disabled,
			"circle-hover": !this.props.disabled && !this.props.indeterminate && this.state.hover,
			"circle-ignore": this.props.ignoreInputs,
			"circle-pressed": !this.props.disabled && !this.props.indeterminate && this.state.pressed,
			"circle-indeterminate": this.props.indeterminate,
		});

		return (
			<svg className={svgStyle}>
				<VelocityComponent
					animation={this.props.hidden ? "transition.expandOut": "transition.shrinkIn"}
					duration={200}
				>
					<circle
						cx="53" cy="53" r="40"
						className={circleStyle}
						onClick={this.handleClick}
						onMouseEnter={this.handleMouseEnter}
						onMouseLeave={this.handleMouseLeave}
						onMouseDown={this.handleMouseDown}
						onMouseUp={this.handleMouseUp}
					/>
				</VelocityComponent>
			</svg>
		);
	}
}

DiceButton.propTypes = {
	ignoreInputs: React.PropTypes.bool,
	hidden: React.PropTypes.bool,
	disabled: React.PropTypes.bool,
	indeterminate: React.PropTypes.bool,
};

const mapStateToProps = state => ({
	ignoreInputs: isPanning(state),
	hidden: getStateHidden(state),
	disabled: getStateDisabled(state),
	indeterminate: getStateIndeterminate(state),
});

export default connect(mapStateToProps)(DiceButton);