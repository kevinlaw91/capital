import classnames from "classnames";
import CloseButton from "./CloseButton";
import styles from "./PromptBox.scss";

export default function PromptBox(props) {
	const {
		className,
		title,
		closeButton,
		actionButtons,
		...otherProps,
	} = props;

	const closeButtonFragment = (typeof closeButton === "object") && (
		<CloseButton
			title={closeButton.title}
			onClick={closeButton.onClick}
		/>
	);

	return (
		<section
			className={classnames(styles["wrapper"], className)}
			{...otherProps}
		>
			<div className={styles["flex"]}>
				{closeButtonFragment}
				<div className={styles["col-left"]}>
					<h1 className={styles["title"]}>{title}</h1>
					<div className={styles["contents"]}>{props.children}</div>
				</div>
				<div className={styles["col-right"]}>
					{actionButtons}
				</div>
			</div>
		</section>
	);
}

PromptBox.propTypes = {
	className: React.PropTypes.string,
	title: React.PropTypes.string,
	closeButton: React.PropTypes.object,
	actionButtons: React.PropTypes.node,
	children: React.PropTypes.node,
};