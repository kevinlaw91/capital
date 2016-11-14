import classnames from "classnames";
import MaterialIcon from "ui/components/MaterialIcon";
import styles from "./CloseButton.scss";

export default function CloseButton(props) {
	const {
		className,
		title,
		...otherProps,
	} = props;

	return (
		<button
			className={classnames(styles["button"], className)}
			title={title || "Close"}
			{...otherProps}
		>
			<MaterialIcon className={styles["icon"]}>close</MaterialIcon>
		</button>
	);
}

CloseButton.propTypes = {
	className: React.PropTypes.string,
	title: React.PropTypes.string,
	onClick: React.PropTypes.func,
};