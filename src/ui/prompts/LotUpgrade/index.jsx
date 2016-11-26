import { connect } from "react-redux";
import MaterialIcon from "ui/components/MaterialIcon";
import PromptBox from "../components/PromptBox";
import ActionButton from "../components/PromptBox/ActionButton";
import { selectEntityById } from "redux/game/session/map";
import { acceptOffer, rejectOffer } from "game/session/player/offers";
import styles from "./LotUpgrade.scss";

const btnBuy = (cost, onClick) => (
	<ActionButton
		className={styles["button-upgrade"]}
		title="Upgrade"
		icon="chevron_left"
		iconPosition="left"
		onClick={onClick}
	>
		<span className={styles["cost"]}>{cost}</span>
		<MaterialIcon className={styles["icon-cash"]}>local_atm</MaterialIcon>
	</ActionButton>
);

function PromptLotUpgrade(props) {
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
			title="Upgrade"
			className={styles["wrapper"]}
		    closeButton={{
			    title: "Decline",
		        onClick: onClose,
		    }}
			actionButtons={
				btnBuy(props.cost, onAccept)
			}
		>
			{props.title}
		</PromptBox>
	);
}

PromptLotUpgrade.propTypes = {
	promptId: React.PropTypes.string,
	title: React.PropTypes.string,
	cost: React.PropTypes.number,
	location: React.PropTypes.string,
};

const mapStateToProps = (state, props) => ({
	title: selectEntityById(state, props.location).name,
});

export default connect(mapStateToProps)(PromptLotUpgrade);
