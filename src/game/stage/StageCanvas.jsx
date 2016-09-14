export default function StageCanvas(props) {
	this.setAsPanViewport = element => props.setPanViewport(element);

	return (
		<g ref={ this.setAsPanViewport }>
			<rect x="0" y="0" width="1920" height="1080" fill="transparent" stroke="#555" strokeWidth="5" />
		</g>
	);
}

StageCanvas.propTypes = {
	// Callback provided by parent component
	// to specify the <g> element used by svg-pan-zoom library
	setPanViewport: React.PropTypes.func
};