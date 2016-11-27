import MaterialIcon from "ui/components/MaterialIcon";
import ActionButton from "../ActionButton";
import styles from "./PurchaseButton.scss";

export default function PurchaseButton(props) {
	const {
		value,
		...otherProps,
	} = props;

	return 	(
		<ActionButton
			className={styles["button"]}
			icon="chevron_left"
			iconPosition="left"
			{...otherProps}
		>
			<span className={styles["label"]}>{value}</span>
			<MaterialIcon className={styles["icon"]}>local_atm</MaterialIcon>
		</ActionButton>
	);
}

PurchaseButton.propTypes = {
	value: React.PropTypes.number.isRequired,
};
