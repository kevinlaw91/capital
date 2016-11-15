import { connect } from "react-redux";
import MaterialIcon from "ui/components/MaterialIcon";
import PromptBox from "../components/PromptBox";
import ActionButton from "../components/PromptBox/ActionButton";
import { selectEntityById } from "redux/game/session/map";
import { acceptOffer, rejectOffer } from "game/session/player/offers";
import styles from "./LotPurchase.scss";

const btnBuy = (price, onClick) => (
	<ActionButton
		className={styles["button-buy"]}
		title="Buy"
		icon="chevron_left"
		iconPosition="left"
		onClick={onClick}
	>
		<span className={styles["price"]}>{price}</span>
		<MaterialIcon className={styles["icon-cash"]}>local_atm</MaterialIcon>
	</ActionButton>
);

function PromptBuyLot(props) {
	// Called when player rejected the offer
	const onClose = () => {
		rejectOffer(props.promptId);
	};

	// Called when player accepted the offer
	const onAccept = () => {
		acceptOffer(props.promptId);
	};

	return (
		<PromptBox
			title="Purchase"
			className={styles["wrapper"]}
		    closeButton={{
			    title: "Decline",
		        onClick: onClose,
		    }}
			actionButtons={
				btnBuy(props.price, onAccept)
			}
		>
			{props.title}
		</PromptBox>
	);
}

PromptBuyLot.propTypes = {
	promptId: React.PropTypes.string,
	title: React.PropTypes.string,
	price: React.PropTypes.number,
	location: React.PropTypes.string,
};

const mapStateToProps = (state, props) => ({
	title: selectEntityById(state, props.location).name,
	price: selectEntityById(state, props.location).price,
});

export default connect(mapStateToProps)(PromptBuyLot);