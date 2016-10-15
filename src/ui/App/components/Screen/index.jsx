import classNames from "classnames";

export default function Screen(props) {
	let { children, className, fullscreen, ...other } = props;

	// Merge custom classes with default styles
	let classSet = classNames({
		"screen": true,
		"flex-center": true,
		"fullscreen": fullscreen
	}, className);

	return (
		<div className={classSet} {...other}>
			{children}
		</div>
	);
}

Screen.propTypes = {
	fullscreen: React.PropTypes.bool,
	children: React.PropTypes.node,
	className: React.PropTypes.string
};