import FloorLayer from "./layers/FloorLayer";
import TokenLayer from "./layers/TokenLayer";

export default function StageCanvas(props) {
	const setAsPanViewport = (el) => props.setPanViewport(el);

	return (
		<g ref={ setAsPanViewport }>
			<FloorLayer />
			<TokenLayer />
		</g>
	);
}

StageCanvas.propTypes = {
	// Callback provided by parent component
	// to specify the <g> element used by svg-pan-zoom library
	setPanViewport: React.PropTypes.func
};