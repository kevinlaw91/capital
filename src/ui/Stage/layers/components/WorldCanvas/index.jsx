export default function WorldCanvas(props) {
	return (
		<g transform={`translate(${props.x}, ${props.y})`}>
			{props.children}
		</g>
	);
}

WorldCanvas.defaultProps ={
	x: 0,
	y: 0,
};

WorldCanvas.propTypes = {
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	children: React.PropTypes.node,
};