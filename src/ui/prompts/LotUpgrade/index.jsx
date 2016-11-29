import { connect } from "react-redux";
import PromptBox from "../components/PromptBox";
import PurchaseButton from "../components/PurchaseButton";
import { selectEntityById } from "redux/game/session/map";
import { acceptOffer, rejectOffer } from "game/session/player/offers";
import styles from "./LotUpgrade.scss";

class LotUpgradePrompt extends React.Component {
	constructor(props) {
		super(props);

		// When player rejected the offer
		this.handleClose = () => rejectOffer(this.props.promptId);
		// When player accepted the offer
		this.handleAccept = () => acceptOffer(this.props.promptId);
	}

	render() {
		return (
			<PromptBox
				title="Upgrade"
				className={styles["wrapper"]}
				closeButton={{
					title: "Decline",
					onClick: this.handleClose,
				}}
				actionButtons={
					<PurchaseButton
						title="Upgrade"
						onClick={this.handleAccept}
						value={this.props.cost}
					/>
				}
			>
				{this.props.title}
			</PromptBox>
		);
	}
}

LotUpgradePrompt.defaultProps = {
	title: "LOCATION_NAME",
	cost: 0,
};

LotUpgradePrompt.propTypes = {
	promptId: React.PropTypes.string,
	title: React.PropTypes.string,
	cost: React.PropTypes.number,
};

const mapStateToProps = (state, props) => ({
	location: selectEntityById(state, props.data.location),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	const mergedProps = {
		promptId: ownProps.promptId,
	};

	if (ownProps.data && ownProps.data.cost) {
		Object.assign(mergedProps, {
			cost: ownProps.data.cost,
		});
	}

	if (stateProps.location) {
		Object.assign(mergedProps, {
			title: stateProps.location.name,
		});
	}

	return mergedProps;
};

export default connect(mapStateToProps, null, mergeProps)(LotUpgradePrompt);
