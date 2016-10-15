import { setup as setupSVGPanZoom } from "../../../utils/camera";
import StageCanvas from "../../../StageCanvas";

/** Reference to the rendered <svg> element */
let refSVGElement = null;
const setRefSVGElement = el => { refSVGElement = el; };

/**
 * Reference to the rendered <g> element
 * Used by svg-pan-zoom as panning viewport
 */
let refViewportElement = null;

/**
 * Store reference to rendered <g> element
 * Exposed to StageCanvas as callback property
 * @public
 */
const setRefViewportElement = el => { refViewportElement = el; };

export default class Stage extends React.Component {
	componentDidMount() {
		// Wait for DOM painting to finish before initialize svg-pan-zoom
		// http://stackoverflow.com/a/28748160/585371
		setTimeout(() => window.requestAnimationFrame(() => setupSVGPanZoom(refSVGElement, refViewportElement)), 0);
	}

	render() {
		return (
			<svg width="100%" height="100%" ref={ setRefSVGElement }>
				<StageCanvas setPanViewport={ setRefViewportElement } />
			</svg>
		);
	}
}