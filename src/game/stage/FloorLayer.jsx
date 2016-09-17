import { connect } from "react-redux";

function FloorLayer(props) {
	return (
		<g>
			{ props.items.map(
				(entry, index) => {
					let href = `#${entry.symbol}` + (entry.variant ? `-${entry.variant}` : "");

					return <use key={index} x={entry.x} y={entry.y} xlinkHref={href} />;
				}
			)}
		</g>
	);
}

FloorLayer.propTypes = {
	items: React.PropTypes.array
};

const mapStateToProps = (state) => {
	return {
		items: state.floor
	};
};

export default connect(mapStateToProps)(FloorLayer);