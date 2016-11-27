import { connect } from "react-redux";
import PromptBox from "../components/PromptBox";
import PurchaseButton from "../components/PurchaseButton";
import { selectEntityById } from "redux/game/session/map";
import { acceptOffer, rejectOffer } from "game/session/player/offers";
import styles from "./LotUpgrade.scss";

class PromptLotUpgrade extends React.Component {
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

PromptLotUpgrade.propTypes = {
	promptId: React.PropTypes.string,
	title: React.PropTypes.string,
	cost: React.PropTypes.number,
};

const mapStateToProps = (state, props) => ({
	title: selectEntityById(state, props.location).name,
});

export default connect(mapStateToProps)(PromptLotUpgrade);
