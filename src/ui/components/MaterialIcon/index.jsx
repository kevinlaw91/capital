import classnames from "classnames";
import styles from "./MaterialIcon.scss";

/**
 * Render a material icon.
 * Specify the icon identifier as content.
 * @example
 * <MaterialIcon>icon_id</MaterialIcon>
 */
export default function MaterialIcon(props) {
	const { className, ...otherProps } = props;

	return (
		<i className={classnames(styles.icon, className)} {...otherProps}>
			{props.children}
		</i>
	);
}

MaterialIcon.propTypes = {
	children: _props => {
		if (!_props.children) {
			return new Error("Icon identifier not found in child content.");
		}
	},
	className: React.PropTypes.string,
};