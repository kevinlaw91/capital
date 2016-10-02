import FloorLayer from "./FloorLayer";

export default function StageCanvas(props) {
	const setAsPanViewport = (el) => props.setPanViewport(el);

	return (
		<g ref={ setAsPanViewport }>
			<rect x="0" y="0" width="1100" height="600" fill="transparent" />
			<FloorLayer />
		</g>
	);
}

StageCanvas.propTypes = {
	// Callback provided by parent component
	// to specify the <g> element used by svg-pan-zoom library
	setPanViewport: React.PropTypes.func
};