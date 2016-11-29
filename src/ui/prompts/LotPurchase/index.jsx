import { connect } from "react-redux";
import PromptBox from "../components/PromptBox";
import PurchaseButton from "../components/PurchaseButton";
import { selectEntityById } from "redux/game/session/map";
import { acceptOffer, rejectOffer } from "game/session/player/offers";
import styles from "./LotPurchase.scss";

class LotPurchasePrompt extends React.Component {
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
				title="Purchase"
				className={styles["wrapper"]}
				closeButton={{
					title: "Decline",
					onClick: this.handleClose,
				}}
				actionButtons={
					<PurchaseButton
						title="Buy"
						onClick={this.handleAccept}
						value={this.props.price}
					/>
				}
			>
				{this.props.title}
			</PromptBox>
		);
	}
}

LotPurchasePrompt.defaultProps = {
	title: "LOCATION_NAME",
	price: 0,
};

LotPurchasePrompt.propTypes = {
	promptId: React.PropTypes.string,
	data: React.PropTypes.object,
	title: React.PropTypes.string,
	price: React.PropTypes.number,
};

const mapStateToProps = (state, props) => ({
	location: selectEntityById(state, props.data.location)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	const mergedProps = {
		promptId: ownProps.promptId,
	};

	if (stateProps.location) {
		Object.assign(mergedProps, {
			title: stateProps.location.name,
			price: stateProps.location.price,
		});
	}

	return mergedProps;
};

export default connect(mapStateToProps, null, mergeProps)(LotPurchasePrompt);
