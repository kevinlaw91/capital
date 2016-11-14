import { connect } from "react-redux";
import { getStateIsPanning } from "redux/ui/camera";
import styles from "./UserPrompt.scss";
import classnames from "classnames/bind";

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
		</div>
	);
}

UserPrompt.propTypes = {
	ignoreInputs: React.PropTypes.bool,
};

const mapStateToProps = state => ({
	ignoreInputs: getStateIsPanning(state),
});

export default connect(mapStateToProps)(UserPrompt);