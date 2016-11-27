import { connect } from "react-redux";
import PromptBox from "../components/PromptBox";
import PurchaseButton from "../components/PurchaseButton";
import { selectEntityById } from "redux/game/session/map";
import { acceptOffer, rejectOffer } from "game/session/player/offers";
import styles from "./LotPurchase.scss";

class PromptBuyLot extends React.Component {
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

PromptBuyLot.propTypes = {
	promptId: React.PropTypes.string,
	title: React.PropTypes.string,
	price: React.PropTypes.number,
};

const mapStateToProps = (state, props) => ({
	title: selectEntityById(state, props.location).name,
	price: selectEntityById(state, props.location).price,
});

export default connect(mapStateToProps)(PromptBuyLot);
