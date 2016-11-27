import MaterialIcon from "ui/components/MaterialIcon";
import classnames from "classnames/bind";
import styles from "./ActionButton.scss";

const cx = classnames.bind({
	"flex": styles["flex"],
	"reversed": styles["reversed"],
});

export default function ActionButton(props) {
	const {
		className,
		icon,
		iconPosition,
		...otherProps,
	} = props;

	const iconFragment = icon && (
		<div>
			<MaterialIcon>{icon}</MaterialIcon>
		</div>
	);

	return (
		<button
			className={cx(styles["button"], className)}
			title={props.title}
			{...otherProps}
		>
			<div
				className={cx({
					"flex": true,
					"reversed": (iconPosition === "left"),
				})}
			>
				<div className={styles["label"]}>
					{props.children}
				</div>
				{iconFragment}
			</div>
		</button>
	);
}
ActionButton.propTypes = {
	className: React.PropTypes.string,
	icon: React.PropTypes.string,
	iconPosition: React.PropTypes.oneOf(["left", "right"]),
	title: React.PropTypes.string,
	children: React.PropTypes.node,
};