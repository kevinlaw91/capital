import { connect } from "react-redux";
import { VelocityTransitionGroup } from "velocity-react";
import { isPanning } from "redux/ui/camera";
import { selectAllPrompts } from "redux/ui/prompts";
import styles from "./UserPrompt.scss";
import classnames from "classnames/bind";
import inflate from "./inflate";

const cx = classnames.bind({
	"accept-inputs": styles["accept-inputs"],
	"translucent": styles["translucent"],
});

const DEFAULT_TRANSITION_DURATION = 200;
let duration = DEFAULT_TRANSITION_DURATION;

export function enableTransitions() {
	duration = DEFAULT_TRANSITION_DURATION;
}

export function disableTransitions() {
	duration = 0;
}

function UserPrompt(props) {
	return (
		<div
			className={cx({
				"accept-inputs": !props.ignoreInputs,
				"translucent": props.ignoreInputs,
			})}
		>
			<VelocityTransitionGroup
				enter={{
					animation: "transition.slideLeftBigIn",
					duration,
				}}
				leave={{
					animation: "transition.slideLeftBigOut",
					duration,
				}}
				component="div"
			>
				{ Object.entries(props.items).map(inflate) }
			</VelocityTransitionGroup>
		</div>
	);
}

UserPrompt.propTypes = {
	ignoreInputs: React.PropTypes.bool,
	items: React.PropTypes.object,
};

const mapStateToProps = state => ({
	ignoreInputs: isPanning(state),
	items: selectAllPrompts(state),
});

export default connect(mapStateToProps)(UserPrompt);
