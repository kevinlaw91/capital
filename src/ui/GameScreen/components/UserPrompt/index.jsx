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
					duration: 200,
				}}
				leave={{
					animation: "transition.slideLeftBigOut",
					duration: 200,
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